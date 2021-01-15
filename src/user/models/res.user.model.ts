import { Mapper } from 'src/common';
import { ResCompany } from 'src/company/models/res.company.model';
import { ResGroupUser } from 'src/group-user/models/res.group-user.model';
import { User } from '../entities/user.entity';

export class ResUser {
    id: string;
    name: string;
    description: string;
    birthday: Date;
    gender: string;
    phone: string;
    email: string;
    adress: string;
    avatar: string;
    position: string;
    user_name: string;
    company: ResCompany;
    group_user: ResGroupUser;

    constructor(json?: User) {
        this.id = json?.Id;
        this.name = json?.Name;
        this.description = json?.Description;
        this.birthday = json?.Birthday;
        this.gender = json?.Gender;
        this.phone = json?.Phone;
        this.email = json?.Email;
       
        this.adress = json?.Adress;
        this.avatar = json?.Avatar;
        this.position = json?.Position;
        this.user_name = json?.Username;
        this.company = json?.CompanyId? Mapper.map(ResCompany, json?.Company) : null;      
        this.group_user = json?.GroupUserID? Mapper.map(ResGroupUser, json?.GroupUser) : null;


    }
}
