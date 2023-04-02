
export interface ResultDataType {
    type: 'info' | 'ctrl' | 'success' | 'error';
    message: string;
    position: 'common' | 'index' | 'category' | 'product' | 'cart' | 'checkout' | 'user';
}

export interface TestClassOptions {
    site:'dad'|'drw'|'ebd';
    platform: 'm' | 'pc';
    logCallback(data:ResultDataType):()=>undefined | undefined;
}