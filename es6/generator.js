// class Users {
//     constructor(users) {
//         this.users = users;
//     }
//
//     *getInterator() {
//         for (let i in this.users) {
//             yield this.users[i];
//         }
//     }
// }
//
// const allUsers = new Users([{name: 1}, {name: 2}, {name: 3}]);

// function *Users(users) {
//     for (let i in users) {
//         yield users[i++]
//     }
// }
//
// const allUsers = Users([{name: 1}, {name: 2}, {name: 3}]);
//
//
// for (const user of allUsers) {
//     console.log(user);
// }

function *generator(a, b) {
    let c = yield a + b;
    console.log(c);
    let d = yield a + b + c;

    yield a + b + c + d;
}

let gen = generator(1, 2);

console.log(gen.next());
console.log(gen.next(3));
console.log(gen.next(4));
console.log(gen.next());
