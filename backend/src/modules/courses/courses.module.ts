import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Course,
  CourseMaterial,
  CourseAssignment,
  CourseAssignmentGroup,
  CourseProgress,
  Certificate,
} from './entities';
import { CoursesService } from './courses.service';
import { CourseMaterialsService } from './course-materials.service';
import { CourseAssignmentsService } from './course-assignments.service';
import { CourseAssignmentGroupsService } from './course-assignment-groups.service';
import { CourseProgressService } from './course-progress.service';
import { CertificatesService } from './certificates.service';
import { CoursesController } from './courses.controller';
import { CourseAssignmentsController } from './course-assignments.controller';
import { CourseAssignmentGroupsController } from './course-assignment-groups.controller';
import { CertificatesController } from './certificates.controller';
import { CourseProgressController } from './course-progress.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      CourseMaterial,
      CourseAssignment,
      CourseAssignmentGroup,
      CourseProgress,
      Certificate,
    ]),
  ],
  controllers: [
    CoursesController,
    CourseAssignmentsController,
    CourseAssignmentGroupsController,
    CertificatesController,
    CourseProgressController,
  ],
  providers: [
    CoursesService,
    CourseMaterialsService,
    CourseAssignmentsService,
    CourseAssignmentGroupsService,
    CourseProgressService,
    CertificatesService,
  ],
  exports: [
    CoursesService,
    CourseMaterialsService,
    CourseAssignmentsService,
    CourseProgressService,
    CertificatesService,
  ],
})
export class CoursesModule {}
