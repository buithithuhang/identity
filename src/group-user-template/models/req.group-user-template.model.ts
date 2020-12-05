import { ApiProperty } from '@nestjs/swagger';
import { GroupUserTemplate } from '../entities/group-user-template.entity';
import { Validator } from 'class-validator';
import { BaseFields } from 'src/entities/base-system-fields';
import * as Consts from '../../common/consts';

export class ReqGroupUserTemplate {

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ default: false })
    is_default: boolean;

    @ApiProperty()
    roles: string;

    constructor(json?: GroupUserTemplate) {
        this.name = json?.Name || '';
        this.description = json?.Description || '';
        this.is_default = json?.IsDefault || false;
        this.roles = json?.Roles || '';
    }
    public static runValidator(groupUserTemplate: ReqGroupUserTemplate) {
        const messages = [];
        // Validation methods
        const validator = new Validator();
        // vailidate name
        if (validator.isEmpty(groupUserTemplate.name)) {
            messages.push({ field: BaseFields.Name, message: Consts.MSG_FIELD_REQUIRED(BaseFields.Name) });
        }
        return messages;
    }
}
