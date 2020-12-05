import { ApiProperty } from '@nestjs/swagger';
import { GroupUser } from '../entities/group-user.entity';
import { Validator } from 'class-validator';
import { BaseFields } from 'src/entities/base-system-fields';
import * as Consts from '../../common/consts';

export class ReqGroupUser {

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;
 
    @ApiProperty()
    roles: string;

    constructor(json?: GroupUser) {
        this.name = json?.Name || '';
        this.description = json?.Description || '';
        this.roles = json?.Roles || '';
    }
    public static runValidator(groupUser: ReqGroupUser) {
        const messages = [];
        // Validation methods
        const validator = new Validator();
        // vailidate name
        if (validator.isEmpty(groupUser.name)) {
            messages.push({ field: BaseFields.Name, message: Consts.MSG_FIELD_REQUIRED(BaseFields.Name) });
        }
        return messages;
    }
}
