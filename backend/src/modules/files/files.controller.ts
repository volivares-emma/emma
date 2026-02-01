import {
  Controller,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { fileStorage, fileFilter, fileSizeLimit } from './config/multer.config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // Endpoint público sin autenticación
  @Get('public')
  findByRelatedPublic(
    @Query('related_type') relatedType: string,
    @Query('related_id') relatedId: string,
  ) {
    if (!relatedType || !relatedId) {
      return [];
    }
    return this.filesService.findByRelated(relatedType, parseInt(relatedId));
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
      fileFilter: fileFilter,
      limits: { fileSize: fileSizeLimit.file },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('related_type') relatedType: string,
    @Body('related_id') relatedId: string,
  ) {
    return this.filesService.uploadFile(
      file,
      relatedType,
      parseInt(relatedId, 10),
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.filesService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('related/:type/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  findByRelated(@Param('type') type: string, @Param('id') id: string) {
    return this.filesService.findByRelated(type, parseInt(id));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }

  @Post('cleanup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  cleanup() {
    return this.filesService.cleanupOrphanedFiles();
  }
}
