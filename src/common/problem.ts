import { HttpStatus, HttpException } from '@nestjs/common';
import * as Consts from './consts';

export class Problem {
    public status: HttpStatus;
    public message: string;

    /**
     * @param json {  status: HttpStatus, message: string }
     */
    constructor(json?: any) {
        if (json) {
            Object.assign(this, json);
        }
    }

    public static InternalServerError = () => {
        return new Problem({ message: Consts.MSG_INTERNAL_SERVER_ERROR, status: HttpStatus.INTERNAL_SERVER_ERROR });
    }

    public static UnAuthorized = (message?: string) => {
        return new Problem({ message, status: HttpStatus.UNAUTHORIZED });
    }

    public static NotFound = (message?: string) => {
        return new Problem({ message, status: HttpStatus.NOT_FOUND });
    }

    public static BadRequest = (message?: any) => {
        return new Problem({ message, status: HttpStatus.BAD_REQUEST });
    }

    public static Ok = (message?: string) => {
        return new Problem({ message, status: HttpStatus.OK });
    }

    public static HttpException = (problem: Problem) => {
        throw new HttpException({ message: problem.message }, problem.status);
    }
}
