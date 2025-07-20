const express = require('express');
const cors = require('cors');
const { runWorkflow } = require('./workflow');

const app = express();
app.use(cors());
app.use(express.json());

let lastStatus = 'idle';
let lastResult = null;

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
}); 