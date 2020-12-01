import { GroupUser } from 'src/group-user/entities/group-user.entity';
import { Entity, Column, JoinTable, ManyToMany, TreeChildren, TreeParent, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseSystemEntity } from '../../entities/base-system-entity';
/**
 * prd_product
 */
@Entity({ name: 'prd_group_user_role' })
export class GroupUserRole extends BaseSystemEntity {

    @Column({ name: 'roles', type: 'json',  nullable: true })
    public Roles: string;

    @Column({ name: 'group_user_id', type: 'char', length: 64, nullable: true })
    GroupUserID: string;

    @ManyToOne(() => GroupUser, groupUser => groupUser.GroupUserRoles)
    @JoinColumn({ name: 'group_user_id' })
    GroupUser: GroupUser;

    @TreeParent()
    Parent: GroupUserRole;

    @TreeChildren()
    Children: GroupUserRole[];

}
