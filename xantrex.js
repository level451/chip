var com = require('serialport');
//openSerialPort('/dev/ttyS0');
exports.start = function(scb){

    openSerialPort('/dev/ttyUSB2',scb);

};
console.log('wroking?');
var b = {};
var cb = null;
var avg = [];
var templimit;
var command;
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
        baudrate: 9600,
// Set the object to fire an event after a \r (chr 13 I think)  is in the serial buffer
        parser: com.parsers.readline("\r")
    });



// I dont understand this call 0 but it works
    serialPort.on("open", function (err,res) {
        serialPort.set({dtr:true,rts:false});
        console.log("Port open success:"+portname);
        getInfo('templimit?',function(z){templimit=z;
            scb();
        });

        //serialPort.write('r\r')
              //serialPort.write("VLD# 1 65 1 0\r");
    });

    serialPort.on('data', function(data) {
        if (cb != null){

            cb(data)
        }

        console.log(data);
    });


    serialPort.on('error', function(error) {
        console.error("serial port failed to open:"+error);

    });
}
exports.write = function(data) {
    serialPort.write(data,function(err, results)
    {

    });
};
function getInfo(x,callback){
    command = x.toUpperCase();
    cb = callback;
    serialPort.write(command+'\r');
}
exports.getAll = function(callback){
var o = {};
    console.time("getAll");
    getInfo('measin?',function(x){
        o.voltIn = x.substr(2,x.indexOf(' ')-2);
        o.currentIn = x.substring(x.indexOf(' ')+3,x.lastIndexOf(' '));
        o.powerIn = x.substring(x.lastIndexOf(' ')+3);
        getInfo('measout?',function(x){
            console.log(x);
            o.voltOut = x.substr(2,x.indexOf(' ')-2);
            x=x.substr(x.indexOf(' ')+1);
            o.currentOut =  x.substr(2,x.indexOf(' ')-2);
            o.powerOut= x.substring(x.indexOf(' ')+3,x.lastIndexOf(' '));
            o.freqOut = x.substring(x.lastIndexOf(' ')+3);

            getInfo('meastemp?',function(x){
                o.temp = x.substr(x.indexOf('F')+2);
                o.tempLimit = templimit;
                getInfo('freq?',function(x){
                    o.freq = x;
                    getInfo('freq?',function(x){
                        o.freq = x;
                        getInfo('freq?',function(x){
                            o.freq = x;
                            getInfo('kwhtoday?',function(x) {
                                o.khwtoday = x;
                                console.timeEnd("getAll");
                                cb = null;
                                console.log(JSON.stringify(o, null, 4));
                            })
                        })
                    })

                })

            })

        })

    })


};