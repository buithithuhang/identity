import { Controller, Get, Post, Body, Delete, Param, Put, Query, Req, UseInterceptors } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application } from './entities/application.entity';
import { Problem } from 'src/common';
import { Pagination } from 'src/base-model/paging.model';
import { ReqApplication } from './../application/models/req.application.model';
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';

@ApiTags('Application')
@Controller('application')
// Note:: Need to add all controller to check permission
@ApiBearerAuth()
@UseInterceptors(AuthorizationMiddleware)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) { }

  @Get()
  async all(@Req() req: Request, @Query() query: Pagination) {
    const result = await this.applicationService.findAll(req, new Pagination(query));
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Get(':id')
  async get(@Req() req: Request, @Param('id') id: string) {
    const result = await this.applicationService.get(req, id);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Post()
  async create(@Req() req: Request, @Body() body: ReqApplication): Promise<Application | Problem> {
    const result = this.applicationService.create(req, body);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Put(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: ReqApplication): Promise<Application | Problem> {
    const result = this.applicationService.update(req, id, body);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string): Promise<any> {
    const result = this.applicationService.delete(req, id);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

}
