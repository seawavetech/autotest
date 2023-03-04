/**
 * 17track config
 *
 * @param [string,number] ssn
 * @return object config
* */
module.exports = function(ssn){
    if(!ssn) return false
    return {
        url:`https://t.17track.net/en#nums=${ssn}`,
        width:1180,
        injectCss:'.yq-panel-gad{display:none;visibility:hidden;}',
        injectJs:'',
        type_map:{
            ups:'100002',
            fedex:'100003',
            tnt:'100004'
        }
    }
}