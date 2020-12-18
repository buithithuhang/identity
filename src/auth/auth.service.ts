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
import { GroupUserTemplate } from "src/group-user-template/entities/group-user-template.entity";
import { RequestTarget as request } from "src/common";
import { Crypto } from './crypt';
import * as jwt from 'jsonwebtoken';
import { MailerService } from "@nestjs-modules/mailer";
import { emailConfig } from "src/config/email_config";

interface MailData {
    to: string, subject: string, text: string, html: string
}
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

        @InjectRepository(Site)
        private siteRepository: Repository<Site>,

        @InjectRepository(EmailTemplate)
        private emailTemplateRepository: Repository<EmailTemplate>,

        @InjectRepository(GroupUserTemplate)
        private groupUserTemplateRepository: Repository<GroupUserTemplate>,

        private readonly mailerService: MailerService,
    ) {

    }

    async register(req: Request, body: ReqRegister): Promise<ResRegister | Problem> {

        console.log("req.hostname" + req.hostname);
        // Kiểm tra nếu một trong 3 giá trị bị trùng khớp thì trả về lỗi 400	
        try {
            var users = await this.userRepository.find({
                where: [
                    { Username: body.username },
                    { Phone: body.phone },
                    { Email: body.email },
                ]
            });
            if (users.length > 0) {
                // return error 400
                //console.log('Validation failed: ', Error);
                return Problem.BadRequest('User already exists');
            }
        } catch (ex) {
            return Problem.InternalServerError();
        }
        let code = '';
        // Tạo ngẫu nhiên 6 ký tự được cấp dưới dạng (0-9 a-z A-Z) 
        try {

            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < 6; i++) {
                code += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
        } catch (ex) {
            return Problem.InternalServerError();
        }
        // Nếu cả 3 giá trị trên không bị trùng khớp, tạo mới tài khoản cho người dùng\
        let user: User;

        // ma hoa password nhe
        let passwordHash = Crypto.crypt(body.password);
        try {
            user = new User();
            user.Username = body.username;
            user.Email = body.email;
            user.Phone = body.phone;
            user.Code = code;
            user.Password = passwordHash;
            // user.Company= body.company_name;
            // user.Password= body.password;
            //... nho bo sung cac field dang ky giup anh email, phone...
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
            site.Domain = `${company.Name.toLowerCase().replace('/\ /gi', '')}.${req.hostname}`;
            //...
            site = await this.siteRepository.save(site);
            req.body.site_id = site.Id;
        } catch (ex) {
            return Problem.InternalServerError();
        }

        // tạo group user from group user template

        let groupUserTemplate: GroupUserTemplate[];
        try {
            groupUserTemplate = await this.groupUserTemplateRepository.find();
        } catch (ex) {
            return Problem.InternalServerError();
        }

        let userGroup: GroupUser[];
        try {
            let arrUserGroups = [];
            for (let i = 0; i < groupUserTemplate.length; i++) {
                let gr = groupUserTemplate[i];
                let group = new GroupUser();
                group.Name = gr.Name;
                group.Description = gr.Description;
                group.Roles = gr.Roles;
                group.IsDefault = gr.IsDefault;
                group.setBaseDataInfo(req);
                arrUserGroups.push(group);
            }
            userGroup = await this.groupUserRepository.save(arrUserGroups);
        } catch (error) {

        }
        // update user group default
        try {
            let groupUserDefault = userGroup.find(g => g.IsDefault === true)
            user.GroupUser = groupUserDefault;

            // update user info
            user.Company = company;
            await this.userRepository.save(user);
        } catch (error) {
            return Problem.InternalServerError();
        }


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



        // mapping data to email_template

        try {
            // send email
            const mailer = { to: user.Email, subject: 'register', text: 'verify code: ' + user.Code } as MailData;
            await this
                .mailerService
                .sendMail({
                    to: mailer.to, // list of receivers
                    from: emailConfig.email, // sender address
                    subject: mailer.subject, // Subject line
                    text: mailer.text, // plaintext body
                    html: mailer.html, // HTML body content
                });
        } catch (error) {
            return Problem.InternalServerError();
        }

        return Problem.Ok("register successfully");
    }

    async verifyCode(req: Request, code: string) {
        // get data user registed 
        let user: User;
        try {
            user = await this.userRepository.findOne({
                relations: ['Company'],
                where: {
                    Code: code
                }
            })
            // neeus ko tim duoc user da dang ky theo code
            if (!user) {
                return Problem.NotFound('User not found');
            }

            user.IsVerified = 1;
            await this.userRepository.save(user);
        } catch (error) {
            return Problem.InternalServerError();
        }
        console.log(`${user.Company.Name.toLowerCase().replace('/\ /gi', '')}.${req.hostname}`);
        try {
            //get site id
            let site = await this.siteRepository.findOne({
                Domain: `${user.Company.Name.toLowerCase().replace('/\ /gi', '')}.${req.hostname}`
            });
            req.headers.authorization = "Bear init";
            req.headers.site_id = site.Id;
            let init = await request.post(req, { url: `${process.env.HKM_API}/init` });
            console.log(init);
            console.log("init hkm module successfully")

        } catch (error) {

        }

        // loign
        return this.login(req, new ReqLogin(user.Username, Crypto.decrypt(user.Password)))
    }


    async login(req: Request, body: ReqLogin) {

        // vaidate
        // [1] validate data
        const validMessages = ReqLogin.runValidator(body);
        if (validMessages?.length > 0) {
            return Problem.BadRequest(validMessages);
        }

        // get user by username/email/phonenumber
        let user: User;
        try {
            user = await this.userRepository.findOne({
                relations: ['Company'],
                where: [
                    { UserName: body.username },
                    { Phone: body.username },
                    { Email: body.username },]
            });
            if (!user) {
                return Problem.NotFound('User not found');
            }
        } catch (ex) {
            return Problem.InternalServerError();
        }

        // check password
        let passwordHash = Crypto.crypt(body.password);
        if (passwordHash !== user.Password) {
            return Problem.NotFound('Password is incorrect');
        }
        // get siteId from domain name
        let site: Site;
        try {
            site = await this.siteRepository.findOne({
                Domain: body.domain
            })
        } catch (error) {
            return Problem.InternalServerError();
        }
        // generate access token
        // su dung jwt 
        let exp = Math.floor(Date.now() / 1000) + (60 * 60)
        let access_token = jwt.sign({
            exp,
            data: user
        }, 'secret');

        return { site_id: site.Id, access_token, exp }
    }
}