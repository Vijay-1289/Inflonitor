// backend/workflow.js
require('dotenv').config();
const cron = require('node-cron');
const fs = require('fs');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const { google } = require('googleapis');
const speech = require('@google-cloud/speech');
const nodemailer = require('nodemailer');

// Simulated functions for each step
async function fetchYouTubeVideos() {
  const apiKey = process.env.YOUTUBE_API_KEY || 'AIzaSyARMgkxpZBi71i6rO5ZBGRT5JXqy2LbTyI';
  // Example: fetch most popular videos in US
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=5&regionCode=US&key=${apiKey}`;
  try {
    const res = await axios.get(url);
    return res.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      url: `https://youtube.com/watch?v=${item.id}`,
      channel: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails?.default?.url,
      views: item.statistics?.viewCount,
      likes: item.statistics?.likeCount,
      comments: item.statistics?.commentCount,
    }));
  } catch (err) {
    console.error('YouTube API error:', err.response?.data || err.message);
    return [];
  }
}

async function downloadAndConvertToMP3(video) {
  const tmpDir = path.join(__dirname, '../tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
  const mp3Path = path.join(tmpDir, `${video.id}.mp3`);
  return new Promise((resolve, reject) => {
    const stream = ytdl(video.url, { quality: 'highestaudio' });
    ffmpeg({ source: stream })
      .setFfmpegPath(ffmpegPath)
      .audioBitrate(128)
      .format('mp3')
      .on('error', reject)
      .on('end', () => resolve(mp3Path))
      .save(mp3Path);
  });
}

// Google Drive upload using service account
async function uploadToGoogleDrive(mp3Path) {
  // Place your service account JSON in ./backend/service-account.json
  const keyFile = path.join(__dirname, 'service-account.json');
  if (!fs.existsSync(keyFile)) throw new Error('Google service account JSON not found.');
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: path.basename(mp3Path),
    // Optionally, specify parents: [FOLDER_ID]
  };
  const media = {
    mimeType: 'audio/mpeg',
    body: fs.createReadStream(mp3Path),
  };
  const res = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id',
  });
  const fileId = res.data.id;
  // Make file shareable
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
  });
  const link = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  return link;
}

// Google Sheets append using service account
async function storeInGoogleSheet(video, driveLink, transcript) {
  // Place your service account JSON in ./backend/service-account.json
  const keyFile = path.join(__dirname, 'service-account.json');
  if (!fs.existsSync(keyFile)) throw new Error('Google service account JSON not found.');
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const SHEET_ID = process.env.SHEET_ID || '1cbWLc5kK9MI8RTfYSoVSzNyYNL-L7qE1EnztlZzz3xg'; // <-- Set your Google Sheet ID here
  const range = 'Sheet1!A:F'; // Adjust as needed
  const values = [[
    video.title,
    video.url,
    video.channel,
    video.publishedAt,
    driveLink,
    transcript
  ]];
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
  console.log('Appended row to Google Sheet:', values[0]);
}

async function transcribeAudio(mp3Path) {
  // Use service account for authentication (already set up for Drive/Sheets)
  const client = new speech.SpeechClient({
    keyFilename: path.join(__dirname, 'service-account.json'),
  });
  const file = fs.readFileSync(mp3Path);
  const audioBytes = file.toString('base64');
  const audio = { content: audioBytes };
  const config = {
    encoding: 'MP3',
    sampleRateHertz: 44100,
    languageCode: 'en-US',
  };
  const request = { audio, config };
  try {
    const [response] = await client.recognize(request);
    const transcript = response.results?.map(r => r.alternatives[0].transcript).join(' ') || '';
    return transcript || 'No transcript available.';
  } catch (err) {
    console.error('Speech-to-Text error:', err.message);
    return 'Transcription failed.';
  }
}

async function summarizeTranscript(transcript) {
  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDjoopSWpStMoN7n2TQHRHBtz8z_WMWhFE';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  try {
    const res = await axios.post(url, {
      contents: [{ parts: [{ text: `Summarize this transcript:
${transcript}` }] }]
    });
    // Gemini API returns summary in res.data.candidates[0].content.parts[0].text
    return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary available.';
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    return 'Summary failed.';
  }
}

async function sendEmailToBrandTeam(summary) {
  // Configure these in your .env file
  const {
    SMTP_HOST = 'smtp.gmail.com',
    SMTP_PORT = 465,
    SMTP_USER,
    SMTP_PASS,
    BRAND_TEAM_EMAIL
  } = process.env;
  if (!SMTP_USER || !SMTP_PASS || !BRAND_TEAM_EMAIL) {
    console.error('Missing SMTP or recipient config in .env');
    return;
  }
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transporter.sendMail({
    from: SMTP_USER,
    to: BRAND_TEAM_EMAIL,
    subject: 'YouTube Video Summary Report',
    text: summary,
  });
  console.log('Summary email sent to brand team.');
}

// Main workflow
async function runWorkflow() {
  console.log('Workflow started:', new Date().toISOString());
  const videos = await fetchYouTubeVideos();
  for (const video of videos) {
    const mp3Path = await downloadAndConvertToMP3(video);
    const driveLink = await uploadToGoogleDrive(mp3Path);
    const transcript = await transcribeAudio(mp3Path);
    await storeInGoogleSheet(video, driveLink, transcript);
    const summary = await summarizeTranscript(transcript);
    await sendEmailToBrandTeam(summary);
  }
  console.log('Workflow finished:', new Date().toISOString());
}

// Schedule: every hour (change as needed)
cron.schedule('0 * * * *', runWorkflow);

// For manual testing
if (require.main === module) {
  runWorkflow();
} 