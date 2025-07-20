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

async function storeInGoogleSheet(video, driveLink, transcript) {
  // TODO: Use Google Sheets API to append row
  console.log('Storing in Google Sheet:', { video, driveLink, transcript });
}

async function transcribeAudio(mp3Path) {
  // TODO: Use Google Speech-to-Text or OpenAI Whisper
  return 'This is a simulated transcript of the video.';
}

async function summarizeTranscript(transcript) {
  // TODO: Use OpenAI API to summarize
  return 'This is a simulated summary of the transcript.';
}

async function sendEmailToBrandTeam(summary) {
  // TODO: Use SendGrid, Gmail API, or Nodemailer
  console.log('Sending email to brand team:', summary);
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