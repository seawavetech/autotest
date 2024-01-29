
import * as fs from 'fs-extra';
import { shuffleArray } from '../../../utils/index'

// import sns from './sn.json';


let denySn=["715519","714856","715678","715679","715518","715512","714871","716132","714858",
"716110","714860","715677","716216","715535","715676","716063","715510","715541","715536",
"715681","715531","715513","715506","715507","716133","715537","715523","715683","716064",
"714891","716217","715461","715673","714859","715539","715731","333696","714866","715674",
"715285","715036","715521","715538","714865","715509","715534","715533","715508","715682",
"715282","333922","715540","715532","715542","715680","715520","715675","715672","714905",
"715335"]
let data = fs.readFileSync('./data/sn.txt','utf-8');
let sns1 = shuffleArray(data.split('\n').filter(i=>{
    return !denySn.some(j=>j== String(i.split(',')[0]))
})); /* 乱序后分组 */
let sns = [];
let pageNumber = 48;

sns1.forEach((i,index)=>{
    let n = Math.floor(index/pageNumber)
    if(!sns[n]) sns[n] = []
    sns[n].push(i.split(','));
})

fs.writeFileSync('./sn.json',JSON.stringify(sns))

// console.log(sns)
// console.log(sns[0])



 
