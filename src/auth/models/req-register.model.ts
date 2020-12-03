import { ApiProperty } from "@nestjs/swagger";
import { Validator } from "class-validator";
import * as Consts from './../../common/consts';

export class ReqRegister {
    static runValidate(body: ReqRegister) {
        throw new Error("Method not implemented.");
    }

    @ApiProperty()
    public username: string

    @ApiProperty()
    public email: string

    @ApiProperty()
    public phone: string

    @ApiProperty()
    public company_name: string

    @ApiProperty()
    public password: string

    public runValidate(data: ReqRegister) {
        const messages = [];
        // valid fields 
        const validator = new Validator();
        // Điều kiện: Mật khẩu phải bao gồm chữ in hoa chữ in thường, số
        if (!validator.isAlphanumeric([(data.password, 'en-US')])) {
            messages.push({ field: "Password", message: Consts.MSG_FIELD_INVALID("Password") })
        }
        return messages;

    }
}