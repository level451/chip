var com = require('serialport');
//openSerialPort('/dev/ttyS0');
openSerialPort('/dev/ttyUSB0');
console.log('wroking?');
process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
if (chunk !== null) {
    commandline(chunk);
}
});
var sbuffer = '';
var menu = 0;
var display = '';
var t;
var data;
targetmenu = 0;
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
//console.log(data)

        sbuffer += data;
        if (sbuffer.indexOf('\r')  != -1){
          // have a menu item message - this is the only type we can detect
            t = setTimeout(function(){
                console.log('Timeout:');

                if (sbuffer.indexOf('\r\n\r\n') != -1){
                    console.log('leds:'+sbuffer)
                } else
                {
                    // junk
                    console.log('unknown:'+sbuffer);
                }
                sbuffer = ''
            },25);
            startchar = sbuffer.indexOf('\r');
            //console.log('0x0d found@'+startchar)
            // I think all menu dumps are the same length

            if (sbuffer.length >= startchar+37){
                //console.log('full message?')
                display = sbuffer.substr(startchar+2,35);
                console.log(display+'*')
                if (sbuffer.substr(startchar+35,2) > 0){

                    menu = sbuffer.substr(startchar+35,2);

                }

                sbuffer = sbuffer.substr(startchar+37,2)
                if (sbuffer.length > 0){
                    console.log('chars remaining'+sbuffer.length)
                }
                if (menusys[display]){
                    menusys[display].data = '';
                    menu = menusys[display].menu
                }

                clearTimeout(t);
                // ok - we know where we are check if its where we want to be
                console.log('menu:'+menu);

                if (targetmenu > 0){
                    if (menu == targetmeu){
                        console.log('At target menu')

                    } else if (targetmenu > menu)
                    {
                        console.log('going right')
                        serialPort.write('r')

                    } else if (targetmenu < menu)
                    {
                        console.log('going left')
                        serialPort.write('l')

                    }



                }

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
                        //sbuffer = ''
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
            serialPort.write('l');
            break;
        case "v":
            serialPort.write('v');
            break;

        case "u":
            serialPort.write('u');
            break;
        case "d":
            serialPort.write('d');
            break;
        case "/":
            serialPort.write('/');
            break;
        case "-":
            serialPort.write('-');
            break;

        case "=":
        case "+":
            serialPort.write('=');
            break;
        case "go":
            targetmenu = t[1]
            console.log('seeking '+targetmenu)
        default:

            console.log('Unknown input:'+s)

    }

}
var menusys ={};
menusys['  Set Generator    OFF AUTO ON  EQ '] = {
    menu:2,
    sub:1,
    hasdata:true,
    charlen:4
};

menusys['  Gen under/over   speed           ']= {
    menu:2,
    sub:2,
    hasdata:true,
    charlen:4
};
menusys['  Generator start  error           ']= {
    menu:2,
    sub:3,
    hasdata:true,
    charlen:4
};
menusys['  Generator sync   error           ']= {
    menu:2,
    sub:4,
    hasdata:true,
    charlen:4
};
menusys['  Load Amp Start   ready           ']= {
    menu:2,
    sub:5,
    hasdata:true,
    charlen:4
};
menusys['  Voltage Start    ready           ']= {
    menu:2,
    sub:6,
    hasdata:true,
    charlen:4
};
menusys['  Exercise Start   ready           ']= {
    menu:2,
    sub:7,
    hasdata:true,
    charlen:4
};

menusys['  Inverter/charger amps AC         ']= {
    menu:4,
    sub:1,
    hasdata:true,
    charlen:4
};
menusys['  Input            amps AC         ']= {
    menu:4,
    sub:2,
    hasdata:true,
    charlen:4
};

menusys['  Load             amps AC         ']= {
    menu:4,
    sub:3,
    hasdata:true,
    charlen:4
};
menusys['  Battery actual   volts DC        ']= {
    menu:4,
    sub:4,
    hasdata:true,
    charlen:5
};
menusys['  Battery TempComp volts DC        ']= {
    menu:4,
    sub:5,
    hasdata:true,
    charlen:5
};
menusys['  Inverter         volts AC        ']= {
    menu:4,
    sub:6,
    hasdata:true,
    charlen:4
};
menusys['  Grid (AC1)       volts AC        ']= {
    menu:4,
    sub:7,
    hasdata:true,
    charlen:4
};
menusys['  Generator (AC2)  volts AC        ']= {
    menu:4,
    sub:8,
    hasdata:true,
    charlen:4
};
menusys['  Read Frequency   Hertz           ']= {
    menu:4,
    sub:9,
    hasdata:true,
    charlen:4
};
menusys['  Time of Day                     6']= {
    menu:6,
    sub:1,
    hasdata:true,
    charlen:9
};
menusys['  Set Clock hour                   ']= {
    menu:6,
    sub:2,
    hasdata:true,
    charlen:9
};
menusys['  Set Clock minute                 ']= {
    menu:6,
    sub:3,
    hasdata:true,
    charlen:9
};
menusys['  Set Clock second                 ']= {
    menu:6,
    sub:4,
    hasdata:true,
    charlen:4
};
menusys['  Set Grid Usage   FLT SELL SLT LBX'] = {
    menu:9,
    sub:1,
    hasdata:true,
    charlen:4
};
menusys['  Set Low battery  cut out VDC     '] = {
    menu:9,
    sub:2,
    hasdata:true,
    charlen:5
};
menusys['  Set LBCO delay   minutes         '] = {
    menu:9,
    sub:3,
    hasdata:true,
    charlen:4
};
menusys['  Set Low battery  cut in VDC      '] = {
    menu:9,
    sub:4,
    hasdata:true,
    charlen:5
};
menusys['  Set High battery cut out VDC     '] = {
    menu:9,
    sub:5,
    hasdata:true,
    charlen:5
};
menusys['  Set search       watts           '] = {
    menu:9,
    sub:6,
    hasdata:true,
    charlen:4
};
menusys['  Set search       spacing         '] = {
    menu:9,
    sub:7,
    hasdata:true,
    charlen:4
};
menusys['  Set Bulk         volts DC        '] = {
    menu:10,
    sub:1,
    hasdata:true,
    charlen:5
};
menusys['  Set Absorbtion   time h:m        '] = {
    menu:10,
    sub:2,
    hasdata:true,
    charlen:6
};
menusys['  Set Float        volts DC        '] = {
    menu:10,
    sub:3,
    hasdata:true,
    charlen:5
};
menusys['  Set Equalize     volts DC        '] = {
    menu:10,
    sub:4,
    hasdata:true,
    charlen:5
};
menusys['  Set Equalize     time h:m        '] = {
    menu:10,
    sub:5,
    hasdata:true,
    charlen:6
};
menusys['  Set Max Charge   amps  AC        '] = {
    menu:10,
    sub:6,
    hasdata:true,
    charlen:4
};
menusys['  Set Temp Comp    LeadAcid NiCad  '] = {
    menu:10,
    sub:7,
    hasdata:true,
    charlen:4
};

