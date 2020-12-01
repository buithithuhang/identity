import { ResApplication } from 'src/application/models/res.application.model';
import { Mapper } from 'src/common';
import { ResCompany } from 'src/company/models/res.company.model';
import { ResSiteRegister } from 'src/site-register/models/res.site-register.model';
import { Site } from '../entities/site.entity';

export class ResSite {
    id: string;
    name: string;
    description: string;
    domain: string;
    application: ResApplication;
    site_registers: ResSiteRegister[];
    company: ResCompany;

    constructor(json?: Site) {
        this.id = json?.Id;
        this.name = json?.Name;
        this.description = json?.Description;
        this.domain = json?.Domain;
        this.application = json?.Application ? Mapper.map(ResApplication, json.Application) : null;
        this.site_registers = json?.SiteRegisters ? Mapper.map(ResSiteRegister, json.SiteRegisters) : null;
        this.company = json?.Company ? Mapper.map(ResCompany, json.Company) : null;
    }
}
