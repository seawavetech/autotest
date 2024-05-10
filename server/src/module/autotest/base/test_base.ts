import puppeteer, { KnownDevices } from 'puppeteer';
import { sleep } from '../../../../utils'
import moment from 'moment';

import siteList from './site';

import { ResultDataType, TestClassOptions } from '../../@type/autotest';

const iPhone = KnownDevices['iPhone 12'];
const PC = {
    viewport: {
        width: 1400,
        height: 960,
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
}

export default abstract class Test {
    public site: { [key in string]: any } = {};
    public platform: string = '';
    public url: string = '';
    public apiUrl: string = '';
    public logCallback: TestClassOptions['logCallback'];
    public sleep = sleep;
    public pageTimeout = 10000;
    public apiTimeout = 5000;

    private headless = true;
    private browserPath = ''

    constructor(opts: TestClassOptions) {
        this.platform = opts.platform;
        this.site = opts.platform === 'm' ? siteList[opts.site].m : siteList[opts.site].pc;
        this.url = this.site.domain;
        this.apiUrl = this.site.apiUrl;
        this.headless = opts.env.bool('PUPPETEER_HEADLESS', true);
        this.browserPath = opts.env('CHROMIUM_PATH', '');
        this.logCallback = opts.logCallback;
        console.log('this.headless = ',this.headless)
    }

    public async start() {
        const month = moment().format("YYYY-MM");
        const day = moment().format("DD");
        const now = new Date().getTime();
        const nowTime = moment().format("HHmmss");

        let browser;
        const options = {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        };

        if (this.headless === false) {
            options['headless'] = false;
        }
        if (this.browserPath) {
            options['executablePath'] = this.browserPath;
        }

        // console.log(this.headless);

        try {
            browser = await puppeteer.launch(options).catch(err=>console.log(err));
            this.log('info', `测试开始：${moment().format('YYYY-MM-DD HH:mm:ss')}`)

            const page = await browser.newPage();
            await page.emulate(this.platform === 'm' ? iPhone : PC);
            await page.setDefaultTimeout(60000);
            await this.queue(page);

            this.log('info', `测试结束：${moment().format('YYYY-MM-DD HH:mm:ss')}`);
            this.log('info', `本次用时：${Math.floor((new Date().getTime() - now) / 1000)}秒`);
            this.log('ctrl', 'close');

            await this.sleep(10);
            await browser.close();
        } catch (err) {
            console.info(`++++++++++++++++++++++`);
            console.log(err);
            this.log('error', 'Status: faild in start.');
            this.log('info', '出现错误，测试中断');
            this.log('ctrl', 'close');

            if (!!browser['close']) {
                await browser.close();
            }
            // return err
        }
    }

    public abstract queue(page): Promise<any>

    /* 执行状态与处理解耦，仅返回执行结果，由各调用方二次处理。*/
    public log(type: ResultDataType['type'],
        message: ResultDataType['message'],
        position: ResultDataType['position'] = 'common') {
        let updateTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

        if (this.logCallback) {
            this.logCallback({ type, message, position })
        }
    }
}
