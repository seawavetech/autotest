import helmet from "helmet";


export let helMetConfig={
    enabled: true,
    options:{
        contentSecurityPolicy:{
            directives: {
                connectSrc:['self',"https"]
            }
        }
    },
    fn: helmet(),
    loadOrder:100
}