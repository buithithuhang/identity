import { ApiProperty } from '@nestjs/swagger';
import { Application } from '../entities/application.entity';
import { Validator } from 'class-validator';
import { BaseFields } from 'src/entities/base-system-fields';
import * as Consts from './../../common/consts';

export class ReqApplication {

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    constructor(json?: Application) {
        this.name = json?.Name || '';
        this.description = json?.Description || '';
    }
    public static runValidator(application: ReqApplication) {
        const messages = [];
        // Validation methods
        const validator = new Validator();
        // vailidate name
        if (validator.isEmpty(application.name)) {
            messages.push({ field: BaseFields.Name, message: Consts.MSG_FIELD_REQUIRED(BaseFields.Name) });
        }
        return messages;
    }
}
