export interface IPagination {
    data: any;
    paging: {
        page: number;
        pageSize: number;
        count: number;
    };
}
