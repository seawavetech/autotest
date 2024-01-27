
export interface ResultDataType {
    type: 'info' | 'ctrl' | 'success' | 'error';
    message: string;
    position: string;
}

export interface TestClassOptions {

    env:any;
    logCallback(data:ResultDataType):void ;
}

export interface DispatchOption extends TestClassOptions {
}