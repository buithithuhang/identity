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
    password: string;
    user_name: string;
    company_id: string;
    group_user_id: string;

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
        this.password = json?.PassWord;
        this.user_name = json?.UserName;
        this.company_id = json?.CompanyId;       
        this.group_user_id = json?.GroupUserID;


    }
}
