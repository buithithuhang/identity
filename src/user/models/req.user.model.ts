import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Validator } from 'class-validator';
import { BaseFields } from 'src/entities/base-system-fields';
import * as Consts from './../../common/consts';

export class ReqUser {

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    birthday: Date;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    adress: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    avatar: string;

    @ApiProperty()
    position: string;

    @ApiProperty()
    user_name: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    company_id: string;

    @ApiProperty()
    group_user_id: string;

    constructor(json?: User) {
        this.name = json?.Name || '';
        this.description = json?.Description || '';
        this.birthday = json?.Birthday || undefined;
        this.phone = json?.Phone || '';
        this.adress = json?.Adress || '';
        this.email = json?.Email || '';
        this.gender = json?.Gender || '';
        this.avatar = json?.Avatar || '';
        this.position = json?.Position || '';
        this.user_name = json?.Username || '';
        this.password = json?.Password || '';

        this.company_id = json?.CompanyId || '';
        this.group_user_id = json?.GroupUserID || '';
    }
    public static runValidator(user: ReqUser) {
        const messages = [];
        // Validation methods
        const validator = new Validator();
        // vailidate name
        if (validator.isEmpty(user.name)) {
            messages.push({ field: BaseFields.Name, message: Consts.MSG_FIELD_REQUIRED(BaseFields.Name) });
        }

        if (!user.company_id && !user.group_user_id) {
            messages.push({ field: "company_id", message: Consts.MSG_FIELD_REQUIRED("company_id") });
            messages.push({ field: "group_user_id", message: Consts.MSG_FIELD_REQUIRED("group_user_id") });
        }
        return messages;
    }
}
