import * as Consts from '../common/consts';

import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Problem, Requester } from '../common';

import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    async use(req: Request, res: any, next: () => void) {

        if (!req.headers.authorization) {
            throw Problem.HttpException(Problem.UnAuthorized(Consts.MSG_AUTH_FAILED));
        }
        req.body.site_id = req.headers.site_id;
        

        // TODO if user role != superadmin => check req.headers.site_id
        try {
            var decoded = jwt.verify(req.headers.authorization.replace('Bearer ', ''), 'secret');
            req.body.user = decoded.data;
            //TODO will be check role 
            req.body.user.role = 'superadmin';
        } catch (err) {
            // err
            throw Problem.HttpException(Problem.UnAuthorized(Consts.MSG_AUTH_FAILED));
        }

        // const headers = { headers: { authorization: req.headers.authorization } };
        // const response: any = await Requester.post(`${process.env.AUTH_API}/site/verify`, { site_id: req.headers.site_id }, headers);
        // if (![HttpStatus.OK, HttpStatus.CREATED, HttpStatus.ACCEPTED].includes(response.status)) {
        //     throw Problem.HttpException({
        //         status: response?.status,
        //         message: response?.detail?.response?.data?.message,
        //     });
        // } else {
        //     req.body.auth_user = response?.data?.message?.auth_user;
        //     req.body.site_id = response?.data?.message?.site_id;
        // }

        next();
    }
}
