import { ApiProperty } from '@nestjs/swagger';
import { Functions } from '../entities/functions.entity';
import { Validator } from 'class-validator';
import { BaseFields } from 'src/entities/base-system-fields';
import * as Consts from './../../common/consts';

export class ReqFunctions {

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    api_url: string;

    @ApiProperty()
    application_id: string;

    constructor(json?: Functions) {
        this.name = json?.Name || '';
        this.description = json?.Description || '';
        this.api_url = json?.ApiUrl || '';
        this.application_id = json?.ApplicationId || '';
    }
    public static runValidator(functions: ReqFunctions) {
        const messages = [];
        // Validation methods
        const validator = new Validator();
        // vailidate name
        if (validator.isEmpty(functions.name)) {
            messages.push({ field: BaseFields.Name, message: Consts.MSG_FIELD_REQUIRED(BaseFields.Name) });
        }

        if (!functions.application_id) {
            messages.push({ field: "application_id", message: Consts.MSG_FIELD_REQUIRED("application_id") });
        }
        return messages;
    }
}
