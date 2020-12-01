import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository, Like } from 'typeorm';
import { DeleteFlag } from 'src/common/enums';
import { Pagination } from 'src/base-model/paging.model';
import { ResApplication } from './../application/models/res.application.model';
import { IPagination } from 'src/base-model/pagination-result';
import { Mapper } from 'src/common/mapper';
import { GetAllAction, Problem, GetAction, UpdateAction, CreateAction, DeleteAction } from 'src/common';
import { ReqApplication } from './models/req.application.model';
import { isNullOrUndefined } from 'util';
import * as Consts from './../common/consts';
import { BaseFields } from 'src/entities/base-system-fields';
import { Request } from 'express';
@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private applicationRepository: Repository<Application>,
    ) {

    }

    // Get all data
    async findAll(req: Request, paging?: Pagination) {
        try {

            const rows = await this.applicationRepository.findAndCount({
                where: {
                    DeleteFlag: DeleteFlag.None,
                    SiteId: req.body.site_id,
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
                data: Mapper.map(ResApplication, rows[0]),
                paging: { page: paging.page, pageSize: paging.pageSize, count: rows[1] },
            } as IPagination;
        } catch (error) {
            Logger.error(GetAllAction.GetFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async get(req: Request, id: string) {
        try {
            const application = await this.applicationRepository.findOne({ Id: id, SiteId: req.body.site_id, DeleteFlag: DeleteFlag.None });
            if (!application) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Application.name));
            }
            return Mapper.map(ResApplication, application);
        } catch (error) {
            Logger.error(GetAction.GetFromDB, error);
            return Problem.InternalServerError();
        }

    }

    async create(req: Request, body: ReqApplication): Promise<Application | Problem> {
        // [1] validate data
        const validMessages = ReqApplication.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(CreateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }

        try {
            const application = new Application();
            application.Name = body.name;
            application.Description = body.description;
            application.setBaseDataInfo(req);

            await this.applicationRepository.save(application);
            return Mapper.map(ResApplication, application);
        } catch (error) {
            Logger.error(CreateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async update(req: Request, id: string, body: ReqApplication): Promise<Application | Problem> {
        // [1] validate data
        const validMessages = ReqApplication.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(UpdateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }
        // [2] Check exist on DB
        // tslint:disable-next-line:prefer-const
        let application;
        try {
            application = await this.applicationRepository.findOne({ Id: id, SiteId: req.body.site_id, DeleteFlag: DeleteFlag.None });
            if (!application) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Application.name));
            }
        } catch (error) {
            Logger.error(UpdateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
        // Update value
        try {
            application.Name = body.name || application.Name;
            application.Description = body.description || application.Description;
            application.setBaseDataInfo(req);

            await this.applicationRepository.save(application);
            return Mapper.map(ResApplication, application);
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
        // Get application by id from db
        let application;
        try {
            application = await this.applicationRepository.findOne({ Id: id, SiteId: req.body.site_id, DeleteFlag: DeleteFlag.None });
            if (!application) {
                return Problem.NotFound(application.MSG_OBJ_NOT_FOUND(Application.name));
            }
        } catch (error) {
            Logger.log(DeleteAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }

        // change flag save to db
        try {
            application.DeleteFlag = DeleteFlag.Yes;
            await this.applicationRepository.save(application);
            return Problem.Ok(Consts.MSG_DELETE_SUCCESSFULLY(Application.name, application.Id));
        } catch (error) {
            return error;
        }
    }
}
