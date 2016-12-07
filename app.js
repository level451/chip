/**
 * Created by todd on 11/11/2016.
 */

process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        commandline(chunk);
    }
});


function testcallback(d){
    console.log(JSON.stringify(d,null,4))



}
function commandline(s){
    s = s.toString();
    t = s.replace(/,/g,' ').match(/\S+/g); // breaks string into array


            if (t[1] == null) {
                xa.write(t[0].toUpperCase() + '\r');
            }
            else
            {
                xa.write(t[0].toUpperCase()+' '+t[1]+'\r');
            }


    // console.log(t.length)
    // for (i = 0; i < t.length; i++){
    //     console.log(i,t[i])
    //
    // }
    // switch (t[0]) {
    //     case "stop":
    //     case "exit":
    //         process.exit(0);
    //         break;
    //     case "send":
    //         if (t[2] == null) {
    //             xa.write(t[1].toUpperCase() + '\r');
    //         }
    //         else
    //         {
    //             xa.write(t[1].toUpperCase()+' '+t[2]+'\r');
    //         }
    //
    //
    //         break;
    //     default:
    //
    //         console.log('Unknown input:'+s)
    //
    // }

}
