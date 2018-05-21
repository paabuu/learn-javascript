const arr = [1, 2, 3, 4];

for (var ret, it = arr[Symbol.iterator]();
    (ret = it.next()) && !ret.done;
) {
    console.log(ret.value);
}
