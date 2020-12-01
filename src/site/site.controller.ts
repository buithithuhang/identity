import { Controller, Get, Post, Body, Delete, Param, Put, Query, Req, UseInterceptors } from '@nestjs/common';
import { SiteService } from './site.service';
import { Site } from './entities/site.entity';
import { Problem } from 'src/common';
import { Pagination } from 'src/base-model/paging.model';
import { ReqSite } from './../site/models/req.site.model';
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';

@ApiTags('Site')
@Controller('site')
// Note:: Need to add all controller to check permission
@ApiHeader({ name: 'site_id', required: true })
@ApiBearerAuth()
@UseInterceptors(AuthorizationMiddleware)
export class SiteController {
  constructor(private readonly siteService: SiteService) { }

  @Get()
  async all(@Req() req: Request, @Query() query: Pagination) {
    const result = await this.siteService.findAll(req, new Pagination(query));
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Get(':id')
  async get(@Req() req: Request, @Param('id') id: string) {
    const result = await this.siteService.get(req, id);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Post()
  async create(@Req() req: Request, @Body() body: ReqSite): Promise<Site | Problem> {
    const result = this.siteService.create(req, body);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Put(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: ReqSite): Promise<Site | Problem> {
    const result = this.siteService.update(req, id, body);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string): Promise<any> {
    const result = this.siteService.delete(req, id);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

}
