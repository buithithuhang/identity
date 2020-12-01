import { Mapper } from 'src/common';
import { ResSite } from 'src/site/models/res.site.model';
import { SiteRegister } from '../entities/site-register.entity';

export class ResSiteRegister {
    id: string;
    name: string;
    description: string;
    register_date: Date;
    expired: Date;
    register_plan: string;
    site: ResSite;

    constructor(json?: SiteRegister) {
        this.id = json?.Id;
        this.name = json?.Name;
        this.description = json?.Description;
        this.register_date = json?.RegisterDate;
        this.expired = json?.Expired;
        this.register_plan = json?.Description;
        this.site = json?.Site ? Mapper.map(ResSite, json.Site) : null;
    }
}
