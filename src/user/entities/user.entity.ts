import { Company } from 'src/company/entities/company.entity';
import { GroupUser } from 'src/group-user/entities/group-user.entity';
import { Entity, Column, JoinTable, ManyToMany, TreeChildren, TreeParent, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseSystemEntity } from '../../entities/base-system-entity';
/**
 * prd_product
 */
@Entity({ name: 'prd_user' })
export class User extends BaseSystemEntity {

    @Column({ name: 'avatar', type: 'varchar', length: 150, nullable: true })
    public Avatar: string;

    @Column({ name: 'birthday', type: 'date', nullable: true })
    public Birthday: Date;

    @Column({ name: 'phone', type: 'varchar', length: 15, nullable: true })
    public Phone: string;

    @Column({ name: 'email', type: 'varchar', length: 150, nullable: true })
    public Email: string;

    @Column({ name: 'gender', type: 'varchar', length: 15, nullable: true })
    public Gender: string;

    @Column({ name: 'position', type: 'varchar', length: 100, nullable: true })
    public Position: string;

    @Column({ name: 'adress', type: 'varchar', length: 150, nullable: true })
    public Adress: string;

    @Column({ name: 'user_name', type: 'varchar', length: 100, nullable: true })
    public UserName: string;

    @Column({ name: 'password', type: 'varchar', length: 150, nullable: true })
    public PassWord: string;

    @Column({ name: 'company_id', type: 'char', length: 64, nullable: true })
    CompanyId: string;

    @ManyToOne(() => Company, company => company.Users)
    @JoinColumn({ name: 'company_id' })
    Company: Company;

    @Column({ name: 'group_user_id', type: 'char', length: 64, nullable: true })
    GroupUserID: string;

    @ManyToOne(() => GroupUser, groupUser => groupUser.Users)
    @JoinColumn({ name: 'group_user_id' })
    GroupUser: GroupUser;

    @TreeParent()
    Parent: User;

    @TreeChildren()
    Children: User[];

}
