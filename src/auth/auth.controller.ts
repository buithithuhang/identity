import { Controller, UseInterceptors, Get, Post, Body, Req, Param } from "@nestjs/common";
import { ApiTags, ApiHeader, ApiBearerAuth } from "@nestjs/swagger";
import { Problem } from "src/common";
import { Company } from "src/company/entities/company.entity";
import { AuthService } from "./auth.service";
import { ReqRegister } from "./models/req-register.model";
import { ResRegister } from "./models/res-register.model";
import {Request} from 'express';
import { ReqLogin } from "./models/req-login.model";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Req() req: Request, @Body() body: ReqRegister): Promise<ResRegister | Problem> {
        const result = this.authService.register(req, body);
        return (result instanceof Problem)
            ? Problem.HttpException(result)
            : result;
    }
    @Post('verify/:code')
    async verify(@Req() req: Request, @Param('code') code: string) {
        const result = this.authService.verifyCode(req, code);
        return (result instanceof Problem)
            ? Problem.HttpException(result)
            : result;
    }
    @Post('login')
    async login(@Req() req: Request,@Body() body: ReqLogin) {
        const result = this.authService.login(req, body);
        return (result instanceof Problem)
            ? Problem.HttpException(result)
            : result;
    }
}