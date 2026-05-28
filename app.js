const express = require('express');

const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    "https://chatbotekia.netlify.app",
    "https://chatbotekia-adm.netlify.app"
  ]
}));

app.use(express.json());

module.exports = app;
