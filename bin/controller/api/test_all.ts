import TestAll from '../../module/auto_test/test_all';

class TestAllCTRL
{
    async test(ctx){
        const testAll = new TestAll(ctx.params.site,ctx.params.platform)
        let result =  await testAll.start()
        ctx.response.status = 200;
        ctx.body = {
            code:'200',
            message:'success',
            data: {
                result: result
            }
        }
    }
}

export default new TestAllCTRL()