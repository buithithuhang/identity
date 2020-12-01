import { Site } from 'src/site/entities/site.entity';
import {  Entity, Column, JoinTable, ManyToMany, TreeChildren, TreeParent, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseSystemEntity } from '../../entities/base-system-entity';
/**
 * prd_product
 */
@Entity({ name: 'prd_site_register' })
export class SiteRegister extends BaseSystemEntity {

    @Column({ name: 'register_date', type: 'date', nullable: true })
    public RegisterDate: Date;

    @Column({ name: 'expired', type: 'date', nullable: true })
    public Expired: Date;

    @Column({ name: 'register_plan', type: 'varchar', length: 150, nullable: true })
    public RegisterPlan: string;

    @Column({name:'site_id', type: 'varchar', length: 64, nullable: true  })
    SiteId: string;

    @ManyToOne(() => Site, site => site.SiteRegisters)
    @JoinColumn({name:'site_id'})
    Site: Site;

    @TreeParent()
    Parent: SiteRegister;

    @TreeChildren()
    Children: SiteRegister[];

}
