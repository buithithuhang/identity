import { Application } from 'src/application/entities/application.entity';
import { Entity, Column, JoinTable, ManyToMany, TreeChildren, TreeParent, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseSystemEntity } from '../../entities/base-system-entity';
/**
 * prd_product
 */
@Entity({ name: 'prd_functions' })
export class Functions extends BaseSystemEntity {

    @Column({ name: 'api_url', type: 'varchar', length: 150, nullable: true })
    public ApiUrl: string;

    @Column({ name: 'application_id', type: 'varchar', length: 64, nullable: true })
    ApplicationId: string;

    @ManyToOne(() => Application, application => application.Functionses)
    @JoinColumn({ name: 'application_id' })
    Application: Application;

    @TreeParent()
    Parent: Functions;

    @TreeChildren()
    Children: Functions[];

}
