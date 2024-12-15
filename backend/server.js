require('dotenv').config();  // To use environment variables
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;  // Use the port from the environment or default to 5000

app.use(cors({
  origin: 'http://localhost:3000',  // Replace with the actual frontend URL if needed
}));  // To allow cross-origin requests from React frontend
app.use(express.json());  // To parse JSON requests

// Endpoint to call the Gemini API for generating the paper
app.post('/generate-paper', async (req, res) => {
  const { specifications } = req.body;

  try {
    const response = await axios.post(
      'https://api.gemini.com/generate',  // Replace with the actual API endpoint
      { data: specifications },  // Data to be sent to the Gemini API
      {
        headers: {
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,  // API key from environment variable
        }
      }
    );

    // Send the response from Gemini API back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error generating paper:', error);
    res.status(500).json({ message: 'Error generating paper', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
const path = require('path');

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});
