import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';
import { Company } from 'src/company/entities/company.entity';
import { GroupUser } from 'src/group-user/entities/group-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company, GroupUser]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthorizationMiddleware)
          .forRoutes(UserController);
  }
}
