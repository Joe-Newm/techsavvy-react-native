const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
require('dotenv').config();


// Middleware to parse JSON bodies
app.use(express.json());

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
    try {
      // Define the ticket data
      const ticketData = {
        summary: 'New Ticket Summary',
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
          id: 250,
          identifier: 'TechSavvy LLC',
          name: 'TechSavvy LLC',
        },
        contact: {
          id: 1,
          
        },
       
        initialDescription: 'This is an example ticket. Testing the api.',
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

console.log(process.env.PUBLIC_KEY)
console.log(process.env.PRIVATE_KEY)
