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
var display = ''
var t
var data
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


    //    console.log(data)
     //   console.log(data.length)
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
                //console.log('full message?')
                display = sbuffer.substr(startchar+2,35)
                console.log(display+'*')
                menu = sbuffer.substr(startchar+35);
                console.log('menu:'+menu);
                sbuffer = sbuffer.substr(startchar+37)
                if (sbuffer.length > 0){
                    console.log('chars remaining'+sbuffer.length)
                }

                clearTimeout(t);


            }
        } else {
            // lets parse what is in here - values or yes/no's etc
            if (menusys[display] && menusys[display].hasdata ){
                if (sbuffer.length >= menusys[display].charlen){
                    data = sbuffer.substr(0, menusys[display].charlen)
                    data = data.replace(/ /g,'')
                    if (data.length >0){
                        if (menusys[display].data != data){
                            console.log(display+'*Data:'+data+':'+data.length)
                        }

                        menusys[display].data = data;
                    }

                    sbuffer = sbuffer.substr(menusys[display].charlen+1)
                    if (sbuffer.length != 0 ){
                        console.log('more')
                        sbuffer = ''
                    }

                }

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
        case "-":
            serialPort.write('-')
            break;

        case "=":
        case "+":
            serialPort.write('=')
            break;
        default:

            console.log('Unknown input:'+s)

    }

}
var menusys ={}
menusys['  Set Generator    OFF AUTO ON  EQ '] = {
    menu:2,
    sub:1,
    hasdata:true,
    charlen:4
}

menusys['  Gen under/over   speed           ']= {
    menu:2,
    sub:2,
    hasdata:true,
    charlen:4
}
menusys['  Generator start  error           ']= {
    menu:2,
    sub:3,
    hasdata:true,
    charlen:4
}
menusys['  Generator sync   error           ']= {
    menu:2,
    sub:4,
    hasdata:true,
    charlen:4
}
menusys['  Load Amp Start   ready           ']= {
    menu:2,
    sub:5,
    hasdata:true,
    charlen:4
}
menusys['  Voltage Start    ready           ']= {
    menu:2,
    sub:6,
    hasdata:true,
    charlen:4
}
menusys['  Exercise Start   ready           ']= {
    menu:2,
    sub:7,
    hasdata:true,
    charlen:4
}

menusys['  Inverter/charger amps AC         ']= {
    menu:4,
    sub:1,
    hasdata:true,
    charlen:4
}
menusys['  Input            amps AC         ']= {
    menu:4,
    sub:2,
    hasdata:true,
    charlen:4
}

menusys['  Load             amps AC         ']= {
    menu:4,
    sub:3,
    hasdata:true,
    charlen:4
}
menusys['  Battery actual   volts DC        ']= {
    menu:4,
    sub:4,
    hasdata:true,
    charlen:6
}
menusys['  Battery TempComp volts DC        ']= {
    menu:4,
    sub:5,
    hasdata:true,
    charlen:6
}
menusys['  Inverter         volts AC        ']= {
    menu:4,
    sub:6,
    hasdata:true,
    charlen:4
}
menusys['  Grid (AC1)       volts AC        ']= {
    menu:4,
    sub:7,
    hasdata:true,
    charlen:4
}
menusys['  Generator (AC2)  volts AC        ']= {
    menu:4,
    sub:8,
    hasdata:true,
    charlen:4
}
menusys['  Read Frequency   Hertz           ']= {
    menu:4,
    sub:9,
    hasdata:true,
    charlen:4
}
menusys['  Time of Day                     6']= {
    menu:6,
    sub:1,
    hasdata:true,
    charlen:8
}
