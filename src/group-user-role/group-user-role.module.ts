import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { GroupUserRoleController } from './group-user-role.controller';
import { GroupUserRoleService } from './group-user-role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupUserRole } from './entities/group-user-role.entity';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';
import { GroupUser } from 'src/group-user/entities/group-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupUserRole, GroupUser]),
  ],
  controllers: [GroupUserRoleController],
  providers: [GroupUserRoleService],
})
export class GroupUserRoleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthorizationMiddleware)
          .forRoutes(GroupUserRoleController);
  }
}
