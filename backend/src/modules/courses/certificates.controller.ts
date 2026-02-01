import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

type AuthRequest = { user: { userId: number; role: UserRole } };

@Controller('certificates')
@UseGuards(JwtAuthGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createDto: CreateCertificateDto) {
    return this.certificatesService.create(createDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('pageSize') pageSize?: string,
    @Query('user_id') userId?: string,
    @Query('course_id') courseId?: string,
    @Request() req?: AuthRequest,
  ) {
    return this.certificatesService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : pageSize ? parseInt(pageSize) : 10,
      userId: userId ? parseInt(userId) : undefined,
      courseId: courseId ? parseInt(courseId) : undefined,
      currentUserId: req?.user?.userId ?? 0,
      userRole: req?.user?.role ?? UserRole.GUEST,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.certificatesService.findOne(
      +id,
      req.user.userId,
      req.user.role,
    );
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updateDto: UpdateCertificateDto) {
    return this.certificatesService.update(+id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.certificatesService.remove(+id);
  }
}
