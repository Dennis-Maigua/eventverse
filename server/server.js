const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const contactRoutes = require('./routes/contact');

const port = process.env.PORT || 8000;

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('MongoDB is connected successfully'))
    .catch(err => console.log(err));

// app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', contactRoutes);

app.listen(port, () => {
    console.log(`API server is running on port ${port}`);
});