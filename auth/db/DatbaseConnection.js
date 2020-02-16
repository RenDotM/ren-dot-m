class DatabaseFactory {
    constructor() {
    }
    static createDB(type) {
        const config = require('config');
        const  dbHost = config.get('db.host');
        const  dbPort = config.get('db.port');
        const  dbName = config.get('db.name');
        if(type === "memory") {
            return new MemoryDatabase(dbHost, dbPort, dbName)
        }
    }
};

class Database {
    constructor(host, port, name) {
        this.host = host;
        this.port = port;
        this.name = name;
    }
    getUserById(){}
    createUser(){}
    getUsers(){}
    updateUserById(){}
    deleteUserById(){}
}

class MemoryDatabase extends Database{
    constructor(host, port, name) {
        super(host, port, name);
        this.users = [
            {
                user_id: '1',
                username: 'ck43789@gmail.com',
                password: 'abc123',
                tenants: [1, 2, 3]
            },
            {
                user_id: '2',
                username: 'ppui2567@gmail.com',
                password: 'abc456',
                tenants: [1, 2, 3]
            }
        ];
    }

    createUser(user) {
        this.users.push(user)
        return this.users
    }

    getUserById(userId) {
        return this.users.find(_user => _user.user_id === userId);
    }

    getUsers() {
        return this.users
    }

    updateUserById(userId, content) {
        const updatedListItems = [];
        // loop through list to find and replace one item
        this.users.forEach(oldItem => {
            if (oldItem.user_id === userId) {
                updatedListItems.push(content);
            } else {
                updatedListItems.push(oldItem);
            }
        });

        // replace old list with new one
        this.users = updatedListItems;
        return this.users;
    }

    deleteUserById(userId) {
        // filter list copy, by excluding item to delete
        const filtered_list = this.users.filter(user => user.user_id !== userId);
        this.users = filtered_list;
        return this.users;
    }
}

//We can add file database or real database easily. in here

// class MongoDB extends Database{
//     constructor(host, port, name) {
//         super(host, port, name);
//     }
//
//     createUser(user) {
//     }
//
//     getUserById(userId) {
//     }
//
//     getUsers() {
//         return this.users
//     }
//
//     updateUserById(userId, content) {
//     }
//
//     deleteUserById(userId) {
//     }
// }

module.exports = DatabaseFactory
