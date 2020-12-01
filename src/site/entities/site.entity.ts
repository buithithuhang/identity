import { Application } from 'src/application/entities/application.entity';
import { Company } from 'src/company/entities/company.entity';
import { SiteRegister } from 'src/site-register/entities/site-register.entity';
import {  Entity, Column, JoinTable, ManyToMany, TreeChildren, TreeParent, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseSystemEntity } from '../../entities/base-system-entity';
/**
 * prd_product
 */
@Entity({ name: 'prd_site' })
export class Site extends BaseSystemEntity {

    @Column({ name: 'domain', type: 'varchar', length: 150, nullable: true })
    public Domain: string;

    @Column({name:'application_id', type: 'char', length: 64, nullable: true  })
    ApplicationId: string;

    @ManyToOne(() => Application, application => application.Sites)
    @JoinColumn({name:'application_id'})
    Application: Application;

    @OneToMany(() => SiteRegister, siteRegister=> siteRegister.Site)
    SiteRegisters: SiteRegister[];

    @Column({name:'company_id', type: 'char', length: 64, nullable: true  })
    CompanyId: string;

    @ManyToOne(() => Company, company => company.Sites)
    @JoinColumn({name:'company_id'})
    Company: Company;

    @TreeParent()
    Parent: Site;

    @TreeChildren()
    Children: Site[];

}
