import { Module, MiddlewareConsumer, NestModule, UseGuards } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';
import { User } from 'src/user/entities/user.entity';
import { GroupUserTemplate } from 'src/group-user-template/entities/group-user-template.entity';
import { EmailTemplate } from 'src/email-template/entities/email-template.entity';
import { Application } from 'src/application/entities/application.entity';
import { GroupUser } from 'src/group-user/entities/group-user.entity';
import { Company } from 'src/company/entities/company.entity';
import { Site } from 'src/site/entities/site.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company, Site, GroupUser, Application, GroupUserTemplate, EmailTemplate]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
