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
var b = {}


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
        var o = {
            address:data[0],
            chargerCurrent:data[2],
            pvCurrent:data[3],
            pvVoltage:data[4],
            dailyKWH:data[5]/10,
            batteryVoltage:data[10]/10,
            dailyAH:data[11]
        };
        if   (Number(data[8]) > 0 ){// error mode
            var text
            switch (data[8]){
                case 32:
                    text = 'Shorted Battery Sensor'
                    break;
                case 64:
                    text = 'Too Hot'
                    break;
                case 128:
                    text = 'High VOC (panel volatage too high)'
                    break;

            }
            o.error = {val:data[8],text:text}
            //send the event change here
        }
//        auxMode:data[7],
        switch (Number(data[7])){ // aux mode
            case 0:
                o.auxMode = 'Disabled';
                break;
            case 1:
                o.auxMode = 'Diversion';
                break;
            case 2:
                o.auxMode = 'Remote';
                break;
            case 3:
                o.auxMode = 'Manual';
                break;
            case 4:
                o.auxMode = 'Vent Fan';
                break;
            case 5:
                o.auxMode = 'PV Trigger';
                break;
        }
//            chargeMode:data[9],

        switch (Number(data[9])) { // aux mode
            case 0:
                o.chargeMode = 'Silent';
                break;
            case 1:
                o.chargeMode = 'Float';
                break;
            case 2:
                o.chargeMode = 'Bulk';
                break;
            case 3:
                o.chargeMode = 'Absorb';
                break;
            case 4:
                o.chargeMode = 'EQ';
                break;
            default:
                console.log('chargemode'+data[9])
        }

        if (o.chargeMode != b.chargeMode && o.address == "B"){

            console.log('Charge Mode Changed:'+o.chargeMode)
            o.chargeModeOld = b.chargeMode; // add the prev charge mode to the reporting object
            b.chargeMode = o.chargeMode; // update
            // todo send event chargemode changed

        }





        if (o.address == "B"){
            console.log(o)
        }

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
