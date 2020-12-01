import { ApiProperty } from '@nestjs/swagger';
import { SiteRegister } from '../entities/site-register.entity';
import { Validator } from 'class-validator';
import { BaseFields } from 'src/entities/base-system-fields';
import * as Consts from '../../common/consts';

export class ReqSiteRegister {

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;
    
    @ApiProperty()
    register_date: Date;

    @ApiProperty()
    expired: Date;

    @ApiProperty()
    register_plan: string;

    @ApiProperty()
    site_id: string;

    constructor(json?: SiteRegister) {
        this.name = json?.Name || '';
        this.description = json?.Description || '';
        this.register_date = json?.RegisterDate || undefined;
        this.expired = json?.Expired || undefined;
        this.register_plan = json?.RegisterPlan || '';
        this.site_id = json?.SiteId || '';
    }
    public static runValidator(siteRegister: ReqSiteRegister) {
        const messages = [];
        // Validation methods
        const validator = new Validator();
        // vailidate name
        if (validator.isEmpty(siteRegister.name)) {
            messages.push({ field: BaseFields.Name, message: Consts.MSG_FIELD_REQUIRED(BaseFields.Name) });
        }

        if (!siteRegister.site_id) {
            messages.push({ field: "site_id", message: Consts.MSG_FIELD_REQUIRED("site_id") });
        }
        return messages;
    }
}
