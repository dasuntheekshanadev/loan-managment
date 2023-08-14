const express = require('express');
const multer = require('multer');
const Client = require('../models/client');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const clients = await Client.find({}, 'customerName');
    res.render('index', { clients, searchQuery: '' });
  } catch (error) {
    res.status(500).send('An error occurred');
  }
});

router.get('/details/:clientId', async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).send('Client not found');
    }
    res.render('client-details', { client });
  } catch (error) {
    res.status(500).send('An error occurred');
  }
});

router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery;
    const clients = await Client.find({ customerName: { $regex: searchQuery, $options: 'i' } }, 'customerName');
    res.render('index', { clients, searchQuery });
  } catch (error) {
    res.status(500).send('An error occurred');
  }
});

router.post('/add', upload.single('bankFile'), async (req, res) => {
  try {
    const { customerName, loanAmount, loanDuration } = req.body;
    const installmentAmount = loanAmount / loanDuration;

    const repaymentSchedule = Array.from({ length: loanDuration }, (_, index) =>
      installmentAmount * (index + 1)
    );

    const client = new Client({
      customerName,
      loanAmount,
      loanDuration,
      bankFile: req.file.filename,
      repaymentSchedule,
    });

    await client.save();

    res.redirect('/');
  } catch (error) {
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
