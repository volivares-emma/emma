import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Slide } from './entities/slide.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';

@Injectable()
export class SlidesService {
  constructor(
    @InjectRepository(Slide)
    private readonly slideRepository: Repository<Slide>,
  ) {}

  async create(createSlideDto: CreateSlideDto): Promise<Slide> {
    const slide = this.slideRepository.create(createSlideDto);
    return await this.slideRepository.save(slide);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Slide[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.slideRepository.findAndCount({
      where: { deleted_at: IsNull() },
      skip: (page - 1) * limit,
      take: limit,
      order: { sort_order: 'ASC' },
    });

    return { data, total, page, limit };
  }

  async findActive(): Promise<Slide[]> {
    return await this.slideRepository.find({
      where: { is_active: true, deleted_at: IsNull() },
      order: { sort_order: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Slide> {
    const slide = await this.slideRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }
    return slide;
  }

  async update(id: number, updateSlideDto: UpdateSlideDto): Promise<Slide> {
    const slide = await this.findOne(id);
    Object.assign(slide, updateSlideDto);
    return await this.slideRepository.save(slide);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.slideRepository.softDelete(id);
  }
}
