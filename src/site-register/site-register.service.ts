import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteRegister } from './entities/site-register.entity';
import { Repository, Like } from 'typeorm';
import { DeleteFlag } from 'src/common/enums';
import { Pagination } from 'src/base-model/paging.model';
import { ResSiteRegister } from './models/res.site-register.model';
import { IPagination } from 'src/base-model/pagination-result';
import { Mapper } from 'src/common/mapper';
import { GetAllAction, Problem, GetAction, UpdateAction, CreateAction, DeleteAction } from 'src/common';
import { ReqSiteRegister } from './models/req.site-register.model';
import { isNullOrUndefined } from 'util';
import * as Consts from '../common/consts';
import { BaseFields } from 'src/entities/base-system-fields';
import { Request } from 'express';
import { Site } from 'src/site/entities/site.entity';
@Injectable()
export class SiteRegisterService {
    constructor(
        @InjectRepository(SiteRegister)
        private siteRegisterRepository: Repository<SiteRegister>,

        @InjectRepository(Site)
        private siteRepository: Repository<Site>,
    ) {

    }

    // Get all data
    async findAll(req: Request, paging?: Pagination) {
        try {

            const rows = await this.siteRegisterRepository.findAndCount({
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
                //skip: paging.page * paging.pageSize,
                //take: paging.pageSize,
            });

            return {
                data: Mapper.map(ResSiteRegister, rows[0]),
                paging: { page: paging.page, pageSize: paging.pageSize, count: rows[1] },
            } as IPagination;
        } catch (error) {
            Logger.error(GetAllAction.GetFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async get(req: Request, id: string) {
        try {
            const siteRegister = await this.siteRegisterRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!siteRegister) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(SiteRegister.name));
            }
            return Mapper.map(ResSiteRegister, siteRegister);
        } catch (error) {
            Logger.error(GetAction.GetFromDB, error);
            return Problem.InternalServerError();
        }

    }

    async create(req: Request, body: ReqSiteRegister): Promise<SiteRegister | Problem> {
        // [1] validate data
        const validMessages = ReqSiteRegister.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(CreateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }

        // check site id
        let site: Site;
        try {
            site = await this.siteRepository.findOne({ Id: body.site_id, DeleteFlag: DeleteFlag.None });
            if (!site) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Site.name));
            }
        } catch (ex) {
            Logger.log(CreateAction.ValidateRequest);
            return Problem.InternalServerError();
        }

        try {
            const siteRegister = new SiteRegister();
            siteRegister.Name = body.name;
            siteRegister.Description = body.description;
            siteRegister.RegisterDate = body.register_date;
            siteRegister.RegisterPlan = body.register_plan;
            siteRegister.Site = site;
            siteRegister.Expired = body.expired;
            siteRegister.setBaseDataInfo(req);

            await this.siteRegisterRepository.save(siteRegister);
            return Mapper.map(ResSiteRegister, siteRegister);
        } catch (error) {
            Logger.error(CreateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async update(req: Request, id: string, body: ReqSiteRegister): Promise<SiteRegister | Problem> {
        // [1] validate data
        const validMessages = ReqSiteRegister.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(UpdateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }
        // [2] Check exist on DB
        // tslint:disable-next-line:prefer-const
        let siteRegister;
        try {
            siteRegister = await this.siteRegisterRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!siteRegister) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(SiteRegister.name));
            }
        } catch (error) {
            Logger.error(UpdateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }

        let site: Site;
        if (body.site_id && siteRegister.SiteId !== body.site_id) {
            // check site id
            let site: Site;
            try {
                site = await this.siteRepository.findOne({ Id: body.site_id, DeleteFlag: DeleteFlag.None });
                if (!site) {
                    return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Site.name));
                }
            } catch (ex) {
                Logger.log(CreateAction.ValidateRequest);
                return Problem.InternalServerError();
            }
        }
        // Update value
        try {
            siteRegister.Name = body.name || siteRegister.Name;
            siteRegister.Description = body.description || siteRegister.Description;
            siteRegister.RegisterDate = body.register_date || siteRegister.RegisterDate;
            siteRegister.RegisterPlan = body.register_plan || siteRegister.RegisterPlan;
            siteRegister.Expired = body.expired || siteRegister.Expired;
            siteRegister.SiteId = site?.Id || siteRegister.SiteId;
            siteRegister.setBaseDataInfo(req);

            await this.siteRegisterRepository.save(siteRegister);
            return Mapper.map(ResSiteRegister, siteRegister);
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
        // Get siteRegister by id from db
        let siteRegister;
        try {
            siteRegister = await this.siteRegisterRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!siteRegister) {
                return Problem.NotFound(siteRegister.MSG_OBJ_NOT_FOUND(SiteRegister.name));
            }
        } catch (error) {
            Logger.log(DeleteAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }

        // change flag save to db
        try {
            siteRegister.DeleteFlag = DeleteFlag.Yes;
            await this.siteRegisterRepository.save(siteRegister);
            return Problem.Ok(Consts.MSG_DELETE_SUCCESSFULLY(SiteRegister.name, siteRegister.Id));
        } catch (error) {
            return error;
        }
    }
}
