
import axios from 'axios';
import { HttpStatus } from '@nestjs/common';

export class Requester {
    constructor() {
        //
    }
    /**
     * method post
     * @param url string
     * @param data any
     * @param config? any
     */
    public static async post<T>(url: string, data: any, config?: any): Promise<T | object> {
        try {
            return await axios.post<T>(`${url}`, data, config);
        } catch (e) {
            return {
                status: e.response?.status,
                title: e.response?.statusText,
                detail: e,
            };
        }
    }

    /**
     * get
     * @param url string
     */
    public static async get<T>(url: string, config: any): Promise<T | object> {
        try {
            // method get
            return await axios.get<T>(`${url}`, config);
        } catch (e) {
            return {
                status: e.response?.status,
                detail: e,
            };
        }
    }
}
