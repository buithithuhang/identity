import { Mapper } from 'src/common';
import { ResGroupUserRole } from 'src/group-user-role/models/res.group-user-role.model';
import { ResUser } from 'src/user/models/res.user.model';
import { GroupUser } from '../entities/group-user.entity';

export class ResGroupUser {
    id: string;
    name: string;
    description: string;
    users: ResUser[];
    group_user_roles: ResGroupUserRole[];

    constructor(json?: GroupUser) {
        this.id = json?.Id;
        this.name = json?.Name;
        this.description = json?.Description;
        this.users = json?.Users ? Mapper.map(ResUser, json.Users) : null;
        this.group_user_roles = json?.GroupUserRoles ? Mapper.map(ResGroupUserRole, json.GroupUserRoles) : null;
    }
}
