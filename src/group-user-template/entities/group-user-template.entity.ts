import { Entity, Column, TreeChildren, TreeParent } from 'typeorm';

import { BaseSystemEntity } from '../../entities/base-system-entity';
/**
 * prd_product
 */
@Entity({ name: 'prd_group_user_template' })
export class GroupUserTemplate extends BaseSystemEntity {
 
    @TreeParent()
    Parent: GroupUserTemplate;

    @TreeChildren()
    Children: GroupUserTemplate[];

    // Created by Supperadmin
    @Column({name: 'is_default', type:"bool", default: false})
    IsDefault: boolean;

    @Column({ name: 'roles', type: 'json',  nullable: true })
    public Roles: string;

}
