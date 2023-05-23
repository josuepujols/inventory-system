import { DataSource } from 'typeorm';
import app from './app';
import { Connection } from "./databaseCompany";
import { ConnectionSystem } from "./databaseSystem";

async function Main() {
    app.listen(app.get('port'));
    console.log("The server is running on port: ", app.get('port'));
}
//This configuration is to connect to the system database and to manage users
export async function ConnectAuth() : Promise<DataSource> {
    const connection: ConnectionSystem = new ConnectionSystem();
    return await connection.Connect() as DataSource; 
}
//This configuration is for each company that is going to use de application 
export async function ConnectCompany(nameCompany: string) : Promise<DataSource> {
    const connection: Connection = new Connection();
    return await connection.Connect(nameCompany) as DataSource; 
}

Main();
