import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Functions } from './entities/functions.entity';
import { Repository, Like } from 'typeorm';
import { DeleteFlag } from 'src/common/enums';
import { Pagination } from 'src/base-model/paging.model';
import { ResFunctions } from './../functions/models/res.functions.model';
import { IPagination } from 'src/base-model/pagination-result';
import { Mapper } from 'src/common/mapper';
import { GetAllAction, Problem, GetAction, UpdateAction, CreateAction, DeleteAction } from 'src/common';
import { ReqFunctions } from './models/req.functions.model';
import { isNullOrUndefined } from 'util';
import * as Consts from './../common/consts';
import { BaseFields } from 'src/entities/base-system-fields';
import { Request } from 'express';
import { Application } from 'src/application/entities/application.entity';
@Injectable()
export class FunctionsService {
    constructor(
        @InjectRepository(Functions)
        private functionsRepository: Repository<Functions>,

        @InjectRepository(Application)
        private applicationRepository: Repository<Application>,
    ) {

    }

    // Get all data
    async findAll(req: Request, paging?: Pagination) {
        try {
            // app_id <= req.body.app+id
            // group_user_id 
            const rows = await this.functionsRepository.findAndCount({
                where: {
                    DeleteFlag: DeleteFlag.None,
                     ApplicationId: req.body.application_id,
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
                data: Mapper.map(ResFunctions, rows[0]),
                paging: { page: paging.page, pageSize: paging.pageSize, count: rows[1] },
            } as IPagination;
        } catch (error) {
            Logger.error(GetAllAction.GetFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async get(req: Request, id: string) {
        try {
            const functions = await this.functionsRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!functions) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Functions.name));
            }
            return Mapper.map(ResFunctions, functions);
        } catch (error) {
            Logger.error(GetAction.GetFromDB, error);
            return Problem.InternalServerError();
        }

    }

    async getByApplicationId(req: Request, application_id: string) {
        try {
            const functions = await this.functionsRepository.find(
                {relations: ['Children'],
                where: { ParentId: null, ApplicationId: application_id, DeleteFlag: DeleteFlag.None }
            });
            if (!functions) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Functions.name));
            }
            return Mapper.map(ResFunctions, functions);
        } catch (error) {
            Logger.error(GetAction.GetFromDB, error);
            return Problem.InternalServerError();
        }
    }
    async create(req: Request, body: ReqFunctions): Promise<Functions | Problem> {
        // [1] validate data
        const validMessages = ReqFunctions.runValidator(body);
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


        try {
            const functions = new Functions();
            functions.Name = body.name;
            functions.Description = body.description;
            functions.ApiUrl = body.api_url;
            functions.Application = application;
            //TODO: check parnt is exist////
            functions.ParentId = body.parent_id;
            functions.setBaseDataInfo(req);

            await this.functionsRepository.save(functions);
            return Mapper.map(ResFunctions, functions);
        } catch (error) {
            Logger.error(CreateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async update(req: Request, id: string, body: ReqFunctions): Promise<Functions | Problem> {
        // [1] validate data
        const validMessages = ReqFunctions.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(UpdateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }
        // [2] Check exist on DB
        // tslint:disable-next-line:prefer-const
        let functions;
        try {
            functions = await this.functionsRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!functions) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Functions.name));
            }
        } catch (error) {
            Logger.error(UpdateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }

        // check application id
        let application: Application;
        if (body.application_id && functions.ApplicationId !== body.application_id) {
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

        // Update value
        try {
            functions.Name = body.name || functions.Name;
            functions.Description = body.description || functions.Description;
            functions.ApiUrl = body.api_url || functions.ApiUrl;
            functions.application_id = application?.Id || functions.application_id;
            functions.setBaseDataInfo(req);

            await this.functionsRepository.save(functions);
            return Mapper.map(ResFunctions, functions);
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
        // Get functions by id from db
        let functions;
        try {
            functions = await this.functionsRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!functions) {
                return Problem.NotFound(functions.MSG_OBJ_NOT_FOUND(Functions.name));
            }
        } catch (error) {
            Logger.log(DeleteAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }

        // change flag save to db
        try {
            functions.DeleteFlag = DeleteFlag.Yes;
            await this.functionsRepository.save(functions);
            return Problem.Ok(Consts.MSG_DELETE_SUCCESSFULLY(Functions.name, functions.Id));
        } catch (error) {
            return error;
        }
    }
}
