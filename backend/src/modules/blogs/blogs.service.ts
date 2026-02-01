import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Blog, BlogStatus } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const blog = this.blogRepository.create(createBlogDto);
    return await this.blogRepository.save(blog);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Blog[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.blogRepository.findAndCount({
      where: { deleted_at: IsNull() },
      relations: ['author'],
      skip: (page - 1) * limit,
      take: limit,
      order: { pub_date: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findPublished(): Promise<Blog[]> {
    return await this.blogRepository.find({
      where: { status: BlogStatus.PUBLISHED, deleted_at: IsNull() },
      relations: ['author'],
      order: { pub_date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['author'],
    });
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return blog;
  }

  async findBySlug(slug: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { slug, deleted_at: IsNull() },
      relations: ['author'],
    });
    if (!blog) {
      throw new NotFoundException(`Blog with slug ${slug} not found`);
    }
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.findOne(id);
    Object.assign(blog, updateBlogDto);
    return await this.blogRepository.save(blog);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.blogRepository.softDelete(id);
  }
}
