import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Company } from "./Company";
import { Role } from "./Role";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    photo!: string;

    @Column()
    createdAt!: Date;

    @Column('int')
    roleId!: number;

    @ManyToOne(
        type => Role,
        role => role.id,
        {
          cascade: ['insert', 'update'],
        }
    )
    @JoinColumn({name: 'roleId'})
    role!: Role;

    @Column('int')
    companyId!: number;

    @ManyToOne(
        type => Company,
        company => company.id,
        {
          cascade: ['insert', 'update'],
        }
    )
    @JoinColumn({name: 'companyId'})
    company!: Company;
}