import { Mapper } from 'src/common';
import { ResGroupUser } from 'src/group-user/models/res.group-user.model';
import { GroupUserRole } from '../entities/group-user-role.entity';

export class ResGroupUserRole {
    id: string;
    name: string;
    description: string;
    roles: string;
    group_user: ResGroupUser;

    constructor(json?: GroupUserRole) {
        this.id = json?.Id;
        this.name = json?.Name;
        this.description = json?.Description;
        this.roles = json?.Roles;
        this.group_user = json?.GroupUser ? Mapper.map(ResGroupUser, json.GroupUser) : null;
    }
}
