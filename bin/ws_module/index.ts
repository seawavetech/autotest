// 分发 ws的信息。

import TestAll from './auto_test/test_all';

export interface DispatchOption {
    type: 'test' | 'other';
    site: 'dad' | 'ebd' | 'drw';
    platform: 'm' | 'pc';
    range: 'all' | 'index' | 'category' | 'product' | 'cart' | 'checkout' | 'user'
}

export class Dispatch {

    opts: DispatchOption

    constructor(opt: DispatchOption) {

        this.opts = Object.assign({}, {
            type: 'test',
            site: 'dad',
            platform: 'm',
            range: 'all'
        }, opt)

        this.handler()
    }


    handler() {
        let target;
        switch (this.opts.type) {
            case 'test':
                target = new TestAll(this.opts)
                target.start();
                break;
            default:
                break;
        }

    }
}
