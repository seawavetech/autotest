const puppeteer = require('puppeteer');
const path = require('path');
const mkdirp = require('mkdirp');
const moment = require('moment');
const jquery = require('jquery');

class Test {
    siteName: string = '';
    result:{[key in string]:any} = {};

    constructor(siteName) {
        this.siteName = siteName || 'dad-m';
    }

    async all() {
        const month = moment().format("YYYY-MM");
        const day = moment().format("DD");
        const now = new Date().getTime().toString();
        const nowTime = moment().format("HHmmss");
        let browser;

        try {
            browser = await puppeteer.launch({
                //devtools:true,
                defaultViewport: {
                    width: 414,
                    height: 900
                },
                args: ['--no-sandbox']
            })
            //console.log(this.config)

            const page = await browser.newPage();
            await page.viewport({
                width: 414,
                height: 900
            })
            // page.setDefaultNavigationTimeout(60000)
            await page.goto('https://m.dressafford.com');
            // await page.emulateMedia('screen');
            await this.checkIndex(page);

            // await this.config.initPageFn.call(this,page);

            // await this._savePng.call(this,page);
            //await this._savePdf.call(this,page);

            await browser.close();
            // let resObj = {
            //     type:this.type,
            //     ssn:this.ssn,
            //     oid:this.oid,
            //     image:this.result.imgPath,
            //     //pdf:this.result.pdfPath
            // }

            this.result.status = 'success'
            return this.result;
        } catch (err) {
            console.log(`++++++++++++++++++++++`);
            console.log(err);
            if (!!browser.close) {
                await browser.close()
            }
            return err
        }
    }

    async checkIndex(page){
        try {
            //检查是否有运送商列表可选
            let $mainCategory = await page.$('.main-category');
            if ($mainCategory) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.main-category .item');
                    count =  targetChild.length;
                    return count
                });

                this.result.index = count;
            }
        }catch(err){

        }
    }

    // async _initPage_dhl (page) {
    //     return new Promise(async (resolve,reject)=>{
    //         const dhl_cookies = [
    //             {
    //                 "domain": ".dhl.com",
    //                 "expires": moment().month(+5).unix(),
    //                 "httpOnly": true,
    //                 "name": "ak_bmsc",
    //                 "path": "/",
    //                 "secure": false,
    //                 "value": "3359A10983AD1EED4FD3405DE48D8C1417240FBF08640000ED84BE5C89523E49~pl3zN9yOx5SFMe0mxAXWlu7MipK4Z0UPBugwdfRCIp/wTNMH/j0RXIKMkEz12+EOEij9GuHOUJ7G3rgfXDcb3mfl0HQRs4EW1RPj4Ua6rfY5Ii6FosemY66i9sBV8meeBw2t1UTr1W1H2MS+6Zgahsxh+7DaCScKmr7pkE8/TG2xXPuAkpRj/mbosmRAT986jeWTC0ijHNfi2Pt5YnUHM4rD+TRUvMsTnzbNLKXpB81Gs=",
    //             },
    //             {
    //                 "domain": ".dhl.com",
    //                 "expires": moment().month(+5).unix(),
    //                 "httpOnly": true,
    //                 "name": "bm_sv",
    //                 "path": "/",
    //                 "secure": false,
    //                 "value": "297B2E1C9E8DAD9F4F82964D1324B3E9~XGyQIhl9faz8GgKqH7d2ATPotFQIWavyg3OSqJ8XBWNqIPM+F4wGA+Z4utX027k6WxqXbR+jIC6dPxrEWg7NuXaMtk3UctYIZ2+c+7lIEnZDQHX05e/GG1+BZmR/MRtxwBjiaFFcXIvD40CF4wZ5Ig==",
    //             },
    //             {
    //                 "domain": "www.dhl.com",
    //                 "expires": moment().month(+5).unix(),
    //                 "httpOnly": false,
    //                 "name": "AWBS",
    //                 "path": "/en/express",
    //                 "secure": false,
    //                 "value": "84483434980256",
    //             },
    //             {
    //                 "domain": "www.dhl.com",
    //                 "expires": moment().month(+5).unix(),
    //                 "httpOnly": false,
    //                 "name": "BRAND",
    //                 "path": "/en/express",
    //                 "secure": false,
    //                 "value": "Express%20Services",
    //             },
    //             {
    //                 "domain": "www.dhl.com",
    //                 "expires": moment().month(+5).unix(),
    //                 "httpOnly": false,
    //                 "name": "dhl_cookie_consent",
    //                 "path": "/",
    //                 "secure": false,
    //                 "value": "accepted",
    //             }
    //         ];
    //         try{
    //             await page.setCookie(...dhl_cookies);
    //
    //             //等待物流信息列表渲染结束
    //             await page.waitFor('.result-checkpoints');
    //             resolve()
    //         }catch(err){
    //             reject(err)
    //         }
    //     })
    // }
    //
    // async _initPage_17track (page) {
    //     return new Promise(async (resolve,reject)=>{
    //         try {
    //             //等待顶部菜单加载结束。
    //             await page.waitFor('#jc-package-status-menu');
    //
    //             // 设置取消全屏提示的标志 在页面的localstorage中。
    //             await page.evaluate(() => {
    //                 localStorage.setItem('tourDone', 'true');
    //             });
    //
    //             //检查是否有运送商列表可选
    //             let $carrier_list = await page.$('.multi-carriers');
    //             if($carrier_list) {
    //                 //为目标运送商增加一个可点击的id.
    //                 const target_id = 'carrier_item_click_target';
    //                 await page.evaluate((carrierID,target_id)=>{
    //                     let targetChild = document.querySelector('[data-key="'+carrierID+'"] p:last-child');
    //                     let target = targetChild.parentNode;
    //                     target.id = target_id;
    //                 },this.config.type_map[this.type],target_id);
    //
    //                 await  page.click(`#${target_id}`)
    //             }
    //
    //             // 等待物流信息列表渲染完成
    //             await page.waitForSelector('.yqcr-details',{visible:true});
    //             resolve()
    //         }catch(err){
    //             reject(err)
    //         }
    //     })
    // }
    //
    // _savePng(page){
    //     return new Promise((resolve,reject)=>{
    //         page.screenshot({
    //             path:`${this.filePath}.png`,
    //             fullPage:true,
    //         }).then(()=>{
    //             this.result.imgPath = `${this.URI}.png`
    //             resolve()
    //         }).catch((err)=>{
    //             reject(err)
    //         });
    //     })
    // }
    //
    // _savePdf(page){
    //     return new Promise((resolve,reject)=>{
    //         page.pdf({
    //             path:`${this.filePath}.pdf`,
    //             printBackground:true,
    //             margin:{
    //                 top:'30px',
    //                 bottom:'30px',
    //                 left:'20px',
    //                 right:'20px'
    //             }
    //         }).then(()=>{
    //             this.result.pdfPath = `${this.URI}.pdf`;
    //             resolve()
    //         }).catch((err)=>{
    //             reject(err)
    //         });
    //     })
    // }
    //
    // _setConfig () {
    //     switch(this.type) {
    //         case 'dhl':
    //             this.config = config.dhl(this.ssn);
    //             this.config.initPageFn = this._initPage_dhl;
    //             break;
    //         case 'tnt':
    //         case 'ups':
    //         case 'fedex':
    //             this.config = config._17track(this.ssn);
    //             this.config.initPageFn = this._initPage_17track;
    //             break;
    //         default:
    //             return false;
    //             break;
    //     }
    // }

}


export default Test