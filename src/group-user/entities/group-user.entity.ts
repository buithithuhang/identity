import { GroupUserRole } from 'src/group-user-role/entities/group-user-role.entity';
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

    @OneToMany(() => GroupUserRole, groupUserRole => groupUserRole.GroupUser)
    GroupUserRoles: GroupUserRole[];

    @TreeParent()
    Parent: GroupUser;

    @TreeChildren()
    Children: GroupUser[];

}
