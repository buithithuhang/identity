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
import { GroupUserRoleModule } from './group-user-role/group-user-role.module';
import { FunctionsModule } from './functions/functions.module';


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
    GroupUserRoleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class EcoModule { }
