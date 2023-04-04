import { contentSecurityPolicy } from "helmet";


export let helMetConfig={
    enabled: true,
    contentSecurityPolicy:{
        directives: {
            connectSrc:['self',"https"]
        }
    }
}