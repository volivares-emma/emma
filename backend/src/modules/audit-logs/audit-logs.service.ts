import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(createAuditLogDto);
    return await this.auditLogRepository.save(auditLog);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: AuditLog[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.auditLogRepository.findAndCount({
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<AuditLog> {
    const auditLog = await this.auditLogRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!auditLog) {
      throw new NotFoundException(`AuditLog with ID ${id} not found`);
    }
    return auditLog;
  }

  async findByUser(userId: number): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { user_id: userId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByEntity(
    entityType: string,
    entityId: number,
  ): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { entity_type: entityType, entity_id: entityId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { action },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }
}
