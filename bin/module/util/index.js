export function throttle (fn, delay, mustRunDelay = 0) {
    let timer = null;
    let tStart;
    return function () {
        const context = this;
        const args = arguments;
        const tCurr = +new Date();
        clearTimeout(timer);
        if (!tStart) {
            tStart = tCurr;
        }
        if (mustRunDelay !== 0 && tCurr - tStart >= mustRunDelay) {
            fn.apply(context, args);
            tStart = tCurr;
        } else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    };
};

export function sleep(time) {
    return new Promise(resolve => setTimeout(() => resolve(1), time))
};

export function type (data) {
    if (!data) return false
    let result = Object.prototype.toString.call(data)
    return result.match(/\[object\s(.+)\]/)[1].toLowerCase()
    /**
     * @return [object,array,number,string,date,regexp,map,set,symbol]
     * */
};