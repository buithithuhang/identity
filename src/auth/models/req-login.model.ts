import { ApiProperty } from "@nestjs/swagger";
import { Validator } from "class-validator";
import * as Consts from './../../common/consts';

export class ReqLogin {
    
    @ApiProperty()
    public username: string
    
    @ApiProperty()
    public password: string

    public domain: string;

    constructor(username: string, password: string){
        this.username = username;
        this.password = password;
    }

    public static runValidator(data: ReqLogin) {
        const messages = [];
        // valid fields 
        const validator = new Validator();
        // Điều kiện: Mật khẩu phải bao gồm chữ in hoa chữ in thường, số
        // if (!validator.isAlphanumeric([(data.password, 'en-US')])) {
        //     messages.push({ field: "Password", message: Consts.MSG_FIELD_INVALID("Password") })
        // }
        return messages;

    }
}