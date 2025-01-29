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

// Function to get all contacts with pagination
const getAllContacts = async () => {
    let allContacts = [];
    let page = 1;
    let pageSize = 100;  // Set to 1000 if API allows, but this ensures proper pagination.
    let totalPages = 1;  

    while (page <= totalPages) {
        try {
            const response = await axios.get(
                `${CONNECTWISE_DOMAIN}/company/contacts`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: getAuthHeader(),
                        clientId: process.env.CLIENT_ID,
                    },
                    params: {
                        page,     // Request the current page
                        pageSize, // Number of contacts per page
                    },
                }
            );

            if (!response.data || response.data.length === 0) break;  // Stop if no data is returned

            allContacts = [...allContacts, ...response.data];

            // Update totalPages if available
            if (response.headers['x-total-pages']) {
                totalPages = parseInt(response.headers['x-total-pages'], 10);
            } else {
                totalPages++; // Increment manually if header isn't provided
            }

            page++;  // Move to next page
        } catch (error) {
            console.error("Error fetching contacts:", error.message);
            break;
        }
    }

    return allContacts;
};
  
  // Call the function and log all contacts
  getAllContacts().then((contacts) => {
    console.log(`Retrieved ${contacts.length} contacts.`);
  }).catch((error) => {
    console.error("Error:", error);
  });

// Route to create a new ticket
app.post('/create-ticket', async (req, res) => {
  const { summary, initialDescription, contactemailaddress } = req.body;

// Step 1: Fetch all contacts
let contacts = [];
try {
  contacts = await getAllContacts(); // Wait for the contacts to be fetched
} catch (error) {
  return res.status(500).json({ error: "Failed to fetch contacts." });
}

  // Step 2: Filter manually in JavaScript
  const matchedContact = contacts.find(contact => 
    contact.communicationItems?.some(item => 
      item.communicationType === "Email" && item.value === contactemailaddress
    )
  );


  if (!summary || !initialDescription) {
    return res.status(400).json({ error: "Summary and Initial Description are required." });
  }

  let contactId = ""; // Default to empty if no match
  let companyId = 19298; // Default company ID
  let companyName = "catchall"; // Default company name

  if (matchedContact) {
    contactId = matchedContact.id;
    companyId = matchedContact.company?.id || companyId;
    companyName = matchedContact.company?.name || companyName; 
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
      contactemailaddress,
      contact: {
        id: contactId, // Use the found contact ID
      },

      company: {
        id: companyId,
        name: companyName,
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

