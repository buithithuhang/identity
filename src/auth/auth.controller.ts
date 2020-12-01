import { Controller, UseInterceptors, Get, Post, Body, Req } from "@nestjs/common";
import { ApiTags, ApiHeader, ApiBearerAuth } from "@nestjs/swagger";
import { Problem } from "src/common";
import { Company } from "src/company/entities/company.entity";
import { AuthService } from "./auth.service";
import { ReqRegister } from "./models/req-register.model";
import { ResRegister } from "./models/res-register.model";

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
    @Post()
    async login() {

    }
}