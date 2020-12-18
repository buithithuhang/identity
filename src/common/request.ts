import { Problem, Requester } from '../common';

export interface ITarget {
    url: string
}

export class RequestTarget {
    static async get(req, target: ITarget) {
        try {
            const headers = { headers: { authorization: req.headers.authorization } };
            return await Requester.get(target.url, headers);

        }
        catch (error) {
            return Problem.InternalServerError();
        }
    }


    static async post(req, target: ITarget) {
        try {
            const headers = { headers: { authorization: req.headers.authorization , site_id: req.headers.site_id} };
            return await Requester.post(target.url, { body: req.body }, headers);

        }
        catch (error) {
            return Problem.InternalServerError();
        }
    }


    static async put(req, target: ITarget) {
        try {
            const headers = { headers: { authorization: req.headers.authorization } };
            return await Requester.put(target.url, { body: req.body }, headers);

        }
        catch (error) {
            return Problem.InternalServerError();
        }
    }


    static async delete(req, target: ITarget) {
        try {
            const headers = { headers: { authorization: req.headers.authorization } };
            return await Requester.delete(target.url, headers);

        }
        catch (error) {
            return Problem.InternalServerError();
        }
    }
}
