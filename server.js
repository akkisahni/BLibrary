const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('BOOK_LIBRARY');
const morgan = require('morgan');

const connectDB = require('./config/db');

const app = express();
app.use(morgan('tiny'));

// Connect the Database
connectDB();

// Use Middleware
app.use(express.json({extended :  false}));

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/books', require('./routes/api/books'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/users', require('./routes/api/users'))



// Yet to implement the fetching the config variables e.g. port, db url, etc
app.listen(3000, ()=>{
    debug("Server is running on port");
});