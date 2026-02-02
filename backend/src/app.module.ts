import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { BlogsModule } from '@modules/blogs/blogs.module';
import { ContactsModule } from '@modules/contacts/contacts.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { SubscriptionsModule } from '@modules/subscriptions/subscriptions.module';
import { JobsModule } from '@/modules/jobs-positions/job-positions.module';
import { RecruitmentsModule } from '@modules/recruitments/recruitments.module';
import { CoursesModule } from '@modules/courses/courses.module';
import { FilesModule } from '@modules/files/files.module';
import { SlidesModule } from '@modules/slides/slides.module';
import { TestimonialsModule } from '@modules/testimonials/testimonials.module';
import { AuditLogsModule } from '@modules/audit-logs/audit-logs.module';
import { ReportsModule } from '@modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        host: config.get('DB_HOST') || 'localhost',
        port: parseInt(config.get('DB_PORT') || '5432', 10),
        username: config.get('DB_USERNAME') || 'postgres',
        password: config.get('DB_PASSWORD') || 'postgres',
        database: config.get('DB_DATABASE') || 'emma',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
      }),
    }),
    AuthModule,
    UsersModule,
    BlogsModule,
    ContactsModule,
    NotificationsModule,
    SubscriptionsModule,
    JobsModule,
    RecruitmentsModule,
    CoursesModule,
    FilesModule,
    SlidesModule,
    TestimonialsModule,
    AuditLogsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
