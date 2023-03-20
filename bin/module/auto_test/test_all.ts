import puppeteer, {KnownDevices} from 'puppeteer';
import path from 'path';
import mkdirp from 'mkdirp';
import moment from 'moment';
import jquery from 'jquery';

import siteList from './site';

const iPhone = KnownDevices['iPhone 12'];

class Test {
    site: { [key in string]: any } = {};
    platform: string = '';
    url: string = '';
    apiUrl: string = '';
    result: { [key in string]: any } = {};


    constructor(site: 'dad', platform: 'm') {
        this.platform = platform;
        this.site = platform === 'm' ? siteList[site].m : siteList[site].pc;
        this.url = this.site.domain;
        this.apiUrl = this.site.apiUrl
    }


    async start() {
        const month = moment().format("YYYY-MM");
        const day = moment().format("DD");
        const now = new Date().getTime();
        const nowTime = moment().format("HHmmss");
        let browser;

        try {
            browser = await puppeteer.launch({headless: false})
            this.result.info = {
                "测试时间": `${moment().format('YYYY-MM-DD HH:mm:ss')}`
            }

            const page = await browser.newPage();
            await page.emulate(iPhone);
            await page.setDefaultTimeout(60000);
            switch(this.platform) {
                case 'm':
                    await this.queueM(page);
                    break;
                case 'pc':
                    break;
                default:
                    break
            }

            // await browser.close();
            this.result.info['本次用时'] = Math.floor((new Date().getTime() - now) / 1000) +'秒'
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

    async queueM(page) {
        try {
            // index.
            await page.goto(this.url);
            await this.checkIndex(page);

            // category
            await page.waitForSelector('.main-category a.item');
            await Promise.all([
                page.waitForNavigation(),
                page.click('.main-category a.item'),
            ]);
            await this.checkCategory(page);

            // product
            await page.waitForSelector('.prod-list .prod-item:nth-of-type(10) a');
            await Promise.all([
                page.waitForNavigation(),
                page.click('.prod-list .prod-item:nth-of-type(10) a'),
            ]);
            await this.checkProduct(page);

            // cart
            console.log('cart test.')
            new Promise(_=>setTimeout(_,3000)); // delay
            await page.waitForSelector('#addCartModal a.btn-checkout');
            await Promise.all([
                page.waitForNavigation(),
                page.click('#addCartModal .btn-checkout'),
            ]);
            await this.checkCart(page);

            // checkout
            await new Promise(_=>setTimeout(_,3000)); // delay
            await page.waitForSelector('.btn.proceed-btn');
            await Promise.all([
                page.waitForNavigation(),
                page.click('.btn.proceed-btn'),
            ]);
            await this.checkCheckout(page);

        } catch (err) {
            this.result.error = err;
            return
        }

    }

    async checkIndex(page) {
        let indexResult: { [key in string]: any } = {};
        try {
            //检查分类列表1
            let $category1 = await page.$('.main-category');
            if ($category1) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.main-category .item');
                    count = targetChild.length;
                    return count;
                });
                indexResult['主分类导航数量'] = count
            }else {
                indexResult['主分类导航数量'] = '获取异常'
            }

            // 检查分类列表2
            let $category2 = await page.$('.recommend-category')
            if ($category2) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.r-item');
                    return targetChild.length;
                })
                indexResult['图片目录导航数量'] = count
            }else {
                indexResult['图片目录导航数量'] = '获取异常'
            }

            // 检查slider
            let sliderApi = `${this.apiUrl}/activity/sliders`
            const sliderResponse = await page.waitForResponse(
                response =>
                    response.url() == sliderApi && response.status() === 200,
                {timeout: 10000}
            );
            let $slider = await page.$('.top-slide ul')
            if ($slider) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.top-slide ul li');
                    return targetChild.length;
                })
                indexResult['首页slider数量'] = count
            }else {
                indexResult['首页slider数量'] = '获取异常'
            }

            // 检查banner
            let $banner = await page.$('.top-multi-banner .swiper-slide')
            if (!$banner) {
                let bannerApi = `${this.apiUrl}/activity/banners`;
                console.log(bannerApi);
                const bannerResponse = await page.waitForResponse(
                    response =>
                        response.url() == bannerApi && response.status() === 200,
                    {timeout: 15000}
                );
            }
            if($banner) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.top-multi-banner .swiper-slide');
                    return targetChild.length;
                })
                indexResult['顶部滚动banner数量'] = count
            }else {
                indexResult['顶部滚动banner数量'] = '获取异常'
            }
        } catch (err) {
            console.log(err);
        }

        this.result.index = indexResult;
    }

    async checkCategory(page) {
        let categoryResult: { [key in string]: any } = {}
        try {
            // 检查product
            let productApi = `/product/batch/info`
            await page.waitForResponse(
                response =>
                    !!response.url().match(productApi) && response.status() === 200,
                {timeout: 10000}
            );
            let $products = await page.$('.prod-list .prod-item')
            if ($products) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.prod-list .prod-item');
                    return targetChild.length;
                })
                categoryResult['目录页数量'] = count
            }else {
                categoryResult['目录页数量'] = '获取异常'
            }

        } catch (err) {
        }

        this.result.category = categoryResult;
        return
    }

    async checkProduct(page) {
        //todo: 需要分别测试各种类型的产品。
        let productResult: { [key in string]: any } = {}
        try {
            // console.log(await page.title());
            // console.log(page.url())

            // 检查product
            let productApiRE = /api\/product\/info\/\d+/ig;
            await page.waitForResponse(response =>
                    productApiRE.test(response.url()) && response.status() === 200,
                {timeout: 10000}
            );
            let $selectBox = await page.$('.select-box')
            if ($selectBox) {
                let count = await page.evaluate(() => {
                    let selectBoxes = document.querySelectorAll('.select-box');
                    return {
                        selectBoxes: selectBoxes.length
                    }
                })
                productResult['规格选择项数量'] = count.selectBoxes
            }else {
                productResult['产品页'] = '获取异常'
            }

            // 加购
            await page.click('.select-color .color-list li:nth-child(2) a');
            productResult['选择颜色'] = '通过'

            await page.click('.select-size ul li.item:nth-child(2)');
            productResult['选择尺码'] = '通过'

            await page.click('.add-cart-box .btn-add-cart');
            let addToCartApiRE = /\/api\/product\/cart/ig;
            await page.waitForResponse(response =>
                addToCartApiRE.test(response.url()) && response.status() === 200,
                {timeout: 10000}
            );
            productResult['加入购物车'] = '通过'


        } catch (err) {
            productResult['错误'] = err
        }

        this.result.product = productResult;

    }

    async checkCart(page) {
        let cartResult: { [key in string]: any } = {}
        try {
            // 检查购物车
            let $cartForm = await page.$('.cart-list')
            if ($cartForm) {
                let count = await page.evaluate(() => {
                    let groupList = document.querySelectorAll('.cart-group-list');
                    let item = document.querySelectorAll('.cart-item');
                    let total = document.querySelector('.total-price span:nth-child(2)').textContent
                    return {
                        "购物车分组":groupList.length,
                        "产品": item.length,
                        "金额":total,
                    }
                })
                Object.assign(cartResult,count);
            }else {
                cartResult['购物车页'] = '获取异常'
            }
        } catch (err) {
            cartResult['错误'] = err
        }

        this.result.cart = cartResult;
    }

    async checkCheckout(page) {
        let checkoutResult: { [key in string]: any } = {}
        try {
            // 填写地址
            await page.waitForSelector('form.input-address');
            await page.type('input#first-name','Bot',{delay:100});
            await page.type('input#last-name','Test',{delay:100});
            await page.type('input#address','123 Compute Rd.',{delay:100});
            await page.type('input#city','NetOnline',{delay:100});
            await page.select('select#country-id','1')
            await new Promise(_=>{setTimeout(_,3000)});
            await page.select('select#province-id','9');
            await page.type('input#postal','318097',{delay:100});
            await page.type('input#phone','9153643212',{delay:100});
            await page.type('input#email','bottest@163.com',{delay:100});
            checkoutResult['地址填写'] = '通过'

            await page.click('.js-address-save')
            await page.waitForSelector('.js-shipping-list li:first-child input',{visible:true})
            checkoutResult['地址保存'] = '通过'

            await new Promise(_=>{setTimeout(_,3000)})
            await page.click('.js-shipping-list li:first-child input')
            let shippingApiRE = /checkout\/ajaxGetShippingFee/ig;
            await page.waitForResponse(res =>
                shippingApiRE.test(res.url()) && res.status() === 200,
                {timeout: 10000}
            )
            checkoutResult['运输方式保存'] = '通过'

            await new Promise(_=>{setTimeout(_,3000)})
            await page.click('.js-rush-list li:first-child input')
            let rushApiRE = /checkout\/ajaxGetRushFee/ig;
            await page.waitForResponse(res =>
                rushApiRE.test(res.url()) && res.status() === 200,
                {timeout: 10000}
            )
            checkoutResult['加急选择'] = '通过'

            await page.click('.js-shipping-continue');

            // 提交订单


        } catch (err) {
            checkoutResult['错误'] = err
        }

        this.result.checkout = checkoutResult;

    }
}


export default Test