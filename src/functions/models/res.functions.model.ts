import { ResApplication } from 'src/application/models/res.application.model';
import { Mapper } from 'src/common';
import { Functions } from '../entities/functions.entity';
import { ReqFunctions } from './req.functions.model';

export class ResFunctions {
    id: string;
    name: string;
    description: string;
    api_url: string;
    application: ResApplication;
    children: ReqFunctions[];

    constructor(json?: Functions) {
        this.id = json?.Id;
        this.name = json?.Name;
        this.description = json?.Description;
        this.api_url = json?.ApiUrl;
        this.application = json?.Application ? Mapper.map(ResApplication, json.Application) : null;
        this.children = json?.Children ? Mapper.map(ReqFunctions, json.Children) : null;
    }
}
