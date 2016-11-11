var com = require('serialport');
//openSerialPort('/dev/ttyS0');
openSerialPort('/dev/ttyUSB0');
console.log('wroking?')
process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
if (chunk !== null) {
    commandline(chunk);
}
});
var sbuffer = ''
var menu = 0;
var message = ''
var t
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
   //     parser: com.parsers.readline("\r")
    });



// I dont understand this call 0 but it works
    serialPort.on("open", function (err,res) {
        console.log("Port open success:"+portname);
        //serialPort.write('r\r')
              //serialPort.write("VLD# 1 65 1 0\r");
    });

    serialPort.on('data', function(data) {
       if (t){
           clearTimeout(t);
       }


        console.log(data)
        console.log(data.length)
        sbuffer += data
        if (sbuffer.indexOf('\r')  != -1){
            t = setTimeout(function(){
                console.log('Timeout:')

                if (sbuffer.indexOf('\r\n\r\n') != -1){
                    console.log('leds:'+sbuffer)
                } else
                {
                    // junk
                    console.log(sbuffer);
                }


                sbuffer = ''
            },25);
            startchar = sbuffer.indexOf('\r')
            console.log('0x0d found@'+startchar)
            if (sbuffer.length >= startchar+37){
                console.log('full message?')
                message = sbuffer.substr(startchar+2,35)
                console.log(message+'*')
                menu = sbuffer.substr(startchar+35);
                console.log('menu:'+menu);
                sbuffer = sbuffer.substr(startchar+37)
                console.log('chars remaining'+sbuffer.length)
                clearTimeout(t);


            }
        }

       // console.log(data)

       // console.log(data.toString())

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
function commandline(s){
    s = s.toString();
    t = s.replace(',',' ').match(/\S+/g); // breaks string into array
    switch (t[0]) {
        case "stop":
        case "exit":
            process.exit(0);
            break;
        case "r":
            serialPort.write('r')
            break;
        case "s":
            serialPort.write('\x13')
            break;

        case "l":
            serialPort.write('l')
            break;
        case "v":
            serialPort.write('v')
            break;

        case "u":
            serialPort.write('u')
            break;
        case "d":
            serialPort.write('d')
            break;
        case "/":
            serialPort.write('/')
            break;

        default:

            console.log('Unknown input:'+s)

    }

}