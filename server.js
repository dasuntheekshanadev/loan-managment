const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const clientController = require('./controller/clientController');

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/', clientController);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
