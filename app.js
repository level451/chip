/**
 * Created by todd on 11/11/2016.
 */

// process.stdin.on('readable', () => {
//     var chunk = process.stdin.read();
//     if (chunk !== null) {
//         commandline(chunk);
//     }
// });


var com = require('serialport');
//openSerialPort('/dev/ttyS0');


    openSerialPort('/dev/ttyS0');


console.log('working?');


var i = 0;


function openSerialPort(portname)
{
    // console.log("Attempting to open serial port "+portname);
    // serialport declared with the var to make it module global
    if (portname == undefined) {
        console.log("Serial port not specified as command line - no serial port open");
        return;

    }
    //serialPort = new com.SerialPort(portname, {
    serialPort = new com(portname, {
        baudrate: 9600,
// Set the object to fire an event after a \r (chr 13 I think)  is in the serial buffer
       // parser: com.parsers.readline("\n")
    });



// I dont understand this call 0 but it works
    serialPort.on("open", function (err,res) {
       // serialPort.set({dtr:false,rts:false});
        console.log("Port open success:"+portname);

        //serialPort.write('r\r')
        //serialPort.write("VLD# 1 65 1 0\r");
    });

    serialPort.on('data', function(data) {
        ++i;
        console.log(i,data);
    });

    serialPort.on('close', function(data) {
        console.log('port closed???');
    });
    serialPort.on('error', function(error) {
        console.error("serial port failed to open:"+error);

    });
}
// exports.write = function(data) {
//     serialPort.write(data,function(err, results)
//     {
//
//     });
// };
//
// function commandline(s){
//     s = s.toString();
//     t = s.replace(/,/g,' ').match(/\S+/g); // breaks string into array
//
//
//             if (t[1] == null) {
//                 xa.write(t[0].toUpperCase() + '\r');
//             }
//             else
//             {
//  xa.write(t[0].toUpperCase()+' '+t[1]+'\r');
//             }
// }
