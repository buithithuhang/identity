import { Controller, Get, Post, Body, Delete, Param, Put, Query, Req, UseInterceptors } from '@nestjs/common';
import { GroupUserService } from './group-user.service';
import { GroupUser } from './entities/group-user.entity';
import { Problem } from 'src/common';
import { Pagination } from 'src/base-model/paging.model';
import { ReqGroupUser } from './models/req.group-user.model';
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';

@ApiTags('GroupUser')
@Controller('groupUser')
// Note:: Need to add all controller to check permission
@ApiHeader({ name: 'site_id', required: true })
@ApiBearerAuth()
@UseInterceptors(AuthorizationMiddleware)
export class GroupUserController {
  constructor(private readonly groupUserService: GroupUserService) { }

  @Get()
  async all(@Req() req: Request, @Query() query: Pagination) {
    const result = await this.groupUserService.findAll(req, new Pagination(query));
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Get(':id')
  async get(@Req() req: Request, @Param('id') id: string) {
    const result = await this.groupUserService.get(req, id);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Post()
  async create(@Req() req: Request, @Body() body: ReqGroupUser): Promise<GroupUser | Problem> {
    const result = this.groupUserService.create(req, body);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Put(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: ReqGroupUser): Promise<GroupUser | Problem> {
    const result = this.groupUserService.update(req, id, body);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string): Promise<any> {
    const result = this.groupUserService.delete(req, id);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

}
