export class Store {
    private static instance: Store
    public isIncognito: boolean = false

    private constructor() { }

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store()
        }
        return Store.instance
    }
}

export const store = Store.getInstance()
