
import {TestClassOptions} from './auto_test/base/type';

export interface DispatchOption extends TestClassOptions {
    type: 'test' | 'other';
    range: 'all' | 'index' | 'category' | 'product' | 'cart' | 'checkout' | 'user'
}