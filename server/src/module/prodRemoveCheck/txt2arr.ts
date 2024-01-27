
import * as fs from 'fs-extra';
import { shuffleArray } from '../../../utils/index'

import sns from './sn.json';


// let data = fs.readFileSync('./sn.txt','utf-8');
// let sns1 = shuffleArray(data.split('\n')); /* 乱序后分组 */
// let sns = [];
// let pageNumber = 48;
// sns1.forEach((i,index)=>{
//     let n = Math.floor(index/pageNumber)
//     if(!sns[n]) sns[n] = []
//     sns[n].push(i.split(','));
// })

// fs.writeFileSync('../sn.json',JSON.stringify(sns))

// console.log(sns)
console.log(sns[0])



 
