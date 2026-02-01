import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}

  async create(
    createCertificateDto: CreateCertificateDto,
  ): Promise<Certificate> {
    const existing = await this.certificateRepository.findOne({
      where: {
        user_id: createCertificateDto.user_id,
        course_id: createCertificateDto.course_id,
      },
      select: ['id'],
    });

    if (existing) {
      throw new BadRequestException(
        'El usuario ya tiene un certificado para este curso',
      );
    }

    const providedCode = createCertificateDto.certificate_code?.trim();
    let certificateCode = providedCode;

    if (!certificateCode) {
      const year = new Date().getFullYear();
      const prefix = `CERTEMMA_${year}_`;
      const latest = await this.certificateRepository
        .createQueryBuilder('certificate')
        .select('certificate.certificate_code', 'certificate_code')
        .where('certificate.certificate_code LIKE :prefix', {
          prefix: `${prefix}%`,
        })
        .orderBy(
          "CAST(split_part(certificate.certificate_code, '_', 3) AS INTEGER)",
          'DESC',
        )
        .addOrderBy('certificate.id', 'DESC')
        .getRawOne<{ certificate_code?: string }>();

      const lastNumber = latest?.certificate_code
        ? Number(latest.certificate_code.split('_')[2])
        : 0;
      const nextNumber = Number.isFinite(lastNumber) ? lastNumber + 1 : 1;
      certificateCode = `${prefix}${nextNumber}`;
    }

    const certificate = this.certificateRepository.create({
      ...createCertificateDto,
      certificate_code: certificateCode,
    });
    return await this.certificateRepository.save(certificate);
  }

  async findAll(params: {
    page: number;
    limit: number;
    userId?: number;
    courseId?: number;
    currentUserId: number;
    userRole: string;
  }): Promise<{
    data: Certificate[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, userId, courseId, currentUserId, userRole } = params;
    const where: {
      user_id?: number;
      course_id?: number;
      OR?: Array<{
        user?: { created_by: number };
        course?: { created_by: number };
      }>;
    } = {};

    // Filtros según rol
    if (userRole === 'guest') {
      where.user_id = currentUserId;
    } else if (userRole === 'editor') {
      where.OR = [
        { user: { created_by: currentUserId } },
        { course: { created_by: currentUserId } },
      ];
    }

    if (userId) {
      where.user_id = userId;
    }

    if (courseId) {
      where.course_id = courseId;
    }

    const [data, total] = await this.certificateRepository.findAndCount({
      where,
      relations: ['user', 'course'],
      skip: (page - 1) * limit,
      take: limit,
      order: { issued_at: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findByUser(userId: number): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      where: { user_id: userId },
      relations: ['course', 'user'],
      order: { issued_at: 'DESC' },
    });
  }

  async findByCourse(courseId: number): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      where: { course_id: courseId },
      relations: ['user'],
      order: { issued_at: 'DESC' },
    });
  }

  async findOne(
    id: number,
    currentUserId?: number,
    userRole?: string,
  ): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
      relations: ['user', 'course'],
    });
    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    // Verificar permisos
    if (userRole === 'guest' && certificate.user_id !== currentUserId) {
      throw new Error('Insufficient permissions');
    }

    if (userRole === 'editor') {
      if (
        certificate.user.created_by !== currentUserId &&
        certificate.course.created_by !== currentUserId
      ) {
        throw new Error('Insufficient permissions');
      }
    }

    return certificate;
  }

  async findByCertificateNumber(
    certificateNumber: string,
  ): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { certificate_code: certificateNumber },
      relations: ['user', 'course'],
    });
    if (!certificate) {
      throw new NotFoundException(
        `Certificate with number ${certificateNumber} not found`,
      );
    }
    return certificate;
  }

  async update(
    id: number,
    updateCertificateDto: UpdateCertificateDto,
  ): Promise<Certificate> {
    const certificate = await this.findOne(id);
    Object.assign(certificate, updateCertificateDto);
    return await this.certificateRepository.save(certificate);
  }

  async remove(id: number): Promise<void> {
    const certificate = await this.findOne(id);
    await this.certificateRepository.remove(certificate);
  }
}
