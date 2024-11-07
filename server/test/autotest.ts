
import { Dispatch } from '../src/module/autotest';
import { Crawler } from '../src/module/prodRemoveCheck';
import { DispatchOption, ResultDataType } from '../src/module//@type/autotest'
import { ResultDataType as ProdCheckResultData } from '../src/module//@type/prodRemoveCheck'
import axios from 'axios';
import dotenv from 'dotenv';

interface siteData {
    site: DispatchOption['site'];
    platform: DispatchOption['platform'];
    type: DispatchOption['type'];
    range: DispatchOption['range'];
}

const sysEnv = dotenv.config({path:'../.env'}).parsed;

let url = ''
let noticeTitle = ''
let msgArr: ResultDataType[] | ProdCheckResultData[] = []
let testLogCallback = (data: Required<ResultDataType>): void => {

    console.log(data);
    switch (data.type) {
        case 'ctrl':
            if (data.message === 'close') {
                let textArr = (msgArr as ResultDataType[]).filter((i: ResultDataType) => i.type !== 'success').map((i: ResultDataType) => {
                    let str = `状态:${i.type} | 位置：${i.position}`;
                    if (i.message) {
                        str += ` | 信息：${i.message}`
                    }
                    return [{
                        tag: "text",
                        text: str
                    }]
                })
                notice(textArr)
            }
            break;
        default:
            msgArr.push(data)
    }

};


function notice(textArr) {

    console.log(textArr);

    return
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
    }).then(res => { }).catch(err => { })
}

function init() {

}

let sites = {
    dad_m: {
        site: 'dad',
        platform: 'm',
        type: 'test',
        range: 'all',
    },
    dad_pc: {
        site: 'dad',
        platform: 'pc',
        type: 'test',
        range: 'all',
    },
    drw_m: {
        site: 'drw',
        platform: 'm',
        type: 'test',
        range: 'all',
    },
    drw_pc: {
        site: 'drw',
        platform: 'pc',
        type: 'test',
        range: 'all',
    },
    ebd_m: {
        site: 'ebd',
        platform: 'm',
        type: 'test',
        range: 'all',
    },
    ebd_pc: {
        site: 'ebd',
        platform: 'pc',
        type: 'test',
        range: 'all',
    },
}

let config = {
    "PUPPETEER_HEADLESS": sysEnv.PUPPETEER_HEADLESS === 'true',
    "CHROMIUM_PATH":sysEnv.CHROMIUM_PATH
}

function env(k: string, v: any) {
    return typeof config[k] !== 'undefined'?config[k]:v
}

env.bool = (k: string, v: any)=>Boolean(env(k,v))

function test(data: any) {
    let strapi = {}
    console.log(`autotest start:${data.site}-${data.platform}`)
    new Dispatch(Object.assign({}, data, { strapi, env, logCallback: testLogCallback }));
}

test(sites['dad_pc'])