import { Functions } from 'src/functions/entities/functions.entity';
import { Site } from 'src/site/entities/site.entity';
import {  Entity, Column, JoinTable, ManyToMany, TreeChildren, TreeParent, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseSystemEntity } from '../../entities/base-system-entity';
/**
 * prd_product
 */
@Entity({ name: 'prd_application' })
export class Application extends BaseSystemEntity {

    @Column({name: 'hostname', type: 'varchar', nullable: true })
    HostName: string;

    @OneToMany(() => Functions, functions=> functions.Application)
    Functionses: Functions[];

    @OneToMany(() => Site, site=> site.Application)
    Sites: Site[];

    @TreeParent()
    Parent: Application;

    @TreeChildren()
    Children: Application[];

}
