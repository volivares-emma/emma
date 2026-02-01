import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Express } from 'express';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async create(createFileDto: CreateFileDto): Promise<File> {
    const file = this.fileRepository.create(createFileDto);
    return await this.fileRepository.save(file);
  }

  async uploadFile(
    file: Express.Multer.File,
    relatedType: string,
    relatedId: number,
  ): Promise<File> {
    const fileRecord = this.fileRepository.create({
      filename: file.filename,
      path: `/uploads/${relatedType}/${file.filename}`,
      related_type: relatedType,
      related_id: relatedId,
    });
    return await this.fileRepository.save(fileRecord);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: File[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.fileRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<File> {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    return file;
  }

  async findByRelated(relatedType: string, relatedId: number): Promise<File[]> {
    return await this.fileRepository.find({
      where: { related_type: relatedType, related_id: relatedId },
      order: { created_at: 'DESC' },
    });
  }

  async update(id: number, updateFileDto: UpdateFileDto): Promise<File> {
    const file = await this.findOne(id);
    Object.assign(file, updateFileDto);
    return await this.fileRepository.save(file);
  }

  async remove(id: number): Promise<void> {
    const file = await this.findOne(id);
    await this.fileRepository.remove(file);
  }

  async cleanupOrphanedFiles(): Promise<{ deleted: number; files: string[] }> {
    // Encuentra archivos sin referencia (related_id NULL o related_type NULL)
    const orphanedFiles = await this.fileRepository
      .createQueryBuilder('file')
      .where('file.related_id IS NULL')
      .orWhere('file.related_type IS NULL')
      .getMany();

    const deletedFiles: string[] = [];
    for (const file of orphanedFiles) {
      if (file.path) {
        deletedFiles.push(file.path);
      }
      await this.fileRepository.remove(file);
    }

    return { deleted: deletedFiles.length, files: deletedFiles };
  }
}
