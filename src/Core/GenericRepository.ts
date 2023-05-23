import { DataSource, FindOptionsRelationByString, FindOptionsRelations, FindOptionsWhere, ObjectType, Repository, UpdateResult } from "typeorm";
import { from } from "linq-to-typescript"; 
export class GenericRepository<T> {
    private type: ObjectType<T>;
    private repository: Repository<T>;
    private _dataSource!: DataSource;
    constructor(type: ObjectType<T>, AppDataSource: DataSource) {
        this.type = type;
        this._dataSource = AppDataSource;
        this.repository = this._dataSource.getRepository<T>(this.type);
    }
    async GetListAsync(
        predicate?: (x: T, index: number) => boolean, 
        pageNumber?: number,
        pageSize?: number,
        listRelation?: Array<string>
        ): Promise<Array<T>> {
        let collection: Array<T> = [];
        if (listRelation === undefined) collection = await this.repository.find();
        else if (listRelation !== undefined) { 
            collection = await this.repository.find({
                relations: listRelation
            });
        }
        if (predicate !== undefined) collection = from<T>(collection).where(predicate).toArray();
        if (pageSize as number > 0 && pageNumber as number > 0) {
            collection = from<T>(collection).skip((pageNumber as number - 1) * (pageSize as number))
                                            .take(pageSize as number).toArray();
        }
        return collection;
    }

    async InsertAsync(model: T): Promise<T> {
        const result = await this.repository.save<T>(model);
        return result;
    }

    async UpdateAsync(id: number, model: T): Promise<UpdateResult> {
        const result = await this.repository.update(id, model);
        return result;
    }

    async DeleteAsync(model: T): Promise<T> {
        const result = await this.repository.remove(model);
        return result;
    }

    async FindWhereAsync(predicate: (x: T) => boolean, listRelation?: Array<string>): Promise<T> {
        let collection;
        if (listRelation === undefined) collection = await this.repository.find();
        else collection = await this.repository.find({
            relations: listRelation
        });
        return from<T>(collection).firstOrDefault(predicate) as T;
    }
}