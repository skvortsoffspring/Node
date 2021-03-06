const http =require('http');
const fs=require('fs');
const { ClientVerify } = require('./module/Sign');

let resource_options =
    {
        host: 'localhost',
        path: '/resource',
        port: 3000,
        method:'GET'
    }
let options=
    {
        host: 'localhost',
        path: '/',
        port: 3000,
        method:'GET',
        headers: {'content-type':'application/json'}
    }

const request = http.request(resource_options,(res)=>
{

    const file = fs.createWriteStream('./files/client.txt');
    res.pipe(file);

    const req = http.request(options,(res)=>
    {
        let data = '';
        res.on('data',(chunk) => {data+=chunk.toString();});
        res.on('end',()=>
        {
            let sign = JSON.parse(data);
            const x = new ClientVerify(sign);
            const readStream = fs.createReadStream('./files/client.txt');
            x.verify(readStream,(result)=>
            {
                if(result){
                    console.log('verify success')
                }else{
                    console.log('verify failure')
                }
            })
        });
    });
    req.on('error', (e)=>
        {console.log('http.request: error:', e.message);
        }
    );
    req.end();
});
request.on('error', (e)=> {
    console.log('http.request: error:', e.message
    );
});
request.end();