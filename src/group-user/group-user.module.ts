import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { GroupUserController } from './group-user.controller';
import { GroupUserService } from './group-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupUser } from './entities/group-user.entity';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupUser]),
  ],
  controllers: [GroupUserController],
  providers: [GroupUserService],
})
export class GroupUserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthorizationMiddleware)
          .forRoutes(GroupUserController);
  }
}
