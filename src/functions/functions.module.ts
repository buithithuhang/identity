import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { FunctionsController } from './functions.controller';
import { FunctionsService } from './functions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Functions } from './entities/functions.entity';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';
import { Application } from 'src/application/entities/application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Functions, Application]),
  ],
  controllers: [FunctionsController],
  providers: [FunctionsService],
})
export class FunctionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthorizationMiddleware)
          .forRoutes(FunctionsController);
  }
}
