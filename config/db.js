
const mongoose = require('mongoose');

const connectDb = async()=>{
    const connect = mongoose.connect(process.env.DB_URL)
    .then((connect)=>{
        console.log(
            "Database connected:",
            connect.connection.host,
            connect.connection.name
        );
    })
    .catch((err)=>{
        console.log(err);
        process.exit(1);
    })
}

module.exports= connectDb;