export interface SelectOperate extends Promise<any> {
    from(table: string): SelectOperate;
    where(args: object[]): SelectOperate;
}