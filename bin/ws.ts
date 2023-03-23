import { Dispatch, DispatchOption } from './ws_module'
import { Server } from 'socket.io'

function registerHandler(io, socket) {
    socket.on('message', (data: DispatchOption) => {
        console.log('message:');
        console.log(data);
        new Dispatch(Object.assign({},data,{io,socket}));
    })

    socket.on('disconnect', (data) => {
        console.log('disconnect')
        console.log(data)
    });

    socket.emit('result', { a: 123, b: 456 })
}

function onConnection(io, socket) {
    registerHandler(io, socket);
}

export default (io: Server) => {
    io.on('connection', socket => {
        console.log('web socket is connection.');
        onConnection(io, socket);
    })

}

