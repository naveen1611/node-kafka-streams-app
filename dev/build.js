const fs = require('fs');
const path = require('path');
const dirbasePath = path.join(__dirname, '..','src','config');
const destbasePath = path.join(__dirname, '..','dist','config');

function build(){
    try{
        fs.mkdirSync(path.join(__dirname, '..','dist','config'));
    }catch(e){
        console.log('config', e.message);
    }
    
    fs.readdir(dirbasePath, (err, files) => {
        if(!err && files){
            files.forEach((file) => {
                try{
                    fs.copyFileSync(path.join(dirbasePath, file), path.join(destbasePath, file));
                }catch(e){
                    console.log(' ******** Error - copying config file : '+ file, e);
                }
            });
        }
    });
}
build();