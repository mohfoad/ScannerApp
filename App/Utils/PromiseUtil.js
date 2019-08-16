export const defer = () => {
    const result = {}
    const promise = new Promise((resolve, reject) => {
        result.resolve = resolve
        result.reject = reject
    })
    result.promise = promise
    return result
}

export const timeout = (duration, promiseInstance) => {
    const d = defer()

    const _timer = setTimeout(() => {
        d.reject(new Error(`Promise timed out after ${duration / 1000} seconds`))
    }, duration)

    Promise.resolve()
        .then(promiseInstance)
        .then(result => {
            d.resolve(result)
            clearTimeout(_timer)
        })
        .catch(d.reject)

    return d.promise
}

export const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time))

export default module.exports
