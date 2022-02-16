function noop() {} //пустая функция

class VladilenPromise {
    constructor(executor) {
        this.queue = [];
        this.errorHandler = noop;
        this.finallyHandler = noop;

        //если будет получена ошибка, то вызовется ф-ция errorHandler
        try {
            executor.call(null, this.onResolve.bind(this), this.onReject.bind(this)); //null потому что контекст здесь неважен; executor.call - ф. вызывает другие ф-ции
        } catch (error) {
            this.errorHandler(error);
        } finally {
            this.finallyHandler();
        }
        
    }

    onResolve(data) {
        this.queue.forEach(callback => {
            data = callback(data);
        });
        this.finallyHandler();
    }

    onReject(error) {
        this.errorHandler(error);
        this.finallyHandler();
    }

    then(fn) {
        this.queue.push(fn);
        return this;
    }

    catch(fn) {
        this.errorHandler = fn;
        return this;
    }

    finally(fn) {
        this.finallyHandler = fn;
        return this;
    }
}

//пример промиса
// const promise = new VladilenPromise ((resolve, reject) => {
//     setTimeout(() => {
//         // resolve('NgRx');
//         reject('some error');
//     }, 150);
// });

// promise
//     .then(course => course.toUpperCase())
//     .then(title => console.log(title))
//     .catch(err => console.log(err))
//     .finally(() => console.log('finally'));

module.exports = VladilenPromise;