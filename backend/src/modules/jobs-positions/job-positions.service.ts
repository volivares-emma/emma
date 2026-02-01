import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { JobPosition } from './entities/job-position.entity';
import { CreateJobPositionDto } from './dto/create-job-position.dto';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';

@Injectable()
export class JobPositionsService {
  constructor(
    @InjectRepository(JobPosition)
    private readonly jobPositionRepository: Repository<JobPosition>,
  ) {}

  async create(
    createJobPositionDto: CreateJobPositionDto,
  ): Promise<JobPosition> {
    const jobPosition = this.jobPositionRepository.create(createJobPositionDto);
    return await this.jobPositionRepository.save(jobPosition);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: JobPosition[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.jobPositionRepository.findAndCount({
      where: { deleted_at: IsNull() },
      relations: ['recruitments'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findActive(): Promise<JobPosition[]> {
    return await this.jobPositionRepository.find({
      where: {
        is_active: true,
        deleted_at: IsNull(),
      },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<JobPosition> {
    const jobPosition = await this.jobPositionRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['recruitments'],
    });
    if (!jobPosition) {
      throw new NotFoundException(`JobPosition with ID ${id} not found`);
    }
    return jobPosition;
  }

  async update(
    id: number,
    updateJobPositionDto: UpdateJobPositionDto,
  ): Promise<JobPosition> {
    const jobPosition = await this.findOne(id);
    Object.assign(jobPosition, updateJobPositionDto);
    return await this.jobPositionRepository.save(jobPosition);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.jobPositionRepository.softDelete(id);
  }
}
