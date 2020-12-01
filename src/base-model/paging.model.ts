import { ApiProperty } from '@nestjs/swagger';

export class Pagination {

    @ApiProperty({ required: false })
    page: number;

    @ApiProperty({ required: false })
    pageSize: number;

    @ApiProperty({ required: false })
    filter: string;

    constructor(paging?: any) {
        this.page = paging?.page ? paging.page : 0;
        this.pageSize = paging?.pageSize ? paging.pageSize : 10;
        this.filter = paging?.filter ? paging.filter : '';
    }
}
