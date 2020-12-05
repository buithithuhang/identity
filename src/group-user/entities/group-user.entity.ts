import { User } from 'src/user/entities/user.entity';
import { Entity, Column, JoinTable, ManyToMany, TreeChildren, TreeParent, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseSystemEntity } from '../../entities/base-system-entity';
/**
 * prd_product
 */
@Entity({ name: 'prd_group_user' })
export class GroupUser extends BaseSystemEntity {

    @OneToMany(() => User, user => user.GroupUser)
    Users: User[];

    @TreeParent()
    Parent: GroupUser;

    @TreeChildren()
    Children: GroupUser[];
 
    @Column({ name: 'roles', type: 'json',  nullable: true })
    public Roles: string;

    @Column({name: 'is_default', type:"bool", default: false})
    IsDefault: boolean;

}
