var com = require('serialport');
openSerialPort('\dev\ttyS0');
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
        baudrate: 19200,
// Set the object to fire an event after a \r (chr 13 I think)  is in the serial buffer
        parser: com.parsers.readline("\r")
    });



// I dont understand this call 0 but it works
    serialPort.on("open", function (err,res) {
        console.log("Port open success:"+portname);

              //serialPort.write("VLD# 1 65 1 0\r");
    });

    serialPort.on('data', function(data) {

      console.log(data)

    });
    serialPort.on('error', function(error) {
        console.error("serial port failed to open:"+error);

    });
};

exports.write = function(data) {
    serialPort.write(data,function(err, results)
    {

    });
};
exports.serialToObject = function(data) {
    var sdata = data.split(" ");
    return sdata
};