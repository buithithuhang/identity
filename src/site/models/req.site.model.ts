import { ApiProperty } from '@nestjs/swagger';
import { Site } from '../entities/site.entity';
import { Validator } from 'class-validator';
import { BaseFields } from 'src/entities/base-system-fields';
import * as Consts from './../../common/consts';

export class ReqSite {

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string; 

    @ApiProperty()
    domain: string;

    @ApiProperty()
    application_id: string;
    
    @ApiProperty()
    company_id: string;

    constructor(json?: Site) {
        this.name = json?.Name || '';
        this.description = json?.Description || '';
        this.domain = json?.Domain || '';
        this.application_id = json?.ApplicationId || '';
        this.company_id = json?.CompanyId || '';
    }
    public static runValidator(site: ReqSite) {
        const messages = [];
        // Validation methods
        const validator = new Validator();
        // vailidate name
        if (validator.isEmpty(site.name)) {
            messages.push({ field: BaseFields.Name, message: Consts.MSG_FIELD_REQUIRED(BaseFields.Name) });
        }

        if (!site.company_id) {
            messages.push({ field: "company_id", message: Consts.MSG_FIELD_REQUIRED("company_id") });
        }

        if (!site.application_id) {
            messages.push({ field: "application_id", message: Consts.MSG_FIELD_REQUIRED("application_id") });
        }
        return messages;
    }
}
