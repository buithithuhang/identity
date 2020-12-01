import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository, Like } from 'typeorm';
import { DeleteFlag } from 'src/common/enums';
import { Pagination } from 'src/base-model/paging.model';
import { ResCompany } from './../company/models/res.company.model';
import { IPagination } from 'src/base-model/pagination-result';
import { Mapper } from 'src/common/mapper';
import { GetAllAction, Problem, GetAction, UpdateAction, CreateAction, DeleteAction } from 'src/common';
import { ReqCompany } from './models/req.company.model';
import { isNullOrUndefined } from 'util';
import * as Consts from './../common/consts';
import { BaseFields } from 'src/entities/base-system-fields';
import { Request } from 'express';
@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
    ) {

    }

    // Get all data
    async findAll(req: Request, paging?: Pagination) {
        try {

            const rows = await this.companyRepository.findAndCount({
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
                data: Mapper.map(ResCompany, rows[0]),
                paging: { page: paging.page, pageSize: paging.pageSize, count: rows[1] },
            } as IPagination;
        } catch (error) {
            Logger.error(GetAllAction.GetFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async get(req: Request, id: string) {
        try {
            const company = await this.companyRepository.findOne({ Id: id, SiteId: req.body.site_id, DeleteFlag: DeleteFlag.None });
            if (!company) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Company.name));
            }
            return Mapper.map(ResCompany, company);
        } catch (error) {
            Logger.error(GetAction.GetFromDB, error);
            return Problem.InternalServerError();
        }

    }

    async create(req: Request, body: ReqCompany): Promise<Company | Problem> {
        // [1] validate data
        const validMessages = ReqCompany.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(CreateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }

        try {
            const company = new Company();
            company.Name = body.name;
            company.Description = body.description;
            company.Email = body.email;
            company.Owner = body.owner;
            company.Phone = body.phone;
            company.Adress = body.adress;
            company.setBaseDataInfo(req);

            await this.companyRepository.save(company);
            return Mapper.map(ResCompany, company);
        } catch (error) {
            Logger.error(CreateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
    }

    async update(req: Request, id: string, body: ReqCompany): Promise<Company | Problem> {
        // [1] validate data
        const validMessages = ReqCompany.runValidator(body);
        if (validMessages?.length > 0) {
            Logger.log(UpdateAction.ValidateRequest);
            return Problem.BadRequest(validMessages);
        }
        // [2] Check exist on DB
        // tslint:disable-next-line:prefer-const
        let company;
        try {
            company = await this.companyRepository.findOne({ Id: id, SiteId: req.body.site_id, DeleteFlag: DeleteFlag.None });
            if (!company) {
                return Problem.NotFound(Consts.MSG_OBJ_NOT_FOUND(Company.name));
            }
        } catch (error) {
            Logger.error(UpdateAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }
        // Update value
        try {
            company.Name = body.name || company.Name;
            company.Description = body.description || company.Description;
            company.Email = body.email|| company.Email;
            company.Owner = body.owner|| company.Owner;
            company.Phone = body.phone|| company.Phone;
            company.Adress = body.adress|| company.Adress;
            company.setBaseDataInfo(req);

            await this.companyRepository.save(company);
            return Mapper.map(ResCompany, company);
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
        // Get company by id from db
        let company;
        try {
            company = await this.companyRepository.findOne({ Id: id, SiteId: req.body.site_id, DeleteFlag: DeleteFlag.None });
            if (!company) {
                return Problem.NotFound(company.MSG_OBJ_NOT_FOUND(Company.name));
            }
        } catch (error) {
            Logger.log(DeleteAction.CheckFromDB, error);
            return Problem.InternalServerError();
        }

        // change flag save to db
        try {
            company.DeleteFlag = DeleteFlag.Yes;
            await this.companyRepository.save(company);
            return Problem.Ok(Consts.MSG_DELETE_SUCCESSFULLY(Company.name, company.Id));
        } catch (error) {
            return error;
        }
    }
}
