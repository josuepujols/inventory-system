import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { ProductType } from "./ProductType";
import { ProductBrand } from "./ProductBrand"
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    photo!: string;

    @Column()
    name!: string;

    @Column()
    cost!: number;

    @Column()
    price!: number;

    @Column()
    barCode!: string;

    @Column()
    quantity!: number;

    @Column()
    createdAt!: Date;

    @ManyToOne(
        type => ProductType,
        productType => productType.id,
        {
          cascade: ['insert', 'update'],
        }
    )
    productType!: ProductType;

    @ManyToOne(
        type => ProductBrand,
        ProductBrand => ProductBrand.id,
        {
          cascade: ['insert', 'update'],
        }
    )
    productBrand!: ProductBrand;
}