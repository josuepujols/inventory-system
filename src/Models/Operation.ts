import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { Audit } from "./Audit";
import { OperationType } from "Helpers/OperationType.type";
@Entity()
export class Operation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    type!: OperationType;

    @Column()
    quantity!: number;

    @ManyToOne(
        type => Product,
        product => product.id,
        {
          cascade: ['insert', 'update'],
        }
    )
    product!: Product;

    @ManyToOne(
        type => Audit,
        audit => audit.id,
        {
          cascade: ['insert', 'update'],
        }
    )
    audit!: Audit;
}