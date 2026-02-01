import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruitment } from './entities/recruitment.entity';
import { RecruitmentsService } from './recruitments.service';
import { RecruitmentsController } from './recruitments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Recruitment])],
  controllers: [RecruitmentsController],
  providers: [RecruitmentsService],
  exports: [RecruitmentsService],
})
export class RecruitmentsModule {}
