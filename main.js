function getTruckIdsCallback(callback) {
    setTimeout(() => {
        callback([1, 2, 5, 9, 67]);
    }, 100)
}

function getTruckIdsPromise() {
    return new Promise((resolve => {
        getTruckIdsCallback(result => resolve(result));
    }));
}

function getTruckByIdCallback(id, callback) {
    setTimeout(() => {
        const isError = Math.ceil(Math.random() * 1000) < 100;
        if (isError) {
            return callback(undefined, "Internal error");
        }
        callback({
            id: id,
            model: `truck ${id}`
        });
    }, 100)
}

function getTruckByIdPromise(id) {
    return new Promise(resolve => {
        getTruckByIdCallback(id, (result) => {
            resolve(result)
        });
    });
}

function getTruckListCallback(callback) {
    getTruckIdsCallback((ids) => {
        function returnTrucksOrGetNext(index, tryNumber) {
            if (ids[index] === undefined) {
                return callback(trucks);
            }

            getTruckByIdCallback(ids[index], (truck) => {
                if (truck === undefined && tryNumber < 3) {
                    console.log('Error. truckId =', ids[index], '. retryNumber =', tryNumber);
                    returnTrucksOrGetNext(index, tryNumber + 1)
                } else {
                    trucks.push(truck);
                    returnTrucksOrGetNext(index + 1, 1);
                }
            })
        }

        const trucks = [];
        returnTrucksOrGetNext(0, 1);
    });
}


function getTruckListPromise(callback) {
    getTruckIdsPromise().then((ids) => {
        function returnTrucksOrGetNext(index, tryNumber) {
            if (ids[index] === undefined) {
                return callback(trucks);
            }

            getTruckByIdPromise(ids[index]).then((truck) => {
                if (truck === undefined && tryNumber < 3) {
                    console.log('Error. truckId =', ids[index], '. retryNumber =', tryNumber);
                    returnTrucksOrGetNext(index, tryNumber + 1)
                } else {
                    trucks.push(truck);
                    returnTrucksOrGetNext(index + 1, 1);
                }
            })
        }

        const trucks = [];
        returnTrucksOrGetNext(0, 1);
    });
}

function print(data) {
    console.log(data);
}

getTruckListCallback(print);
getTruckListPromise(print);

