const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

//loading models
const Bootcamp = require('./models/Bootcamp');

//connecting to mongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser : true,    
    useUnifiedTopology: true
     
});

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

//importing into DB
const importData = async () =>{
    try {
        await Bootcamp.create(bootcamps);
        console.log('Data has imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

//Delete data
const deleteData = async () =>{
    try {
        await Bootcamp.deleteMany();
        console.log('Data has deleted...'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}