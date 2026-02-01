import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
  ) {}

  async create(
    createTestimonialDto: CreateTestimonialDto,
  ): Promise<Testimonial> {
    const testimonial = this.testimonialRepository.create(createTestimonialDto);
    return await this.testimonialRepository.save(testimonial);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Testimonial[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.testimonialRepository.findAndCount({
      where: { deleted_at: IsNull() },
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findActive(): Promise<Testimonial[]> {
    return await this.testimonialRepository.find({
      where: { is_active: true, deleted_at: IsNull() },
      order: { created_at: 'DESC' },
    });
  }

  async findFeatured(): Promise<Testimonial[]> {
    return await this.testimonialRepository.find({
      where: { is_active: true, is_featured: true, deleted_at: IsNull() },
      order: { rating: 'DESC', created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Testimonial> {
    const testimonial = await this.testimonialRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return testimonial;
  }

  async update(
    id: number,
    updateTestimonialDto: UpdateTestimonialDto,
  ): Promise<Testimonial> {
    const testimonial = await this.findOne(id);
    Object.assign(testimonial, updateTestimonialDto);
    return await this.testimonialRepository.save(testimonial);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.testimonialRepository.softDelete(id);
  }
}
