import Base from './base';
import { fakePage } from './data/helperData.json';
import sns from './data/sn.json';
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
                if(req.url().match('api/product/batch/info') && req.method().toUpperCase() === 'POST'){
                    let pids = this.curSns.map(i => i[1]*1)

                    let postData = JSON.stringify({pids})
                    await this.sleep(6)
                    req.continue({postData});
                }else {
                    req.continue();
                }
            })

            for(let i=0,num=0; i<this.sns.length;) {
                this.curSns = this.sns[i]
                await page.goto(this.getFakeUrl());
                let result = await this.checkProd(page).catch(()=>false);

                await this.sleep(1*60,3*60)
                
                if(result) { i++ }
                else if( num >= 5 ){
                    num=0;
                    i++
                }else {
                    num += 1
                }
            }

            if(this.rmProds.length > 1) {
                this.rmProds.map(i=>{
                    let url = this.url+`/simple-a-line-neckline-jersey-p${i[0]}.html`
                    this.log('success',url,'下架商品url');
                })
            }
        } catch (err) {
            this.log('error', 'Status: faild in queue.')
            console.log(err);
        }
    }

    public async checkProd(page) {
        try {

            console.log('check product status')
            //检查
            let res = await page.waitForResponse(res => {
                return /\/product\/batch\/info/i.test(res.url()) && res.status() === 200
            }, { timeout: 30000 }).catch();
            let body = JSON.parse(await res.text());
            let resProds = body.data?.products

            if(body.code === 200 && resProds) {
                if(resProds.length > 0) {
                    console.log('请求成功')
                    // console.log(this.curSns[1])
                    let prods = this.curSns.filter(i=>{
                        return !resProds.some(j=>j.pid == i[1]*1)
                    })

                    prods.forEach(i=>this.rmProds.push(i))
                    this.log('success',JSON.stringify(prods),'下架商品sn');
                }
                return true;
            }else {
                // console.log('请求产品更新接口失败')
                return false
            }
        } catch (err) {
            this.log('error', `获取异常`, 'check product.')
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
