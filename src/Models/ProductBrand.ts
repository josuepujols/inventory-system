import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductBrand {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 50
    })
    name!: string;

    @Column()
    createdAt!: Date;
}