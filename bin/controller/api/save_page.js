const Html2img = require('../../module/html2img')

class SavePageController
{
    async save(ctx){
        const html2img = new Html2img(ctx.params.type,ctx.params.ssn,ctx.params.oid)
        let result =  await html2img.save()
        ctx.response.status = 200;
        ctx.body = {
            code:'200',
            message:'success',
            data: {
                result:result
            }
        }
    }
}

module.exports = new SavePageController()