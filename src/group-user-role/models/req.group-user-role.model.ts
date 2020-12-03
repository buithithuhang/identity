import { ApiProperty } from '@nestjs/swagger';
import { GroupUserRole } from '../entities/group-user-role.entity';
import { Validator } from 'class-validator';
import { BaseFields } from 'src/entities/base-system-fields';
import * as Consts from '../../common/consts';

export class ReqGroupUserRole {

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    roles: string;

    @ApiProperty()
    group_user_id: string;

    constructor(json?: GroupUserRole) {
        this.name = json?.Name || '';
        this.description = json?.Description || '';
        this.roles = json?.Roles || '';
        this.group_user_id = json?.GroupUserId || '';
    }
    public static runValidator(groupUserRole: ReqGroupUserRole) {
        const messages = [];
        // Validation methods
        const validator = new Validator();
        // vailidate name
        if (validator.isEmpty(groupUserRole.name)) {
            messages.push({ field: BaseFields.Name, message: Consts.MSG_FIELD_REQUIRED(BaseFields.Name) });
        }

        if (!groupUserRole.group_user_id) {
            messages.push({ field: "group_user_id", message: Consts.MSG_FIELD_REQUIRED("group_user_id") });
        }
        return messages;
    }
}
