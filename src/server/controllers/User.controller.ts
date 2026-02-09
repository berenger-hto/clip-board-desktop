import { UserModel } from "../model/UserModel";

export class User {
    constructor() {
        const db = new UserModel()
        db.createUniqueToken()
    }
}