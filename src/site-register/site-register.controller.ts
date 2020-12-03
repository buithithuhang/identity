import { Controller, Get, Post, Body, Delete, Param, Put, Query, Req, UseInterceptors } from '@nestjs/common';
import { SiteRegisterService } from './site-register.service';
import { SiteRegister } from './entities/site-register.entity';
import { Problem } from 'src/common';
import { Pagination } from 'src/base-model/paging.model';
import { ReqSiteRegister } from './models/req.site-register.model';
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthorizationMiddleware } from 'src/middleware/auth.middleware';

@ApiTags('SiteRegister')
@Controller('siteRegister')
// Note:: Need to add all controller to check permission
//@ApiHeader({ name: 'site_id', required: true })
@ApiBearerAuth()
@UseInterceptors(AuthorizationMiddleware)
export class SiteRegisterController {
  constructor(private readonly siteRegisterService: SiteRegisterService) { }

  @Get()
  async all(@Req() req: Request, @Query() query: Pagination) {
    const result = await this.siteRegisterService.findAll(req, new Pagination(query));
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Get(':id')
  async get(@Req() req: Request, @Param('id') id: string) {
    const result = await this.siteRegisterService.get(req, id);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Post()
  async create(@Req() req: Request, @Body() body: ReqSiteRegister): Promise<SiteRegister | Problem> {
    const result = this.siteRegisterService.create(req, body);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Put(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: ReqSiteRegister): Promise<SiteRegister | Problem> {
    const result = this.siteRegisterService.update(req, id, body);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string): Promise<any> {
    const result = this.siteRegisterService.delete(req, id);
    return (result instanceof Problem)
      ? Problem.HttpException(result)
      : result;
  }

}
