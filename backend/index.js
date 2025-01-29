const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const port = 3000;
require('dotenv').config();


// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors());

// Environment variables for sensitive data
const CONNECTWISE_DOMAIN = 'https://api-na.myconnectwise.net/v4_6_release/apis/3.0';

// generate auth header
function getAuthHeader() {
  const publicKey = process.env.PUBLIC_KEY;
  const privateKey = process.env.PRIVATE_KEY;
  const credentials = `techsavvy+${publicKey}:${privateKey}`;
  const encodedCredentials = Buffer.from(credentials).toString("base64");
  return `Basic ${encodedCredentials}`;
}


app.get('/', (req, res) => {
  res.send("Hello World!");
});

// Route to create a new ticket
app.post('/create-ticket', async (req, res) => {
  const { summary, initialDescription } = req.body;


  if (!summary || !initialDescription) {
    return res.status(400).json({ error: "Summary and Initial Description are required." });
  }

  try {
    // Define the ticket data
    const ticketData = {
      summary,
      recordType: 'ProjectIssue',
      board: {
        id: 1,
        name: 'Help Desk',
      },
      status: {
        id: 1,
        name: 'New',
      },
      company: {
        id: 19297,
        identifier: 'XYZTestCompany',
        name: 'XYZTestCompany',
      },

      initialDescription,
      severity: 'Low',
      impact: 'Low',
    };

    // Send the POST request to ConnectWise
    const response = await axios.post(
      `${CONNECTWISE_DOMAIN}/service/tickets`,
      ticketData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthHeader(),
          clientId: process.env.CLIENT_ID,
        },
      }
    );

    // Return the response from ConnectWise
    res.status(200).json({
      message: 'Ticket created successfully!',
      data: response.data,
    });
  } catch (error) {
    console.error('Error creating ticket:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: 'Failed to create ticket',
      error: error.response ? error.response.data : error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Your server is listening on port ${port}`);
});

