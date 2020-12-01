import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';
import { Application } from 'src/application/entities/application.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Site, Application, Company]),
  ],
  controllers: [SiteController],
  providers: [SiteService],
})
export class SiteModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthorizationMiddleware)
          .forRoutes(SiteController);
  }
}
