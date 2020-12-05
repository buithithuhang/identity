import { ResUser } from 'src/user/models/res.user.model';
import { GroupUserTemplate } from '../entities/group-user-template.entity';

export class ResGroupUserTemplate {
    id: string;
    name: string;
    description: string;
   roles: string;

    constructor(json?: GroupUserTemplate) {
        this.id = json?.Id;
        this.name = json?.Name;
        this.description = json?.Description;
        this.roles = json?.Roles;
    }
}
