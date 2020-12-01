import { Mapper } from 'src/common';
import { ResFunctions } from 'src/functions/models/res.functions.model';
import { ResSite } from 'src/site/models/res.site.model';
import { Application } from '../entities/application.entity';

export class ResApplication {
    id: string;
    name: string;
    description: string;
    functionses: ResFunctions[];
    sites: ResSite[];

    constructor(json?: Application) {
        this.id = json?.Id;
        this.name = json?.Name;
        this.description = json?.Description;
        this.functionses = json?.Functionses ? Mapper.map(ResFunctions, json.Functionses) : null;
        this.sites = json?.Sites ? Mapper.map(ResSite, json.Sites) : null;
    }
}
