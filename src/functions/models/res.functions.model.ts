import { ResApplication } from 'src/application/models/res.application.model';
import { Mapper } from 'src/common';
import { Functions } from '../entities/functions.entity';

export class ResFunctions {
    id: string;
    name: string;
    description: string;
    api_url: string;
    application_id: ResApplication;

    constructor(json?: Functions) {
        this.id = json?.Id;
        this.name = json?.Name;
        this.description = json?.Description;
        this.api_url = json?.ApiUrl;
        this.application_id = json?.ApplicationId ? Mapper.map(ResApplication, json.ApplicationId) : null;

    }
}
