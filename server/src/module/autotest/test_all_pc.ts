import TestBase from './base/test_base';

import { TestClassOptions } from '../@type/autotest';

export default class Test extends TestBase {
    constructor(opts: TestClassOptions) {
        super(opts);
    }

    public async queue(page) {
        try {
            // index.
            await page.goto(this.url,{waitUntil:'domcontentloaded'});
            await this.checkIndex(page);

            // category
            await Promise.all([
                page.waitForNavigation({waitUntil:'domcontentloaded'}),
                page.click('#app .header_inner > nav > div > a:nth-child(2)'),
            ]);
            await this.sleep(3)
            await this.checkCategory(page);

            // product
            let target = '#app .p-list-main .p-list .p-item:nth-child(2) a';
            await page.evaluate(selector=>{
                let el:HTMLElement=document.querySelector(selector);
                el.removeAttribute('target');
            },target)
            await Promise.all([
                page.waitForNavigation({waitUntil:'domcontentloaded'}),
                page.click(target),
            ]).catch((err)=>{
                console.log(err)
            });
            // console.log('after click.')
            await this.sleep(3);
            // console.log('after sleep.')
            await this.checkProduct(page);

            // cart
            // console.log('cart test.')
            
            await page.waitForSelector('.header_inner .s-bag a.btn-checkout');
            await Promise.all([
                page.waitForNavigation({waitUntil:'domcontentloaded'}),
                page.click('.header_inner .s-bag  a.btn-checkout'),
            ]);
            await this.checkCart(page);

            // checkout
            await this.sleep(2);
            await page.waitForSelector('.right-box .btn-checkout');
            await Promise.all([
                page.waitForNavigation({waitUntil:'domcontentloaded'}),
                page.click('.right-box .btn-checkout'),
            ]);
            await this.checkCheckout(page);

        } catch (err) {
            this.log('error', 'Status: faild in queue.')
            return
        }
    }

