import { BaseSystemEntity } from "src/entities";
import { Column, Entity } from "typeorm";

// xu ly nhu entity
@Entity({ name: 'prd_email_template' })
export class EmailTemplate extends BaseSystemEntity {

    @Column({name: "key", type: 'nvarchar'})
    public Key: string;

    
}
