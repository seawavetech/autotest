
import { Dispatch} from '../src/module/autotest';
import { DispatchOption,ResultDataType} from '../src/module/autotest/base/type'
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

function init(env:any,data:siteData){
    url  =  env('ALARM_WEBHOOK_URL');
    msgArr = []
    noticeTitle = `自动化测试:${data.site}-${data.platform}`
}


export default (env:any)=>{

    console.log('return cron tasks.')

    return {
        'dad_m': {
            task: ({strapi})=>{

                let data: siteData= {
                    site: 'dad',
                    platform: 'm',
                    type: 'test',
                    range: 'all'
                }
                init(env,data)

                strapi.log.info(`autotest start:${data.site}-${data.platform}`)
                new Dispatch(Object.assign({}, data, { strapi,env,logCallback }));
            },
            options: {
                rule:'0 0 15 * * *',
                tz:'Asia/Shanghai'
            }
        },
        'dad_pc': {
            task: ({strapi})=>{

                let data: siteData= {
                    site: 'dad',
                    platform: 'pc',
                    type: 'test',
                    range: 'all'
                }
                init(env,data)

                strapi.log.info(`autotest start:${data.site}-${data.platform}`)
                new Dispatch(Object.assign({}, data, { strapi,env,logCallback }));
            },
            options: {
                rule:'10 0 15 * * *',
                tz:'Asia/Shanghai'
            }
        },
        'drw_m': {
            task: ({strapi})=>{

                let data: siteData= {
                    site: 'drw',
                    platform: 'm',
                    type: 'test',
                    range: 'all'
                }
                init(env,data)

                strapi.log.info(`autotest start:${data.site}-${data.platform}`)
                new Dispatch(Object.assign({}, data, { strapi,env,logCallback }));
            },
            options: {
                rule:'20 0 15 * * *',
                tz:'Asia/Shanghai'
            }
        },
        'drw_pc': {
            task: ({strapi})=>{

                let data: siteData= {
                    site: 'drw',
                    platform: 'pc',
                    type: 'test',
                    range: 'all'
                }
                init(env,data)

                strapi.log.info(`autotest start:${data.site}-${data.platform}`)
                new Dispatch(Object.assign({}, data, { strapi,env,logCallback }));
            },
            options: {
                rule:'30 0 15 * * *',
                tz:'Asia/Shanghai'
            }
        },
    }
}