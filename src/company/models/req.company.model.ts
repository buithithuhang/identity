import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';
import { Validator } from 'class-validator';
import { BaseFields } from 'src/entities/base-system-fields';
import * as Consts from './../../common/consts';

export class ReqCompany {

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    adress: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    owner: string;

    constructor(json?: Company) {
        this.name = json?.Name || '';
        this.description = json?.Description || '';
        this.phone = json?.Phone || '';
        this.adress = json?.Adress || '';
        this.email = json?.Email || '';
        this.owner = json?.Owner || '';
    }
    public static runValidator(company: ReqCompany) {
        const messages = [];
        // Validation methods
        const validator = new Validator();
        // vailidate name
        if (validator.isEmpty(company.name)) {
            messages.push({ field: BaseFields.Name, message: Consts.MSG_FIELD_REQUIRED(BaseFields.Name) });
        }
        return messages;
    }
}
