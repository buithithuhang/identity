import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Problem } from "src/common";
import { Company } from "src/company/entities/company.entity";
import { GroupUser } from "src/group-user/entities/group-user.entity";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { ReqLogin } from "./models/req-login.model";
import { ReqRegister } from "./models/req-register.model";
import { ResRegister } from "./models/res-register.model";
import { Request } from 'express';
import { Site } from "src/site/entities/site.entity";
import { Application } from "src/application/entities/application.entity";
import { EmailTemplate } from "src/email-template/entities/email-template.entity";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Company)
        private companyRepository: Repository<Company>,

        @InjectRepository(GroupUser)
        private groupUserRepository: Repository<GroupUser>,

        @InjectRepository(Application)
        private applicationRepository: Repository<Application>,

        @InjectRepository(EmailTemplate)
        private emailTemplateRepository: Repository<EmailTemplate>,


    ) {


    }

    async register(req: Request, body: ReqRegister): Promise<ResRegister | Problem> {

        // Kiểm tra nếu một trong 3 giá trị bị trùng khớp thì trả về lỗi 400	
        try {
            var users = await this.userRepository.find({
                where: [
                    { UserName: body.username },
                    { Phone: body.phone },
                    { Email: body.email },]
            });
            if (users.length > 0) {
                // return error 400
                //console.log('Validation failed: ', Error);
                throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
            }
        } catch (ex) {
            return Problem.InternalServerError();
        }

        // Nếu cả 3 giá trị trên không bị trùng khớp, tạo mới tài khoản cho người dùng
        try {

            let user: User = new User();
            user.UserName = body.username;
            //...
            user = await this.userRepository.save(user);

        } catch (ex) {
            return Problem.InternalServerError();
        }

        //Tạo công ty
        let company = new Company();
        try {
            company.Name = body.company_name;

            company = await this.companyRepository.save(company);
        } catch (ex) {
            return Problem.InternalServerError();
        }

        //Tạo Site
        let application: Application;
        try {
            application = await this.applicationRepository.findOne({
                HostName: req.hostname
            });
            if (!application) {
                return Problem.BadRequest();
            }
        } catch (ex) {
            return Problem.InternalServerError();
        }
        let site: Site;
        try {
            site = new Site();
            site.Application = application;
            site.Company = company;
            //...
            site = await this.userRepository.save(site);

        } catch (ex) {
            return Problem.InternalServerError();
        }
        // Tạo khách sạn


        // Chọn mẫu email và điền dữ liệu vào mẫu  
        // -> get email template
        let emailTemplate;
        try {
            emailTemplate = this.emailTemplateRepository.findOne({ Key: 'register' });
            if (!emailTemplate) {
                return Problem.BadRequest();
            }
        } catch (ex) {
            return Problem.InternalServerError();
        }


        // Tạo ngẫu nhiên 6 ký tự được cấp dưới dạng (0-9 a-z A-Z) 
        try {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;

        } catch (ex) {
            return Problem.InternalServerError();
        }
        // mapping data to email template


        // send email


    }


    async login(req: Request, body: ReqLogin) {

    }
}