const config = require('../../../config/index');
const axios = require('axios');
const util = require('../util/index');
const moment = require('moment')

class Dingding_robot
{
    constructor(){
        this.token = config.env.dingding_webhook_token;
        this.api=`https://oapi.dingtalk.com/robot/send?access_token=${this.token}`
    }

    send(options) {
        return new Promise((resolve,reject)=>{

            let now = moment().format('YYYY-MM-DD HH:mm:ss');
            options.time = now;
            let message = this._build_message(options);
            axios({
                method:'POST',
                url:this.api,
                data:message,
            }).then((res)=>{
                console.log(`[${now}]报了个警给钉钉。`)
                resolve()
            }).catch((err)=>{
                console.log(err)
                reject(err)
            })
        })
    }

    _build_message(options) {
        let opt = Object.assign({
            title:'保存物流信息服务出错 ',
            type:'',
            ssn:'',
            err:'',
            oid: '',
            time:'',
            at:'18610082672'
        },options);

        if(util.type(opt.at) == 'array'){
            opt.at = opt.at.join(',')
        }
        let message_obj = {
            "msgtype": "markdown",
            "markdown": {
                "title":`保存物流信息服务出错 `,
                "text":
`### ${opt.title} @${opt.at}\n
> type: ${opt.type}\n
> ssn:  ${opt.ssn}\n
> oid:  ${opt.oid}\n
> time:  ${opt.time}\n
##### Error
${opt.err}`,
            },
            "at": {
                "atMobiles": [
                    opt.at,
                ],
                "isAtAll": false
            }
        }

        return message_obj
    }
}

module.exports = Dingding_robot;