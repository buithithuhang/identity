import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupUserRole } from './entities/group-user-role.entity';
import { Repository, Like } from 'typeorm';
import { DeleteFlag } from 'src/common/enums';
import { Pagination } from 'src/base-model/paging.model';
import { ResGroupUserRole } from './models/res.group-user-role.model';
import { IPagination } from 'src/base-model/pagination-result';
import { Mapper } from 'src/common/mapper';
import { GetAllAction, Problem, GetAction, UpdateAction, CreateAction, DeleteAction } from 'src/common';
import { ReqGroupUserRole } from './models/req.group-user-role.model';
import { isNullOrUndefined } from 'util';
import * as Consts from '../common/consts';
import { BaseFields } from 'src/entities/base-system-fields';
import { Request } from 'express';
import { GroupUser } from 'src/group-user/entities/group-user.entity';
@Injectable()
export class GroupUserRoleService {
    constructor(
        @InjectRepository(GroupUserRole)
        private groupUserRoleRepository: Repository<GroupUserRole>,

        @InjectRepository(GroupUser)
        private groupUserRepository: Repository<GroupUser>,
    ) {

    }

    // Get all data
    async findAll(req: Request, paging?: Pagination) {
        try {

            const rows = await this.groupUserRoleRepository.findAndCount({
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
                data: Mapper.map(ResGroupUserRole, rows[0]),
                paging: { page: paging.page, pageSize: paging.pageSize, count: rows[1] },
            } as IPagination;
        } catch (error) {
            Logger.error(GetAllAction.GetFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async get(req: Request, id: string) {
        try {
            const groupUserRole = await this.groupUserRoleRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!groupUserRole) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(GroupUserRole.name));
            }
            return Mapper.map(ResGroupUserRole, groupUserRole);
        } catch (error) {
            Logger.error(GetAction.GetFromDB, error);
            return Problem.InternalServerError();
        }

    }

    async create(req: Request, body: ReqGroupUserRole): Promise<GroupUserRole | Problem> {
        // [1] validate data
        const validMessages = ReqGroupUserRole.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(CreateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }

        // check group_user_id
        let groupUser: GroupUser;
        try {
            groupUser = await this.groupUserRepository.findOne({ Id: body.group_user_id, DeleteFlag: DeleteFlag.None });
            if (!groupUser) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(GroupUser.name));
            }
        } catch (ex) {
            Logger.log(CreateAction.ValidateRequest);
            return Problem.InternalServerError();
        }

        try {
            const groupUserRole = new GroupUserRole();
            groupUserRole.Name = body.name;
            groupUserRole.Description = body.description;
            groupUserRole.Roles = body.roles;
            groupUserRole.GroupUser = groupUser;
            groupUserRole.setBaseDataInfo(req);

            await this.groupUserRoleRepository.save(groupUserRole);
            return Mapper.map(ResGroupUserRole, groupUserRole);
        } catch (error) {
            Logger.error(CreateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async update(req: Request, id: string, body: ReqGroupUserRole): Promise<GroupUserRole | Problem> {
        // [1] validate data
        const validMessages = ReqGroupUserRole.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(UpdateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }
        // [2] Check exist on DB
        // tslint:disable-next-line:prefer-const
        let groupUserRole;
        try {
            groupUserRole = await this.groupUserRoleRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!groupUserRole) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(GroupUserRole.name));
            }
        } catch (error) {
            Logger.error(UpdateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
        // check groupUser id
        let groupUser: GroupUser;
        if (body.group_user_id && groupUserRole.group_user_id !== body.group_user_id) {
            let groupUser: GroupUser;
            try {
                groupUser = await this.groupUserRepository.findOne({ Id: body.group_user_id, DeleteFlag: DeleteFlag.None });
                if (!groupUser) {
                    return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(GroupUser.name));
                }
            } catch (ex) {
                Logger.log(CreateAction.ValidateRequest);
                return Problem.InternalServerError();
            }
        }
        // Update value
        try {
            groupUserRole.Name = body.name || groupUserRole.Name;
            groupUserRole.Description = body.description || groupUserRole.Description;
            groupUserRole.Roles = body.roles || groupUserRole.Roles;
            groupUserRole.group_user_id = groupUser?.Id || groupUserRole.group_user_id;
            groupUserRole.setBaseDataInfo(req);

            await this.groupUserRoleRepository.save(groupUserRole);
            return Mapper.map(ResGroupUserRole, groupUserRole);
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
        // Get groupUserRole by id from db
        let groupUserRole;
        try {
            groupUserRole = await this.groupUserRoleRepository.findOne({ Id: id, DeleteFlag: DeleteFlag.None });
            if (!groupUserRole) {
                return Problem.NotFound(groupUserRole.MSG_OBJ_NOT_FOUND(GroupUserRole.name));
            }
        } catch (error) {
            Logger.log(DeleteAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }

        // change flag save to db
        try {
            groupUserRole.DeleteFlag = DeleteFlag.Yes;
            await this.groupUserRoleRepository.save(groupUserRole);
            return Problem.Ok(Consts.MSG_DELETE_SUCCESSFULLY(GroupUserRole.name, groupUserRole.Id));
        } catch (error) {
            return error;
        }
    }
}
