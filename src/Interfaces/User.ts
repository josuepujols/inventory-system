import { Company } from "../Models/Company";
import { Role } from "../Models/Role";

export interface IUser {
    id?: number;
    name: string;
    email: string;
    password: string;
    photo: string;
    createdAt: Date;
    roleId: number;
    role: Role;
    companyId: number;
    company: Company;
}