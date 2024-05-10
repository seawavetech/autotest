import TestBase from './base/test_base';

import { TestClassOptions } from '../@type/autotest';

export default class Test extends TestBase {
    constructor(opts: TestClassOptions) {
        super(opts);
    }

    public async queue(page) {
        try {
            // index.
            console.log(this.url)
            await page.goto(this.url);
            await this.checkIndex(page);

            // category
            await page.waitForSelector('.main-category a.item');
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.click('.main-category a.item'),
            ]);
            await this.checkCategory(page);

            // product
            let targetProdSelector = '.prod-list .prod-item:nth-of-type(6) a'
            await page.waitForSelector(targetProdSelector);
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.click(targetProdSelector)
            ]);
            await this.checkProduct(page);

            // cart
            await this.sleep(3);
            await page.waitForSelector('#addCartModal a.btn-checkout',{ visible: true });
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.click('#addCartModal .btn-checkout'),
            ]);
            await this.checkCart(page);

            // checkout
            await page.waitForSelector('.btn.proceed-btn');
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.click('.btn.proceed-btn'),
            ]);
            await this.sleep(3);
            await this.checkCheckout(page);

        } catch (err) {
            this.log('error', 'Status: faild in queue.')
            return
        }
    }

    public async checkIndex(page) {
        try {
            //检查分类列表1
            let $category1 = await page.waitForSelector('.main-category');
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
            let $category2 = await page.waitForSelector('.recommend-category')
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
            let $slider = await page.waitForSelector('.top-slide ul li')

            if (!$slider) {
                const sliderResponse = await page.waitForResponse( res => 
                   /\/activity\/sliders/i.test(res.url()) && res.status() === 200,
                    { timeout: 10000 }
                ).catch();
            }

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
            let $banner = await page.waitForSelector('.top-multi-banner .swiper-slide')
            if (!$banner) {
                const bannerResponse = await page.waitForResponse(res => 
                    /\/activity\/banners/i.test(res.url()) && res.status() === 200,
                    { timeout: 10000 }
                ).catch();
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
            await page.waitForResponse(res => {
                return /\/product\/batch\/info/i.test(res.url()) && res.status() === 200
            }, { timeout: 10000 });
            let $products = await page.waitForSelector('.prod-list .prod-item')
            if ($products) {
                let data = await page.evaluate(() => {
                    let title = document.querySelector('.title-box h1');
                    let targetChild = document.querySelectorAll('.prod-list .prod-item');
                    let firstChild = targetChild[0];
                    return {
                        title: title.textContent.trim(),
                        itemCount: targetChild.length,
                        firstTitle: firstChild.querySelector('.prod-name').textContent.trim(),
                        firstPrice: firstChild.querySelector('.prod-price').textContent.replace(/[\s\n]/ig, '')
                    }
                })
                this.log('success', `目录title：${data.title}`, 'category')
                this.log('success', `目录页产品数量：${data.itemCount}个`, 'category')
                this.log('success', `目录首个产品标题：${data.firstTitle}`, 'category')
                // this.log('success', `目录首个产品价格：${data.firstPrice}`, 'category')
            } else {
                this.log('error', `目录页产品数量：获取异常`, 'category')
            }

        } catch (err) {
            this.log('error', `获取异常`, 'category')
        }
    }

    public async checkProduct(page) {
        //todo: 需要分别测试各种类型的产品。
        try {
            // 检查product
            await page.waitForResponse(res => {
                return /api\/product\/info\/\d+/i.test(res.url()) && res.status() === 200
            }, { timeout: 10000 }).catch();
            await this.sleep(3);
            let $selectBox = await page.waitForSelector('.select-box');
            let data:any;
            if ($selectBox) {
                // console.log('selectbox  check inner...')

                data = await page.evaluate(() => {
                    /* todo 
                    是否是库存商品
                    分别处理两种商品的加购过程
                    */
                    let titleEl = document.querySelector('.prod-title span:nth-child(2)');
                    let colorList = document.querySelectorAll('.select-color ul.color-list > li a');
                    let sizeList = document.querySelectorAll('.select-size .size-list-wrap ul > li:not(.empty-li)');
                    let selectBoxes = document.querySelectorAll('.select-box');
                    let multiSelectTab = document.querySelectorAll('.multi-select-tab-box');
                    let isInstock = multiSelectTab.length > 0
                    return {
                        title: titleEl.textContent.trim(),
                        selectBoxes: selectBoxes.length,
                        colorCount: colorList.length,
                        sizeCount: sizeList.length,
                        isInstock: isInstock,
                    }
                })
                this.log('success', `产品标题：${data.title}`, 'product')
                this.log('success', `是否库存商品？${data.isInstock ? 'Yes': 'No'}`, 'product')
                this.log('success', `规格选择项数量：${data.selectBoxes}个`, 'product')
                this.log('success', `可选颜色数量：${data.colorCount}个`, 'product')
                this.log('success', `可选尺码数量：${data.sizeCount}个`, 'product')
            } else {
                this.log('error', `规格选择项数量：获取异常`, 'product')
            }

            // 加购
            if (!data.isInstock) {
                await page.click('.select-color .color-list li:nth-child(2) a');
                this.log('success', `加购-->选择颜色：通过`, 'product')

                await page.click('.select-size ul li.item:nth-child(2)');
                this.log('success', `加购-->选择尺码：通过`, 'product')
            }
            
            await page.click('.add-cart-box .btn-add-cart');
            await page.waitForResponse(res =>
                /\/api\/product\/cart/i.test(res.url()) && res.status() === 200,
                { timeout: 10000 })
            this.log('success', `加购-->加入购物车：通过`, 'product')
        } catch (err) {
            this.log('error', `页面异常`, 'product')
        }
    }

    public async checkCart(page) {
        try {
            // 检查购物车
            let $cartForm = await page.waitForSelector('.cart-list')
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
                this.log('success', `购物车分组：${count['购物车分组']}组`, 'cart')
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
            await this.sleep(3);
            await page.select('select#province-id', '9');
            await page.type('input#postal', '318097', { delay: 100 });
            await page.type('input#phone', '9153643212', { delay: 100 });
            await page.type('input#email', 'bottest@163.com', { delay: 100 });

            this.log('success', `地址填写：通过`, 'checkout')

            await page.click('.js-address-save')
            await page.waitForSelector('.js-shipping-list li:first-child input', { visible: true })
            this.log('success', `地址保存：通过`, 'checkout')

            await this.sleep(3);
            await page.click('.js-shipping-list li:first-child input')
            await page.waitForResponse(res =>
                /checkout\/ajaxGetShippingFee/i.test(res.url()) && res.status() === 200,
                { timeout: 10000 }
            )
            this.log('success', `运输方式保存：通过`, 'checkout')

            await this.sleep(3);
            await page.click('.js-rush-list li:first-child input')
            await page.waitForResponse(res =>
                /checkout\/ajaxGetRushFee/i.test(res.url()) && res.status() === 200,
                { timeout: 10000 }
            )
            this.log('success', `加急选择：通过`, 'checkout')

            await page.click('.js-shipping-continue');

            // 提交订单


        } catch (err) {
            this.log('error', `页面异常`, 'checkout')
        }
    }
}
