const mongoose = require('mongoose');
const mysql = require('mysql2');

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const connectMySQL = () => {
    mysqlConnection.connect((err) => {
        if (err) {
            console.error("Error connecting to MySQL:", err);
            return;
        }
        console.log("Connected to MySQL");
    });
};

module.exports = { connectMongoDB, connectMySQL, mysqlConnection };