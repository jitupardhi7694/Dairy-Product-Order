const express = require('express');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('layout', 'layout/main_layout');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ limit: 60, extended: false }));

// app routes start
app.use('/', require('./routes/homeRoute'));
app.use('/user', require('./routes/userRoute'));
// app routes end

app.listen(PORT, (err) => {
    if (err) throw err;
    else {
        console.log('server  running on port http://localhost:5000');
    }
});
