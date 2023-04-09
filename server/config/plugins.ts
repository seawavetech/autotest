
import { Dispatch} from '../src/module/autotest';
import { DispatchOption,ResultDataType} from '../src/module/autotest/base/type'

export default ({ env })=>({
    'io':{
        enabled: true,
        config:{
            IOServerOptions:{
                cors:{},
                path:'/ws/'
            },
            contentTypes:{
                'message':'*',
            },
            events:[
                {
                    name:'connection',
                    handler({strapi},socket){
                        strapi.log.info(`[io] new connection with id ${socket.id}`);
                        // console.log(strapi.$io)
                        socket.on('message', (data: DispatchOption) => {
                            console.log('message:');
                            console.log(data);
                            new Dispatch(Object.assign({}, data, { env,logCallback }));
                        })
                    
                        socket.on('disconnect', (data) => {
                            console.log('disconnect')
                            console.log(data)
                        });
                    
                        socket.emit('result', { a: 123, b: 456 })
                    
                        /* 每个log回调函数,如有必要，可根据data.type二次处理返回消息。*/
                        function logCallback(data: ResultDataType) {
                            let { type, message, position } = data;
                            socket.emit('result', { type, message, position })
                        }
                    }
                },
                // {
                //     name:'message',
                //     handler({strapi},data){
                //         strapi.log.info(JSON.stringify(data));
                //     }
                // },
            ]
        }
    }
})