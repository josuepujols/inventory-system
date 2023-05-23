//This database configuration is to connect to the databases company
import { DataSource } from "typeorm";
//Models import
import { Product } from "./Models/Product";
import { Audit } from "./Models/Audit";
import { Operation } from "./Models/Operation";
import { ProductBrand } from "./Models/ProductBrand";
import { ProductType } from "./Models/ProductType";
export class Connection {
    async Connect(nameCompany: string) {
        const AppDataSource = new DataSource({
            type: "mysql",
            host: "151.106.96.74",
            port: 3306,
            database: "u312646245_" + nameCompany,
            username: "u312646245_" + nameCompany,
            password: "Test1234*",
            //password: "k#@jeG5xG^ejpOrS", /*this is the password to use*/
            entities: [Product, Audit, Operation, ProductBrand, ProductType],
            synchronize: true,
            logging: false,
        });
        try {
            const makeConnection = await AppDataSource.initialize();
            console.log("Database is connected");
            return makeConnection;
        } catch (error) {
            return console.log(error);
        }
    }
}