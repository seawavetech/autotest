// export function throttle (fn, delay, mustRunDelay = 0) {
//     let timer = null;
//     let tStart;
//     return function () {
//         const context = this;
//         const args = arguments;
//         const tCurr = +new Date();
//         clearTimeout(timer);
//         if (!tStart) {
//             tStart = tCurr;
//         }
//         if (mustRunDelay !== 0 && tCurr - tStart >= mustRunDelay) {
//             fn.apply(context, args);
//             tStart = tCurr;
//         } else {
//             timer = setTimeout(function () {
//                 fn.apply(context, args);
//             }, delay);
//         }
//     };
// };

/**
 * 
 * @param time number delaytime(ms)
 * */
export function sleep(time1:number = 3,time2?: undefined | number) {
    let time = !time2 ? time1: Math.floor(Math.random()*(time2-time1))+time1;
    return new Promise(resolve => setTimeout(() => resolve(1), time*1000))
};

export function type (data) {
    if (!data) return false
    let result = Object.prototype.toString.call(data)
    return result.match(/\[object\s(.+)\]/)[1].toLowerCase()
    /**
     * @return [object,array,number,string,date,regexp,map,set,symbol]
     * */
};

/* 数组乱序 */
export function shuffleArray(array:any[]) {  
    let currentIndex = array.length, temporaryValue, randomIndex;  
     // 当还剩有元素未洗牌时
    while (0 !== currentIndex) {  
        // 选取剩下的元素…  
        randomIndex = Math.floor(Math.random() * currentIndex);  
        currentIndex -= 1;  
        // 并与当前元素交换  
        temporaryValue = array[currentIndex];  
        array[currentIndex] = array[randomIndex];  
        array[randomIndex] = temporaryValue;  
    }  
    return array;  
}