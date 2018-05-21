function getUser(name) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(name);
        }, 1000);
    })
}

function getBankBalance(user) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(user === '杨文杰') {
                resolve('$1000');
            } else {
                reject('unknown user');
            }
        }, 1000);
    })
}

async function getAmount() {
    const user = await getUser('xixi');
    const amount = await getBankBalance(user);
    console.log(amount);
}

getAmount();
