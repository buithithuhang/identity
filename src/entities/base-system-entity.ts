import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Request } from 'express';

/**
 * Base system Entity
 * - name,
 * - description,
 * - delete_flag,
 * - created_by,
 * - created_date,
 * - last_updated_by,
 * - last_update_date
 */
export abstract class BaseSystemEntity {

    /**
     * Id
     */
    @PrimaryGeneratedColumn('uuid')
    Id: string;

    /**
     * Name
     */
    @Column({ name: 'name', type: 'varchar', length: 255, nullable: true })
    public Name: string;

    /**
     * Description
     */
    @Column({ name: 'description', type: 'longtext', nullable: true })
    public Description: string;

    /**
     * Delete Flag
     */
    @Column({ name: 'delete_flag', type: 'tinyint', nullable: true, default: 0 })
    @IsNotEmpty()
    public DeleteFlag: number;

    /**
     * Created By
     */
    @Column({ name: 'created_by', type: 'char', length: 64, nullable: true })
    public CreatedBy: string;

    /**
     * Created Date
     */
    @Column({ name: 'created_date', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    @IsNotEmpty()
    public CreatedDate: string;

    /**
     * Last Updated By
     */
    @Column({ name: 'last_updated_by', type: 'char', length: 64, nullable: true })
    public LastUpdatedBy: string;

    /**
     * Last Updated By
     */
    @Column({ name: 'siteId', type: 'char', length: 64, nullable: true })
    public SiteId: string;

    /**
     * Update Date
     */
    @Column({ name: 'last_update_date', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    @IsNotEmpty()
    public LastUpdateDate: string;

    setBaseDataInfo(this, req: Request) {
        this.CreatedBy = this.CreatedBy || req.body.auth_user?.id;
        this.LastUpdatedBy = req.body.auth_user?.id;
        this.SiteId = req.body.site_id;
    }
}
