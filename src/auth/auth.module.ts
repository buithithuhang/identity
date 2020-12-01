import { Module, MiddlewareConsumer, NestModule, UseGuards } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthorizationMiddleware)
          .forRoutes(AuthController);
  }
}
