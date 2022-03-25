const mongoose = require('mongoose')

const ConnectDB = async (DATABASE_URL)=>{
    try {
        const DB_OPTIONS ={
        dbname:"loginsytem"
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
        console.log('database connected');
    } catch (error) {
        console.log(error);
    }
}
module.exports = ConnectDB;