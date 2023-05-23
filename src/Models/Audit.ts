import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
@Entity()
export class Audit {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    createdAt!: Date;
}