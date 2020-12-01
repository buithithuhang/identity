import { ApiProperty } from "@nestjs/swagger";

export class ReqLogin {
    
    @ApiProperty()
    public username: string
    
    @ApiProperty()
    public password: string
}