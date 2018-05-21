class Users {
    constructor(users) {
        this.users = users;
    }

    [Symbol.iterator]() {
        let i = 0;
        const users = this.users;

        return {
            next() {
                if (i < users.length) {
                    return {
                        value: users[i++],
                        done: false
                    };
                }

                return { done: true };
            }
        }
    }
}


const users = new Users([
    { name: 'yang' },
    { name: 'wen' },
    { name: 'jie' }
]);

for (const user of users)  {
    console.log(user);
}
