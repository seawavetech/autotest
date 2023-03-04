/**
 * DHL config
 *
 * @param [string,number] ssn(shipping number)
 * @return object config
* */
module.exports = function(ssn){
    if(!ssn) return {}
    return {
        url:`http://www.dhl.com/en/express/tracking.html?AWB=${ssn}&brand=DHL`,
        width:1186,
        injectCss:'body{padding-top: 0 !important;} .dhl-cgk {display: none !important;}',
        injectJs:'',
    }
}