// 分发 ws的信息。

import TestMAll from './test_all_m';
import TestPcAll from './test_all_pc';

import { DispatchOption } from './base/type';


export class Dispatch {

    opts: DispatchOption

    constructor(options: DispatchOption) {
        this.opts = Object.assign({}, {
            site: 'dad',
            platform: 'm',
            range: 'all'
        }, options)

        this.handler()
    }

    public handler() {
        let target: TestMAll;
        if(this.opts.platform === 'm' && this.opts.range === 'all' ) {
               target = new TestMAll(this.opts)
        }else if(this.opts.platform === 'pc' && this.opts.range === 'all') {
            target = new TestPcAll(this.opts)
        }

        target.start();

    }
}
