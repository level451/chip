/**
 * Created by todd on 11/11/2016.
 */
// var trace = require('./traceinverter');
// trace.start(function(){
//     //trace.getInverterValue(4,2,testcallback)
//
//
// })
var xa = require('./xantrex');
xa.start(function(){
    //trace.getInverterValue(4,2,testcallback)

    xa.write('MEASENGY?\r')
    xa.write('MEASIN?\r')
    xa.write('MONALL?\r')


})

function testcallback(d){
    console.log(JSON.stringify(d,null,4))



}