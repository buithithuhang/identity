import { Site } from 'src/site/entities/site.entity';
import { User } from 'src/user/entities/user.entity';
import {  Entity, Column, JoinTable, ManyToMany, TreeChildren, TreeParent, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseSystemEntity } from '../../entities/base-system-entity';
/**
 * prd_product
 */
@Entity({ name: 'prd_company' })
export class Company extends BaseSystemEntity {

    @Column({ name: 'email', type: 'varchar', length: 150, nullable: true })
    public Email: string;

    @Column({ name: 'owner', type: 'varchar', length: 150, nullable: true })
    public Owner: string;

    @Column({ name: 'phone', type: 'varchar', length: 15, nullable: true })
    public Phone: string;

    @Column({ name: 'adress', type: 'varchar', length: 150, nullable: true })
    public Adress: string;

    @OneToMany(() => Site, site=> site.Company)
    Sites: Site[];

    @OneToMany(() => User, user=> user.Company)
    Users: User[];

    @TreeParent()
    Parent: Company;

    @TreeChildren()
    Children: Company[];

}