menusys['  Set Grid (AC1)   amps AC         '] = {
    menu:11,
    sub:1,
    hasdata:true,
    charlen:4
};

menusys['  Set Gen (AC2)    amps  AC        '] = {
    menu:11,
    sub:2,
    hasdata:true,
    charlen:4
};

menusys['  Set Input lower  limit VAC       '] = {
    menu:11,
    sub:3,
    hasdata:true,
    charlen:4
};

menusys['  Set Input upper  limit VAC       '] = {
    menu:11,
    sub:4,
    hasdata:true,
    charlen:4
};

menusys['  Set Load Start   amps AC         '] = {
    menu:12,
    sub:1,
    hasdata:true,
    charlen:4
};

menusys['  Set Load Start   delay min       '] = {
    menu:12,
    sub:2,
    hasdata:true,
    charlen:5
};
menusys['  Set Load Stop    delay min       '] = {
    menu:12,
    sub:3,
    hasdata:true,
    charlen:5
};
menusys['  Set 24 hr start  volts DC        '] = {
    menu:12,
    sub:4,
    hasdata:true,
    charlen:5
};
menusys['  Set 2  hr start  volts DC        '] = {
    menu:12,
    sub:5,
    hasdata:true,
    charlen:5
};
menusys['  Set 15 min start volts DC        '] = {
    menu:12,
    sub:6,
    hasdata:true,
    charlen:5
};
menusys['  Read LBCO 30 sec start VDC       '] = {
    menu:12,
    sub:7,
    hasdata:true,
    charlen:5
};
menusys['  Read LBCO 30 sec start VDC       '] = {
    menu:12,
    sub:8,
    hasdata:true,
    charlen:5
};
menusys['  Set Exercise     period days     '] = {
    menu:12,
    sub:9,
    hasdata:true,
    charlen:4
};
menusys['  Set RY7 Function GlowStop Run    '] = {
    // cant tell position of this one????
    // no data being sent
    menu:13,
    sub:1,
    hasdata:true,
    charlen:4
};
menusys['  Set Gen warmup   seconds         '] = {
    menu:13,
    sub:2,
    hasdata:true,
    charlen:4
};
menusys['  Set Pre Crank    seconds         '] = {
    menu:13,
    sub:3,
    hasdata:true,
    charlen:4
};
menusys['  Set Max Cranking seconds         '] = {
    menu:13,
    sub:4,
    hasdata:true,
    charlen:4
};
menusys['  Set Post Crank   seconds         '] = {
    menu:13,
    sub:5,
    hasdata:true,
    charlen:4
};
menusys['  Set Relay 9      volts DC        '] = {
    menu:14,
    sub:1,
    hasdata:true,
    charlen:5
};
menusys['  R9 Hysteresis    volts DC        '] = {
    menu:14,
    sub:2,
    hasdata:true,
    charlen:5
};
menusys['  Set Relay 10     volts DC        '] = {
    menu:14,
    sub:3,
    hasdata:true,
    charlen:5
};
menusys['  R10 Hysteresis   volts DC        '] = {
    menu:14,
    sub:4,
    hasdata:true,
    charlen:5
};
menusys['  Set Relay 11     volts DC        '] = {
    menu:14,
    sub:5,
    hasdata:true,
    charlen:5
};
menusys['  R11 Hysteresis   volts DC        '] = {
    menu:14,
    sub:6,
    hasdata:true,
    charlen:5
};
menusys['  Set Start Bulk   time            '] = {
    menu:15,
    sub:1,
    hasdata:true,
    charlen:6
};

menusys['  Set Low Battery  transferVDC     '] = {
    menu:16,
    sub:1,
    hasdata:true,
    charlen:5
};
menusys['  Set Low battery  cut in  VDC     '] = {
    menu:16,
    sub:2,
    hasdata:true,
    charlen:5
};
menusys['  Set Battery Sell volts DC        '] = {
    menu:17,
    sub:1,
    hasdata:true,
    charlen:5
};
menusys['  Set Max Sell     amps AC         '] = {
    menu:17,
    sub:2,
    hasdata:true,
    charlen:4
};
menusys['  Set Start Charge time            '] = {
    menu:18,
    sub:1,
    hasdata:true,
    charlen:6
};
menusys['  Set End Charge   time            '] = {
    menu:18,
    sub:1,
    hasdata:true,
    charlen:6
};
