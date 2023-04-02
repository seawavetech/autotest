import TestBase from './base/test_base';

import { TestClassOptions } from './base/type';

export default class Test extends TestBase {
    constructor(opts: TestClassOptions) {
        super(opts);
    }

    public async queue(page) {
        try {
            // index.
            await page.goto(this.url);
            await this.checkIndex(page);

            // category
            await this.sleep(3000);
            await page.waitForSelector('.main-category a.item');
            await Promise.all([
                page.waitForNavigation(),
                page.click('.main-category a.item'),
            ]);
            await this.checkCategory(page);

            // product
            await this.sleep(3000);
            await page.waitForSelector('.prod-list .prod-item:nth-of-type(10) a');
            await Promise.all([
                page.waitForNavigation(),
                page.click('.prod-list .prod-item:nth-of-type(10) a'),
            ]);
            await this.checkProduct(page);

            // cart
            await this.sleep(3000);
            await page.waitForSelector('#addCartModal a.btn-checkout');
            await Promise.all([
                page.waitForNavigation(),
                page.click('#addCartModal .btn-checkout'),
            ]);
            await this.checkCart(page);

            // checkout
            await this.sleep(3000);
            await page.waitForSelector('.btn.proceed-btn');
            await Promise.all([
                page.waitForNavigation(),
                page.click('.btn.proceed-btn'),
            ]);
            await this.checkCheckout(page);

        } catch (err) {
            this.log('error', 'Status: faild in queue.')
            return
        }
    }

