import { Dispatch } from './ws_module'
import { Server, Socket } from 'socket.io'

import { DispatchOption } from './ws_module/type';
import { ResultDataType } from './ws_module/auto_test/base/type';

type socketType = { io: Server, socket: Socket };

function registerHandler(io: Server, socket: Socket) {
    socket.on('message', (data: DispatchOption) => {
        console.log('message:');
        console.log(data);
        new Dispatch(Object.assign({}, data, { logCallback }));
    })

    socket.on('disconnect', (data) => {
        console.log('disconnect')
        console.log(data)
    });

    // socket.emit('result', { a: 123, b: 456 })

    /* 每个log回调函数,如有必要，可根据data.type二次处理返回消息。*/
    function logCallback(data: ResultDataType) {
        let { type, message, position } = data;
        socket.emit('result', { type, message, position })
    }

}

/* 连接事件处理 */
function onConnection(io: Server, socket: Socket) {
    registerHandler(io, socket);
}


export default (io: Server) => {
    /* 监听连接事件 */
    io.on('connection', socket => {
        console.log('web socket is connection.');
        onConnection(io, socket);
    })

}

