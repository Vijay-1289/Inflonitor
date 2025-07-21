const express = require('express');
const cors = require('cors');
const { runWorkflow } = require('./workflow.cjs');
const { google } = require('googleapis');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

let lastStatus = 'idle';
let lastResult = null;

const serviceAccountKeyFile = path.join(__dirname, 'service-account.json');

const auth = new google.auth.GoogleAuth({
  keyFile: serviceAccountKeyFile,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheetId = '1mbS9KgNxRt2EFBGIux5NpvDNC_Uz3b_b0gQQ-V0-EmY';
const range = 'Sheet1!A1:D';

app.post('/api/run-workflow', async (req, res) => {
  lastStatus = 'running';
  try {
    await runWorkflow();
    lastStatus = 'success';
    lastResult = { message: 'Workflow completed successfully.' };
    res.json({ status: 'ok' });
  } catch (err) {
    lastStatus = 'error';
    lastResult = { error: err.message };
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.get('/api/status', (req, res) => {
  res.json({ status: lastStatus });
});

app.get('/api/results', (req, res) => {
  res.json(lastResult || { message: 'No results yet.' });
});

app.get('/api/sheet-data', async (req, res) => {
  try {
    const authClient = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: authClient });

    const getSheetData = await googleSheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });

    const values = getSheetData.data.values;
    if (!values || values.length === 0) {
      return res.json([]);
    }

    const headers = values[0];
    const data = values.slice(1).map(row => {
      let rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });

    res.json(data);
  } catch (err) {
    console.error('Error fetching sheet data:', err);
    res.status(500).json({ status: 'error', error: 'Failed to fetch sheet data' });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
}); 