export default {

    test: {
        task: ({strapi})=>{
            console.log('test cron task is run.');
        },
        options: {
            rule:'0 0 1 * * 1',
        }
    }
}