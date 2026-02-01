import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseMaterial } from './entities/course-material.entity';
import { CreateCourseMaterialDto } from './dto/create-course-material.dto';
import { UpdateCourseMaterialDto } from './dto/update-course-material.dto';

@Injectable()
export class CourseMaterialsService {
  constructor(
    @InjectRepository(CourseMaterial)
    private readonly materialRepository: Repository<CourseMaterial>,
  ) {}

  async create(
    createMaterialDto: CreateCourseMaterialDto,
  ): Promise<CourseMaterial> {
    const material = this.materialRepository.create(createMaterialDto);
    return await this.materialRepository.save(material);
  }

  async findByCourse(courseId: number): Promise<CourseMaterial[]> {
    return await this.materialRepository.find({
      where: { course_id: courseId },
      order: { sort_order: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CourseMaterial> {
    const material = await this.materialRepository.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!material) {
      throw new NotFoundException(`CourseMaterial with ID ${id} not found`);
    }
    return material;
  }

  async update(
    id: number,
    updateMaterialDto: UpdateCourseMaterialDto,
  ): Promise<CourseMaterial> {
    const material = await this.findOne(id);
    Object.assign(material, updateMaterialDto);
    return await this.materialRepository.save(material);
  }

  async remove(id: number): Promise<void> {
    const material = await this.findOne(id);
    await this.materialRepository.remove(material);
  }
}
