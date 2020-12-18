import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.module';
import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { CompanyModule } from './company/company.module';
import { SiteModule } from './site/site.module';
import { SiteRegisterModule } from './site-register/site-register.module';
import { UserModule } from './user/user.module';
import { GroupUserModule } from './group-user/group-user.module';
import { GroupUserTemplateModule } from './group-user-template/group-user-template.module';
import { FunctionsModule } from './functions/functions.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { emailConfig } from './config/email_config';


@Module({
  imports: [
    DatabaseModule,
    FunctionsModule,
    ApplicationModule,
    CompanyModule,
    SiteModule,
    SiteRegisterModule,
    UserModule,
    GroupUserModule,
    GroupUserTemplateModule,
    AuthModule,

    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'gmail',
          auth: {
            user: emailConfig.email,
            pass: emailConfig.password
          },
        },
        defaults: {
          from: emailConfig.email,
        }
      }),
    }),


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class EcoModule { }
