import { Controller, Get, Post, Body, Delete, Param, Put, Query, Req, UseInterceptors } from '@nestjs/common';
import { GroupUserTemplateService } from './group-user-template.service';
import { GroupUserTemplate } from './entities/group-user-template.entity';
import { Problem } from 'src/common';
import { Pagination } from 'src/base-model/paging.model';
import { ReqGroupUserTemplate } from './models/req.group-user-template.model';
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';

@ApiTags('GroupUserTemplate')
@Controller('groupusertemplate')
@ApiBearerAuth()
@UseInterceptors(AuthorizationMiddleware)
export class GroupUserTemplateController {
  constructor(private readonly groupUserTemplateService: GroupUserTemplateService) { }

  @Get()
  async all(@Req() req: Request, @Query() query: Pagination) {
    const result = await this.groupUserTemplateService.findAll(req, new Pagination(query));
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Get(':id')
  async get(@Req() req: Request, @Param('id') id: string) {
    const result = await this.groupUserTemplateService.get(req, id);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Post()
  async create(@Req() req: Request, @Body() body: ReqGroupUserTemplate): Promise<GroupUserTemplate | Problem> {
    const result = this.groupUserTemplateService.create(req, body);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Put(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: ReqGroupUserTemplate): Promise<GroupUserTemplate | Problem> {
    const result = this.groupUserTemplateService.update(req, id, body);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string): Promise<any> {
    const result = this.groupUserTemplateService.delete(req, id);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

}
