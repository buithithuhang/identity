import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupUser } from './entities/group-user.entity';
import { Repository, Like } from 'typeorm';
import { DeleteFlag } from 'src/common/enums';
import { Pagination } from 'src/base-model/paging.model';
import { ResGroupUser } from './models/res.group-user.model';
import { IPagination } from 'src/base-model/pagination-result';
import { Mapper } from 'src/common/mapper';
import { GetAllAction, Problem, GetAction, UpdateAction, CreateAction, DeleteAction } from 'src/common';
import { ReqGroupUser } from './models/req.group-user.model';
import { isNullOrUndefined } from 'util';
import * as Consts from '../common/consts';
import { BaseFields } from 'src/entities/base-system-fields';
import { Request } from 'express';
@Injectable()
export class GroupUserService {
    constructor(
        @InjectRepository(GroupUser)
        private groupUserRepository: Repository<GroupUser>,
    ) {

    }

    // Get all data
    async findAll(req: Request, paging?: Pagination) {
        try {

            const rows = await this.groupUserRepository.findAndCount({
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
                data: Mapper.map(ResGroupUser, rows[0]),
                paging: { page: paging.page, pageSize: paging.pageSize, count: rows[1] },
            } as IPagination;
        } catch (error) {
            Logger.error(GetAllAction.GetFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async get(req: Request, id: string) {
        try {
            const groupUser = await this.groupUserRepository.findOne({ Id: id, SiteId: req.body.site_id, DeleteFlag: DeleteFlag.None });
            if (!groupUser) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(GroupUser.name));
            }
            return Mapper.map(ResGroupUser, groupUser);
        } catch (error) {
            Logger.error(GetAction.GetFromDB, error);
            return Problem.InternalServerError();
        }

    }

    async create(req: Request, body: ReqGroupUser): Promise<GroupUser | Problem> {
        // [1] validate data
        const validMessages = ReqGroupUser.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(CreateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }

        try {
            const groupUser = new GroupUser();
            groupUser.Name = body.name;
            groupUser.Description = body.description;
            groupUser.setBaseDataInfo(req);

            await this.groupUserRepository.save(groupUser);
            return Mapper.map(ResGroupUser, groupUser);
        } catch (error) {
            Logger.error(CreateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async update(req: Request, id: string, body: ReqGroupUser): Promise<GroupUser | Problem> {
        // [1] validate data
        const validMessages = ReqGroupUser.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(UpdateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }
        // [2] Check exist on DB
        // tslint:disable-next-line:prefer-const
        let groupUser;
        try {
            groupUser = await this.groupUserRepository.findOne({ Id: id, SiteId: req.body.site_id, DeleteFlag: DeleteFlag.None });
            if (!groupUser) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(GroupUser.name));
            }
        } catch (error) {
            Logger.error(UpdateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
        // Update value
        try {
            groupUser.Name = body.name || groupUser.Name;
            groupUser.Description = body.description || groupUser.Description;
            groupUser.setBaseDataInfo(req);

            await this.groupUserRepository.save(groupUser);
            return Mapper.map(ResGroupUser, groupUser);
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
        // Get groupUser by id from db
        let groupUser;
        try {
            groupUser = await this.groupUserRepository.findOne({ Id: id, SiteId: req.body.site_id, DeleteFlag: DeleteFlag.None });
            if (!groupUser) {
                return Problem.NotFound(groupUser.MSG_OBJ_NOT_FOUND(GroupUser.name));
            }
        } catch (error) {
            Logger.log(DeleteAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }

        // change flag save to db
        try {
            groupUser.DeleteFlag = DeleteFlag.Yes;
            await this.groupUserRepository.save(groupUser);
            return Problem.Ok(Consts.MSG_DELETE_SUCCESSFULLY(GroupUser.name, groupUser.Id));
        } catch (error) {
            return error;
        }
    }
}
