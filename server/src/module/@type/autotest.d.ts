
export interface ResultDataType {
    type: 'info' | 'ctrl' | 'success' | 'error';
    message: string;
    position?: 'common' | 'index' | 'category' | 'product' | 'cart' | 'checkout' | 'user';
}

export interface TestClassOptions {
    site:'dad'|'drw'|'ebd';
    platform: 'm' | 'pc';
    env:any;
    logCallback(data:ResultDataType):void ;
}

export interface DispatchOption extends TestClassOptions {
    type: 'test' | 'other';
    range: 'all' | 'index' | 'category' | 'product' | 'cart' | 'checkout' | 'user'
}