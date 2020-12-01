import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { SiteRegisterController } from './site-register.controller';
import { SiteRegisterService } from './site-register.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteRegister } from './entities/site-register.entity';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';
import { Site } from 'src/site/entities/site.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SiteRegister, Site]),
  ],
  controllers: [SiteRegisterController],
  providers: [SiteRegisterService],
})
export class SiteRegisterModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthorizationMiddleware)
          .forRoutes(SiteRegisterController);
  }
}
