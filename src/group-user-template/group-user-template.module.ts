import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { GroupUserTemplateController } from './group-user-template.controller';
import { GroupUserTemplateService } from './group-user-template.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupUserTemplate } from './entities/group-user-template.entity';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupUserTemplate]),
  ],
  controllers: [GroupUserTemplateController],
  providers: [GroupUserTemplateService],
})
export class GroupUserTemplateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthorizationMiddleware)
          .forRoutes(GroupUserTemplateController);
  }
}