    public async checkIndex(page) {
        try {

            //检查导航数量
            let $nav = await page.waitForSelector('nav.nav');
            // console.log($nav);
            if ($nav) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('nav.nav .level-1 .item');
                    count = targetChild.length;
                    return count;
                });
                this.log('success', `一级导航数量：${count}个`, 'index')
            } else {
                this.log('error', `一级导航数量：获取异常`, 'index')
            }

            // best sellers
            // await this.sleep(2);
            // let $category2 = await page.waitForSelector('.section.s-4')
            // if ($category2) {
            //     let count = await page.evaluate(() => {
            //         let targetChild = document.querySelectorAll('.section.s-4 .swiper-wrapper .item');
            //         return targetChild.length;
            //     })
            //     this.log('success', `Weekly Best Sellers产品数量：${count}个`, 'index')
            // } else {
            //     this.log('error', `Weekly Best Sellers产品数量：获取异常`, 'index')
            // }

            // new arrivals.
            await this.sleep(2);
            let $category3 = await page.waitForSelector('.new.section.s-5').catch(()=>{})
            if ($category3) {
                let count = await page.evaluate(() => {
                    let tag = document.querySelectorAll('.new.section.s-5 .tag-box .tag');
                    let firstTag = tag[0];
                    let firstTagItem = document.querySelectorAll('.new.section.s-5 .slide-wrap')[0];
                    return {
                        tagCount: tag.length,
                        firstTagName: firstTag.textContent,
                        firstTagItemCount: firstTagItem.querySelectorAll('.item').length
                    }
                })
                this.log('success', `New Arrivals Tag数量：${count.tagCount}个`, 'index')
                this.log('success', `New Arrivals 首个Tag：${count.firstTagName}个`, 'index')
                this.log('success', `New Arrivals 首个Tag产品数量：${count.firstTagItemCount}个`, 'index')
            } else {
                this.log('error', `New Arrivals：获取异常`, 'index')
            }

            
            // 检查slider
            await this.sleep(3)
            let $slider = await page.waitForSelector('.index_slide .swiper-wrapper').catch(()=>{})
            if (!$slider) {
                let sliderApi = `${this.apiUrl}/activity/sliders`
                const sliderResponse = await page.waitForResponse(response =>
                    response.url() == sliderApi && response.status() === 200,
                    { timeout: 10000 }
                );
            }

            if ($slider) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.index_slide .swiper-wrapper .item')
                    return targetChild.length;
                })
                this.log('success', `首页slider数量：${count}个`, 'index')
            } else {
                this.log('error', `首页slider数量：获取异常`, 'index')
            }

            // 检查banner
            let $banner = await page.waitForSelector('header .top_banner').catch(()=>{})
            if (!$banner) {
                let bannerApi = `${this.apiUrl}/activity/banners`;
                // console.log(bannerApi);
                await page.waitForResponse(response =>
                    response.url() == bannerApi && response.status() === 200,
                    { timeout: 15000 }
                );
            }
            if ($banner) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('header .top_banner .inner');
                    return targetChild.length;
                })
                this.log('success', `顶部滚动banner数量：${count}个`, 'index')
            } else {
                this.log('error', `顶部滚动banner数量：获取异常`, 'index')
            }

        } catch (err) {
            this.log('error', `首页获取异常\n${err}`, 'index')
            console.log(err);
        }
    }

    public async checkCategory(page) {
        try {
            // 检查product
            // console.log('category test inner...')
            let $products = await page.waitForSelector('.p-list-main .p-list .p-item')
            if ($products) {
                let count = await page.evaluate(() => {
                    let targetChild = document.querySelectorAll('.p-list-main .p-list .p-item');
                    return targetChild.length;
                })
                this.log('success', `目录页产品数量：${count}个`, 'category')
            } else {
                this.log('error', `目录页产品数量：获取异常`, 'category')
            }

        } catch (err) {
            this.log('error', `获取异常\n${err}`, 'category')
        }
        return
    }

    public async checkProduct(page) {
        //todo: 需要分别测试各种类型的产品。
        try {
            // 检查product
            // let productApiRE = /api\/product\/info\/\d+/i;
            // await page.waitForResponse(response =>
            //     productApiRE.test(response.url()) && response.status() === 200,
            //     { timeout: 10000 }
            // );
            // console.log('check product inner..')
            let pageData = await page.waitForSelector('.p-intro .color-list .item')
            let data:any;
            if (pageData) {
                data = await page.evaluate(() => {
                    let titleEL = document.querySelector('.p-intro .p-name');
                    let snEL = document.querySelector('.p-intro .p-sn .code');
                    let colorItems = document.querySelectorAll('.p-intro .color-list .item');
                    let sizeItems = document.querySelectorAll('.p-intro .size-list .item');
                    let imgItems = document.querySelectorAll('.p-detail .img-box .img-list-slide .item.swiper-slide')
                    let multiSelectTab = document.querySelectorAll('.multi-select-tab');
                    let isInstock = multiSelectTab.length > 0
                    return {
                        title:titleEL.innerHTML,
                        sn:snEL.innerHTML,
                        colorCount: colorItems.length,
                        sizeCount: sizeItems.length,
                        imgCount: imgItems.length,
                        isInstock: isInstock,
                    }
                })
                this.log('success', `产品标题：${data.title}`, 'product')
                this.log('success', `产品SN ：${data.sn}`, 'product')
                this.log('success', `颜色数量：${data.colorCount}个`, 'product')
                this.log('success', `尺码数量：${data.sizeCount}个`, 'product')
                this.log('success', `产品图数量：${data.imgCount}个`, 'product')
            } else {
                this.log('error', `获取页面数据：常`, 'product')
            }

            // 加购
            if (!data.isInstock) {
                await page.click('.p-intro .color-list .item:nth-child(2)');
                this.log('success', `加购-->选择颜色：通过`, 'product')

                await page.click('.p-intro .size-list .item:nth-child(2)');
                this.log('success', `加购-->选择尺码：通过`, 'product')
            }

            await page.click('.btn-add-to-bag');
            await page.waitForResponse(response =>
                /\/api\/product\/cart/i.test(response.url()) && response.status() === 200,
                { timeout: 10000 }
            );
            this.log('success', `加购-->加入购物车：通过`, 'product')
        } catch (err) {
            this.log('error', `页面异常\n${err}`, 'product')
        }
    }

    public async checkCart(page) {
        try {
            // 检查购物车
            // console.log('check cart inner..')
            let $cartForm = await page.waitForSelector('.cart-group-list')
            if ($cartForm) {
                let count = await page.evaluate(() => {
                    let groupList = document.querySelectorAll('.cart-group-list');
                    let item = document.querySelectorAll('.cart-group-list .c-item');
                    let total = document.querySelector('.right-box .summary .total .val').textContent
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
            this.log('error', `页面异常\n${err}`, 'cart')
        }

    }

    public async checkCheckout(page) {
        try {
            // 填写地址
            await page.waitForSelector('.s-address .edit-address');
            await page.evaluate(()=>{
                let formItem = document.querySelectorAll('.edit-address .form-item');
                formItem.forEach((item,index)=>{
                    item.classList.add('formItem'+index);
                })
            })

            await page.type('.formItem1 input', 'Bot', { delay: 100 });
            await page.type('.formItem2 input', 'Test', { delay: 100 });
            await page.type('.formItem3 input', '123 Compute Rd.', { delay: 100 });

            await page.type('.formItem5 input', 'NetOnline', { delay: 100 });
            await page.type('.formItem6 input', '318097', { delay: 100 });
            await page.type('.formItem7 input', 'bottest@163.com', { delay: 100 });
            await page.type('.formItem8 input', '9153643212', { delay: 100 });

            await page.click('.formItem0 .v-select .vs__selected')
            await this.sleep(2)
            await page.click('.formItem0 .v-select ul[id*="__listbox"] .vs__dropdown-option:nth-child(1)')

            await this.sleep(3)
            await page.click('.formItem4 .v-select .vs__selected')
            await this.sleep(2)
            await page.click('.formItem4 .v-select ul[id*="__listbox"] .vs__dropdown-option:nth-child(1)')
  

            this.log('success', `地址填写：通过`, 'checkout')

            await page.click('.btn-save-address')
            await page.waitForSelector('.address-list input[name="address_item"]', { visible: true })
            this.log('success', `地址保存：通过`, 'checkout')

            await this.sleep(3);
            await page.click('.s-shipping #shippingups')
            let shippingApiRE = /checkout\/ajaxGetShippingFee/i;
            await page.waitForResponse(res =>{
                return shippingApiRE.test(res.url()) && res.status() === 200
            },{ timeout: 10000 })
            this.log('success', `运输方式保存：通过`, 'checkout')

            await this.sleep(3);
            let rushLength = await page.evaluate(()=>{
                let items = document.querySelectorAll('.s-shipping .date-list .item');
                let count = 0;
                items.forEach(i=>{
                    if(!i.classList.contains('disabled')) {
                        count++
                    }
                })
                return count;
            })
            if(rushLength > 1) {
                await page.click('.s-shipping .date-list .item:nth-child(1) input')
                await page.click('.s-shipping .date-list .item:nth-child(2) input')
                let rushApiRE = /checkout\/ajaxGetRushFee/i;
                await page.waitForResponse(res =>
                    rushApiRE.test(res.url()) && res.status() === 200,
                    { timeout: 10000 }
                ).catch((err)=>{
                    this.log('error', `加急费接口未返回\n${err}`, 'checkout')
                })
                this.log('success', `加急选择：通过`, 'checkout')
            }else {
                this.log('success', `加急选择项有效数量：${rushLength}`, 'checkout')
            }

            let data=await page.evaluate(()=>{
                let summary = document.querySelectorAll('.right-box-inner .sum-list .item')
                let data=[];
                summary.forEach(i=>{
                    data.push({
                        key:i.querySelector('.key').textContent,
                        val:i.querySelector('.val').textContent
                    })

                })

                return data
            })

            for(let i=0;i<data.length;i++){
                let obj=data[i];
                this.log('success',`${obj.key}:  ${obj.val}`,'checkout')
                await this.sleep(1);
            }

            let subMitBtnIsDisabled = await page.evaluate(()=>{
                let formItem = document.querySelector('.right-box .btn-checkout');
                let isDisabled = formItem.classList.contains('disabled');

                return isDisabled;
            })

            this.log(`${subMitBtnIsDisabled?'error':'info'}`,`Place Order按钮最终状态为${subMitBtnIsDisabled?'不':''}可点击`,'checkout')
            

            // 提交订单
            


        } catch (err) {
            this.log('error', `页面异常\n${err}`, 'checkout')
        }
    }
}
