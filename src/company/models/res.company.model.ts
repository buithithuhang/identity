import { ResSite } from 'src/site/models/res.site.model';
import { ResUser } from 'src/user/models/res.user.model';
import { Company } from '../entities/company.entity';

export class ResCompany {
    id: string;
    name: string;
    description: string;
    phone: string;
    adress: string;
    email: string;
    owner: string;
    sites: ResSite[];
    users: ResUser[];

    constructor(json?: Company) {
        this.id = json?.Id;
        this.name = json?.Name;
        this.description = json?.Description;
        this.phone = json?.Phone;
        this.adress = json?.Adress;
        this.email = json?.Email;
        this.owner = json?.Owner;
    }
}
