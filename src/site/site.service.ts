import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';
import { Repository, Like } from 'typeorm';
import { DeleteFlag } from 'src/common/enums';
import { Pagination } from 'src/base-model/paging.model';
import { ResSite } from './../site/models/res.site.model';
import { IPagination } from 'src/base-model/pagination-result';
import { Mapper } from 'src/common/mapper';
import { GetAllAction, Problem, GetAction, UpdateAction, CreateAction, DeleteAction } from 'src/common';
import { ReqSite } from './models/req.site.model';
import { isNullOrUndefined } from 'util';
import * as Consts from './../common/consts';
import { BaseFields } from 'src/entities/base-system-fields';
import { Request } from 'express';
import { Application } from 'src/application/entities/application.entity';
import { Company } from 'src/company/entities/company.entity';
@Injectable()
export class SiteService {
    constructor(
        @InjectRepository(Site)
        private siteRepository: Repository<Site>,

        @InjectRepository(Application)
        private applicationRepository: Repository<Application>,

        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
    ) {

    }

    // Get all data
    async findAll(req: Request, paging?: Pagination) {
        try {

            const rows = await this.siteRepository.findAndCount({
                where: {
                    DeleteFlag: DeleteFlag.None,
                    andWhere: [{
                        Name: Like(`%${paging.filter || ''}%`),
                    }, {
                        Description: Like(`%${paging.filter || ''}%`),
                    }],
                },
                order: {
                    Name: 'ASC',
                },
                skip: paging.page * paging.pageSize,
                take: paging.pageSize,
            });

            return {
                data: Mapper.map(ResSite, rows[0]),
                paging: { page: paging.page, pageSize: paging.pageSize, count: rows[1] },
            } as IPagination;
        } catch (error) {
            Logger.error(GetAllAction.GetFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async get(req: Request, id: string) {
        try {
            const site = await this.siteRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!site) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Site.name));
            }
            return Mapper.map(ResSite, site);
        } catch (error) {
            Logger.error(GetAction.GetFromDB, error);
            return Problem.InternalServerError();
        }

    }

    async create(req: Request, body: ReqSite): Promise<Site | Problem> {
        // [1] validate data
        const validMessages = ReqSite.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(CreateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }

        // check application_id
        let application: Application;
        try {
            application = await this.applicationRepository.findOne({ Id: body.application_id, DeleteFlag: DeleteFlag.None });
            if (!application) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Application.name));
            }
        } catch (ex) {
            Logger.log(CreateAction.ValidateRequest);
            return Problem.InternalServerError();
        }

        // check company_id
        let company: Company;
        try {
            company = await this.companyRepository.findOne({ Id: body.company_id, DeleteFlag: DeleteFlag.None });
            if (!company) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Company.name));
            }
        } catch (ex) {
            Logger.log(CreateAction.ValidateRequest);
            return Problem.InternalServerError();
        }

        try {
            const site = new Site();
            site.Name = body.name;
            site.Description = body.description;
            site.Domain = body.domain;
            site.Application = application;
            site.Company = company;
            site.setBaseDataInfo(req);

            await this.siteRepository.save(site);
            return Mapper.map(ResSite, site);
        } catch (error) {
            Logger.error(CreateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async update(req: Request, id: string, body: ReqSite): Promise<Site | Problem> {
        // [1] validate data
        const validMessages = ReqSite.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(UpdateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }
        // [2] Check exist on DB
        // tslint:disable-next-line:prefer-const
        let site;
        try {
            site = await this.siteRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!site) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Site.name));
            }
        } catch (error) {
            Logger.error(UpdateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }

        // check application id
        let application: Application;
        if (body.application_id && site.application_id !== body.application_id) {
            let application: Application;
            try {
                application = await this.applicationRepository.findOne({ Id: body.application_id, DeleteFlag: DeleteFlag.None });
                if (!application) {
                    return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Application.name));
                }
            } catch (ex) {
                Logger.log(CreateAction.ValidateRequest);
                return Problem.InternalServerError();
            }
        }

        // check company id
        let company: Company;
        if (body.company_id && site.company_id !== body.company_id) {
            let company: Company;
            try {
                company = await this.companyRepository.findOne({ Id: body.company_id, DeleteFlag: DeleteFlag.None });
                if (!company) {
                    return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Company.name));
                }
            } catch (ex) {
                Logger.log(CreateAction.ValidateRequest);
                return Problem.InternalServerError();
            }
        }


        // Update value
        try {
            site.Name = body.name || site.Name;
            site.Description = body.description || site.Description;
            site.Domain = body.domain || site.Domain;
            site.application_id = application?.Id || site.application_id;
            site.company_id = company?.Id || site.company_id;
            site.setBaseDataInfo(req);

            await this.siteRepository.save(site);
            return Mapper.map(ResSite, site);
        } catch (error) {
            Logger.log(UpdateAction.UpdateValue, error);
            return Problem.InternalServerError();
        }
    }

    async delete(req: Request, id: string): Promise<Problem> {
        // Check id
        if (!(id)) {
            return new Problem({ status: HttpStatus.BAD_REQUEST, message: Consts.MSG_FIELD_REQUIRED(BaseFields.Id) });
        }
        // Get site by id from db
        let site;
        try {
            site = await this.siteRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!site) {
                return Problem.NotFound(site.MSG_OBJ_NOT_FOUND(Site.name));
            }
        } catch (error) {
            Logger.log(DeleteAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }

        // change flag save to db
        try {
            site.DeleteFlag = DeleteFlag.Yes;
            await this.siteRepository.save(site);
            return Problem.Ok(Consts.MSG_DELETE_SUCCESSFULLY(Site.name, site.Id));
        } catch (error) {
            return error;
        }
    }
}
