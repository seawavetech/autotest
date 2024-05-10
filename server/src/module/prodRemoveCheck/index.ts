import Base from './base';
import { fakePage } from './helperData.json';
import sns from './sn.json';
import * as fs from 'fs-extra';

import { DispatchOption } from '../@type/prodRemoveCheck';


export class Crawler extends Base {

    public sns = sns;
    public curSns = [];
    public rmProds = []
    
    constructor(opts: DispatchOption) {
        super(opts);
        this.url = 'https://m.junebridals.com'
    }

    public async exec(page) {
        try {
            await page.setRequestInterception(true);

            /* 请求中拦截并调包pids */
            page.on('request', async req=>{
                if(req.url().match('api/products') && req.method().toUpperCase() === 'POST'){
                    let pids = this.curSns.map(i => i[1]*1)

                    let postData = JSON.stringify({pids:pids,scene:"category"})
                    await this.sleep(6)
                    req.continue({postData});
                }else {
                    req.continue();
                }
            })

            for(let i=0,num=0,len=this.sns.length; i<len;) {
                console.log(`正在检查【第${i+1}批/共${len}批】`)
                this.curSns = this.sns[i]
                await page.goto(this.getFakeUrl());
                let result = await this.checkProd(page,i+1).catch(()=>false);
                
                /* 出错尝试 5 次 */
                if(result) { 
                    i++;
                    console.log(`【第${i+1}批】检查完毕，稍后检查下一批`)
                }else if( num >= 5 ){
                    num=0;
                    i++;
                    console.log(`【第${i+1}批】检查尝试5次失败，稍后检查下一批`)
                    this.log('error', `第${i+1}/${len}批-获取异常`, 'check product.')
                }else {
                    num += 1;
                    console.log(`【第${i+1}批】第${num}次检查失败，稍后重试`)
                }

                await this.sleep(61,120)
            }

        } catch (err) {
            this.log('error', 'Status: faild in queue.')
            console.log(err);
        }

        
        if(this.rmProds.length > 1) {
            this.log('success',JSON.stringify(this.rmProds.map(i=>i[0])),'下架商品sn');

            // this.rmProds.map(i=>{
            //     let url = this.url+`/simple-a-line-neckline-jersey-p${i[0]}.html`
            // })
        }
    }

    public async checkProd(page,groupSn) {
        try {

            console.log('check product status')
            //检查
            let res = await page.waitForResponse(res => {
                return /api\/products/i.test(res.url()) && res.status() === 200
            }, { timeout: 30000 }).catch();
            let body = JSON.parse(await res.text());
            let resProds = body.data?.products
            // console.log(body.data)

            if(body.code === 200 && resProds) {
                if(resProds.length > 0) {
                    let prods = this.curSns.filter(i=>{
                        return !resProds.some(j=>j.pid == i[1]*1)
                    })

                    if(prods.length > 0) {
                        prods.forEach(i=>this.rmProds.push(i))
                        // this.log('success',JSON.stringify(prods.map(i=>i[0])),`第${groupSn}批中下架商品`);
                        console.log(`第${groupSn}批中下架商品`,JSON.stringify(prods.map(i=>i[0])));
                    }else {
                        console.log(`第${groupSn}批中没有下架商品`)
                    }

                }else {
                    console.log(`第${groupSn}批-接口返回的产品数量为0`)
                }

                return true;
            }else {
                console.log(`第${groupSn}批-请求产品更新接口失败`)
                return false
            }
        } catch (err) {
            console.log(`第${groupSn}批-获取异常`);
            console.log(err);
            return false
        }
    }

    public getFakeUrl() {
        let len = fakePage.length;
        let index = Math.floor(Math.random()*len);
        return this.url + fakePage[index]

    }

}
