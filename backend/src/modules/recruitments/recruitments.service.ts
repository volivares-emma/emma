import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recruitment } from './entities/recruitment.entity';
import { CreateRecruitmentDto } from './dto/create-recruitment.dto';
import { UpdateRecruitmentDto } from './dto/update-recruitment.dto';

@Injectable()
export class RecruitmentsService {
  constructor(
    @InjectRepository(Recruitment)
    private readonly recruitmentRepository: Repository<Recruitment>,
  ) {}

  async create(
    createRecruitmentDto: CreateRecruitmentDto,
  ): Promise<Recruitment> {
    const recruitment = this.recruitmentRepository.create(createRecruitmentDto);
    return await this.recruitmentRepository.save(recruitment);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Recruitment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.recruitmentRepository.findAndCount({
      relations: ['job_position'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findByJobPosition(jobPositionId: number): Promise<Recruitment[]> {
    return await this.recruitmentRepository.find({
      where: { position_id: jobPositionId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Recruitment> {
    const recruitment = await this.recruitmentRepository.findOne({
      where: { id },
      relations: ['job_position'],
    });
    if (!recruitment) {
      throw new NotFoundException(`Recruitment with ID ${id} not found`);
    }
    return recruitment;
  }

  async update(
    id: number,
    updateRecruitmentDto: UpdateRecruitmentDto,
  ): Promise<Recruitment> {
    const recruitment = await this.findOne(id);
    Object.assign(recruitment, updateRecruitmentDto);
    return await this.recruitmentRepository.save(recruitment);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.recruitmentRepository.softDelete(id);
  }
}