    public async checkIndex(page) {
        try {
            //检查分类列表1
            let $category1 = await page.$('.main-category');
            if ($category1) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.main-category .item');
                    count = targetChild.length;
                    return count;
                });
                this.log('success', `主分类导航数量：${count}个`, 'index')
            } else {
                this.log('error', `主分类导航数量：获取异常`, 'index')
            }

            // 检查分类列表2
            let $category2 = await page.$('.recommend-category')
            if ($category2) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.r-item');
                    return targetChild.length;
                })
                this.log('success', `图片目录导航数量：${count}个`, 'index')
            } else {
                this.log('error', `图片目录导航数量：获取异常`, 'index')
            }

            // 检查slider
            let sliderApi = `${this.apiUrl}/activity/sliders`
            const sliderResponse = await page.waitForResponse(
                response =>
                    response.url() == sliderApi && response.status() === 200,
                { timeout: 10000 }
            );
            let $slider = await page.$('.top-slide ul')
            if ($slider) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.top-slide ul li');
                    return targetChild.length;
                })
                this.log('success', `首页slider数量：${count}个`, 'index')
            } else {
                this.log('error', `首页slider数量：获取异常`, 'index')
            }

            // 检查banner
            let $banner = await page.$('.top-multi-banner .swiper-slide')
            if (!$banner) {
                let bannerApi = `${this.apiUrl}/activity/banners`;
                console.log(bannerApi);
                const bannerResponse = await page.waitForResponse(response =>
                    response.url() == bannerApi && response.status() === 200,
                    { timeout: 15000 }
                );
            }
            if ($banner) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.top-multi-banner .swiper-slide');
                    return targetChild.length;
                })
                this.log('success', `顶部滚动banner数量：${count}个`, 'index')
            } else {
                this.log('error', `顶部滚动banner数量：获取异常`, 'index')
            }
        } catch (err) {
            this.log('error', `获取异常`, 'index')

            console.log(err);
        }
    }

    public async checkCategory(page) {
        try {
            // 检查category
            let productApi = `/product/batch/info`
            await page.waitForResponse(response =>
                !!response.url().match(productApi) && response.status() === 200,
                { timeout: 10000 }
            );
            let $products = await page.$('.prod-list .prod-item')
            if ($products) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.prod-list .prod-item');
                    return targetChild.length;
                })
                this.log('success', `目录页产品数量：${count}个`, 'category')
            } else {
                this.log('error', `目录页产品数量：获取异常`, 'category')
            }

        } catch (err) {
            this.log('error', `获取异常`, 'category')
        }
        return
    }

    public async checkProduct(page) {
        //todo: 需要分别测试各种类型的产品。
        try {
            // 检查product
            let productApiRE = /api\/product\/info\/\d+/ig;
            await page.waitForResponse(response =>
                productApiRE.test(response.url()) && response.status() === 200,
                { timeout: 10000 }
            );
            let $selectBox = await page.$('.select-box')
            if ($selectBox) {
                let count = await page.evaluate(() => {
                    let selectBoxes = document.querySelectorAll('.select-box');
                    return {
                        selectBoxes: selectBoxes.length
                    }
                })
                this.log('success', `规格选择项数量：${count.selectBoxes}个`, 'product')
            } else {
                this.log('error', `规格选择项数量：获取异常`, 'product')
            }

            // 加购
            await page.click('.select-color .color-list li:nth-child(2) a');
            this.log('success', `加购-->选择颜色：通过`, 'product')

            await page.click('.select-size ul li.item:nth-child(2)');
            this.log('success', `加购-->选择尺码：通过`, 'product')

            await page.click('.add-cart-box .btn-add-cart');
            let addToCartApiRE = /\/api\/product\/cart/ig;
            await page.waitForResponse(response =>
                addToCartApiRE.test(response.url()) && response.status() === 200,
                { timeout: 10000 }
            );
            this.log('success', `加购-->加入购物车：通过`, 'product')
        } catch (err) {
            this.log('error', `页面异常`, 'product')
        }
    }

    public async checkCart(page) {
        try {
            // 检查购物车
            let $cartForm = await page.$('.cart-list')
            if ($cartForm) {
                let count = await page.evaluate(() => {
                    let groupList = document.querySelectorAll('.cart-group-list');
                    let item = document.querySelectorAll('.cart-item');
                    let total = document.querySelector('.total-price span:nth-child(2)').textContent
                    return {
                        "购物车分组": groupList.length,
                        "产品": item.length,
                        "金额": total,
                    }
                })
                this.log('success', `购物车分组：${count['购物车分组']}个`, 'cart')
                this.log('success', `产品共：${count['产品']}件`, 'cart')
                this.log('success', `金额共计：${count['金额']}`, 'cart')
            } else {
                this.log('error', `未获取到数据`, 'cart')
            }
        } catch (err) {
            this.log('error', `页面异常`, 'cart')
        }

    }

    public async checkCheckout(page) {
        try {
            // 填写地址
            await page.waitForSelector('form.input-address');
            await page.type('input#first-name', 'Bot', { delay: 100 });
            await page.type('input#last-name', 'Test', { delay: 100 });
            await page.type('input#address', '123 Compute Rd.', { delay: 100 });
            await page.type('input#city', 'NetOnline', { delay: 100 });
            await page.select('select#country-id', '1')
            await this.sleep(3000);
            await page.select('select#province-id', '9');
            await page.type('input#postal', '318097', { delay: 100 });
            await page.type('input#phone', '9153643212', { delay: 100 });
            await page.type('input#email', 'bottest@163.com', { delay: 100 });

            this.log('success', `地址填写：通过`, 'checkout')

            await page.click('.js-address-save')
            await page.waitForSelector('.js-shipping-list li:first-child input', { visible: true })
            this.log('success', `地址保存：通过`, 'checkout')

            await this.sleep(3000);
            await page.click('.js-shipping-list li:first-child input')
            let shippingApiRE = /checkout\/ajaxGetShippingFee/ig;
            await page.waitForResponse(res =>
                shippingApiRE.test(res.url()) && res.status() === 200,
                { timeout: 10000 }
            )
            this.log('success', `运输方式保存：通过`, 'checkout')

            await this.sleep(3000);
            await page.click('.js-rush-list li:first-child input')
            let rushApiRE = /checkout\/ajaxGetRushFee/ig;
            await page.waitForResponse(res =>
                rushApiRE.test(res.url()) && res.status() === 200,
                { timeout: 10000 }
            )
            this.log('success', `加急选择：通过`, 'checkout')

            await page.click('.js-shipping-continue');

            // 提交订单


        } catch (err) {
            this.log('error', `页面异常`, 'cart')
        }
    }
}
