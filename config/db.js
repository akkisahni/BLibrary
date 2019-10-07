const mongoose = require('mongoose');
const config = require('config');
const DB = config.get('mongoURI');
const chalk = require('chalk');
/**
 * Connect to MongoDB.
 */

const connectDB =  async () => {
    try{
        await mongoose.connect(DB,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex:true,
            useFindAndModify: false,
        });
        mongoose.connection.on('error', (err) => {
            console.error(err);
            console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
            process.exit();
        });
        console.log( chalk.green("Mongo DB Connected"));
    } catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;