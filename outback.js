var com = require('serialport');
//openSerialPort('/dev/ttyS0');
exports.start = function(scb){

    openSerialPort('/dev/ttyUSB1',scb);

}
console.log('wroking?');
process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
if (chunk !== null) {
    commandline(chunk);
}
});

function openSerialPort(portname,scb)
{
    // console.log("Attempting to open serial port "+portname);
    // serialport declared with the var to make it module global
    if (portname == undefined) {
        console.log("Serial port not specified as command line - no serial port open");
        return;

    }
    //serialPort = new com.SerialPort(portname, {
    serialPort = new com(portname, {
        baudrate: 19200,
// Set the object to fire an event after a \r (chr 13 I think)  is in the serial buffer
        parser: com.parsers.readline("\r")
    });



// I dont understand this call 0 but it works
    serialPort.on("open", function (err,res) {
        serialPort.set({dtr:true,rts:false})
        console.log("Port open success:"+portname);
        scb();
        //serialPort.write('r\r')
              //serialPort.write("VLD# 1 65 1 0\r");
    });

    serialPort.on('data', function(data) {
        data = data.replace(/,/g,' ').match(/\S+/g); // breaks string into array
        console.log(data)
    })
    serialPort.on('error', function(error) {
        console.error("serial port failed to open:"+error);

    });
};

exports.write = function(data) {
    serialPort.write(data,function(err, results)
    {

    });
};
function commandline(s){
    s = s.toString();
    t = s.replace(/,/g,' ').match(/\S+/g); // breaks string into array
    // console.log(t.length)
    // for (i = 0; i < t.length; i++){
    //     console.log(i,t[i])
    //
    // }
        switch (t[0]) {
        case "stop":
        case "exit":
            process.exit(0);
            break;
        default:

            console.log('Unknown input:'+s)

    }

}
