import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupUserTemplate } from './entities/group-user-template.entity';
import { Repository, Like } from 'typeorm';
import { DeleteFlag } from 'src/common/enums';
import { Pagination } from 'src/base-model/paging.model';
import { ResGroupUserTemplate } from './models/res.group-user-template.model';
import { IPagination } from 'src/base-model/pagination-result';
import { Mapper } from 'src/common/mapper';
import { GetAllAction, Problem, GetAction, UpdateAction, CreateAction, DeleteAction } from 'src/common';
import { ReqGroupUserTemplate } from './models/req.group-user-template.model';
import * as Consts from '../common/consts';
import { BaseFields } from 'src/entities/base-system-fields';
import { Request } from 'express';
@Injectable()
export class GroupUserTemplateService {
    constructor(
        @InjectRepository(GroupUserTemplate)
        private groupUserTemplateRepository: Repository<GroupUserTemplate>,
    ) {

    }

    // Get all data
    async findAll(req: Request, paging?: Pagination) {
        try {
            // if supperadmin get => get groupuer template
            var isTemplate = req.body.user?.role === 'superadmin';
            console.log("isstemplate", isTemplate);
            const rows = await this.groupUserTemplateRepository.findAndCount({
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
                data: Mapper.map(ResGroupUserTemplate, rows[0]),
                paging: { page: paging.page, pageSize: paging.pageSize, count: rows[1] },
            } as IPagination;
        } catch (error) {
            Logger.error(GetAllAction.GetFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async get(req: Request, id: string) {
        try {
            const groupUserTemplate = await this.groupUserTemplateRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!groupUserTemplate) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(GroupUserTemplate.name));
            }
            return Mapper.map(ResGroupUserTemplate, groupUserTemplate);
        } catch (error) {
            Logger.error(GetAction.GetFromDB, error);
            return Problem.InternalServerError();
        }

    }

    async create(req: Request, body: ReqGroupUserTemplate): Promise<GroupUserTemplate | Problem> {
        // [1] validate data
        const validMessages = ReqGroupUserTemplate.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(CreateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }

        try {
            const groupUserTemplate = new GroupUserTemplate();
            groupUserTemplate.Name = body.name;
            groupUserTemplate.Description = body.description;
            groupUserTemplate.Roles = body.roles;
            groupUserTemplate.IsDefault = body.is_default || false;

            groupUserTemplate.setBaseDataInfo(req);

            await this.groupUserTemplateRepository.save(groupUserTemplate);
            return Mapper.map(ResGroupUserTemplate, groupUserTemplate);
        } catch (error) {
            Logger.error(CreateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async update(req: Request, id: string, body: ReqGroupUserTemplate): Promise<GroupUserTemplate | Problem> {
        // [1] validate data
        const validMessages = ReqGroupUserTemplate.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(UpdateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }
        // [2] Check exist on DB
        // tslint:disable-next-line:prefer-const
        let groupUserTemplate;
        try {
            groupUserTemplate = await this.groupUserTemplateRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!groupUserTemplate) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(GroupUserTemplate.name));
            }
        } catch (error) {
            Logger.error(UpdateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
        // Update value
        try {
            groupUserTemplate.Name = body.name || groupUserTemplate.Name;
            groupUserTemplate.Description = body.description || groupUserTemplate.Description;
            groupUserTemplate.Roles = body.roles || groupUserTemplate.Roles;
            groupUserTemplate.setBaseDataInfo(req);

            await this.groupUserTemplateRepository.save(groupUserTemplate);
            return Mapper.map(ResGroupUserTemplate, groupUserTemplate);
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
        // Get groupUserTemplate by id from db
        let groupUserTemplate;
        try {
            groupUserTemplate = await this.groupUserTemplateRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!groupUserTemplate) {
                return Problem.NotFound(groupUserTemplate.MSG_OBJ_NOT_FOUND(GroupUserTemplate.name));
            }
        } catch (error) {
            Logger.log(DeleteAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }

        // change flag save to db
        try {
            groupUserTemplate.DeleteFlag = DeleteFlag.Yes;
            await this.groupUserTemplateRepository.save(groupUserTemplate);
            return Problem.Ok(Consts.MSG_DELETE_SUCCESSFULLY(GroupUserTemplate.name, groupUserTemplate.Id));
        } catch (error) {
            return error;
        }
    }
}
