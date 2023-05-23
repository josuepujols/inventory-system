//This database configuration is to connect to the databases company
import { Company } from "./Models/Company";
import { Role } from "./Models/Role";
import { User } from "./Models/User";
import { DataSource } from "typeorm";
export class ConnectionSystem {
    async Connect() {
        const AppDataSource = new DataSource({
            type: "mysql",
            host: "151.106.96.74",
            port: 3306,
            database: "u312646245_System",
            username: "u312646245_admin",
            password: "mW@JqL3zj2lBYz#x",
            entities: [Company, Role, User],
            synchronize: true,
            logging: false,
        });
        try {
            const makeConnection = await AppDataSource.initialize();
            console.log("System Database is connected");
            return makeConnection;
        } catch (error) {
            return console.log(error);
        }
    }
}