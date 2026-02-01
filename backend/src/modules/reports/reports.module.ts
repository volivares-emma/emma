import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Course } from '../courses/entities/course.entity';
import { CourseAssignment } from '../courses/entities/course-assignment.entity';
import { CourseProgress } from '../courses/entities/course-progress.entity';
import { Certificate } from '../courses/entities/certificate.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      CourseAssignment,
      CourseProgress,
      Certificate,
      User,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
