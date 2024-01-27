
import { Dispatch} from '../src/module/autotest';
import { Crawler } from '../src/module/prodRemoveCheck';
// import { Dispatch} from '../src/module/autotest';
import { DispatchOption,ResultDataType} from '../src/module//@type/autotest'
import axios from 'axios';

interface siteData {
    site: DispatchOption['site'];
    platform: DispatchOption['platform'];
    type: DispatchOption['type'];
    range: DispatchOption['range'];
}

let url = ''
let noticeTitle = ''
let msgArr:ResultDataType[] = []
let logCallback = (data:ResultDataType):void=>{

    switch (data.type) {
        case 'ctrl':
            if (data.message === 'close') {
                notice()
            }
            break;
        default:
            msgArr.push(data)
    }

};


function notice(){

    let textArr = msgArr.map(i=>{
        let str = `状态:${i.type} | 位置：${i.position}`;
        if(i.message) {
            str += ` | 信息：${i.message}`
        }
        return [{
            tag:"text",
            text:str
        }]
    })

    axios.post(url, {
        "msg_type": "post",
        "content": {
            "post": {
                "zh_cn": {
                    "title": noticeTitle,
                    "content": textArr
                }
            }
        }
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{}).catch(err=>{})
}

function init(env:any,title:string){
    url  =  env('ALARM_WEBHOOK_URL');
    msgArr = []
    noticeTitle = title
}

let sites:{
    title: string;
    info: siteData;
    cron_rull: string;
}[] = [ {
        title: 'dad_m',
        info:{
            site: 'dad',
            platform: 'm',
            type: 'test',
            range: 'all',
        },
        cron_rull:'0 0 15 * * *'
    }, {
        title: 'dad_pc',
        info: {
            site: 'dad',
            platform: 'pc',
            type: 'test',
            range: 'all',
        },
        cron_rull:'0 10 15 * * *'
    }, {
        title: 'drw_m',
        info: {
            site: 'drw',
            platform: 'm',
            type: 'test',
            range: 'all',
        },
        cron_rull:'0 20 15 * * *'
    }, {
        title: 'drw_pc',
        info : {
            site: 'drw',
            platform: 'pc',
            type: 'test',
            range: 'all',
        },
        cron_rull:'0 30 15 * * *'
    }, {
        title: 'ebd_m',
        info: {
            site: 'ebd',
            platform: 'm',
            type: 'test',
            range: 'all',
        },
        cron_rull:'0 40 15 * * *'
    }, {
        title: 'ebd_pc',
        info : {
            site: 'ebd',
            platform: 'pc',
            type: 'test',
            range: 'all',
        },
        cron_rull:'0 50 15 * * *'
    } ]


export default (env:any)=>{

    let task_cron = {};
    sites.forEach(i=>{
        task_cron[i.title] = {
            task: ({strapi})=>{
                let data: siteData= i.info;
                init(env,`自动化测试:${data.site}-${data.platform}`)

                strapi.log.info(`autotest start:${data.site}-${data.platform}`)
                new Dispatch(Object.assign({}, data, { strapi,env,logCallback }));
            },
            options: {
                rule:i.cron_rull,
                tz:'Asia/Shanghai'
            }
        }
    })

    console.log('return cron tasks.')

    return  Object.assign({},task_cron,{
        productRemoveCheck:{
            task: ({strapi})=>{
                init(env,`下架产品检测`)

                strapi.log.info(`Product Check Start`)
                new Crawler({env,logCallback}).start();
            },
            options: {
                rule:'0 41 20 * * *',
                tz:'Asia/Shanghai'
            }
        }
    });
}