// YouTube Trending Topics
export async function fetchYouTubeTrends() {
  const apiKey = "AIzaSyARMgkxpZBi71i6rO5ZBGRT5JXqy2LbTyI";
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=10&regionCode=US&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch YouTube trends");
  const data = await res.json();
  return data.items.map((item: any) => ({
    topic: item.snippet.title,
    mentions: parseInt(item.statistics.commentCount || "0"),
    growth: Math.random() * 50, // Placeholder, as YouTube API doesn't provide growth
    sentiment: "neutral", // Placeholder
    platforms: ["YouTube"],
    engagement: Math.min(100, Math.round((parseInt(item.statistics.likeCount || "0") / (parseInt(item.statistics.viewCount || "1"))) * 100)),
  }));
}

// Instagram Trending Topics
export async function fetchInstagramTrends() {
  const url = "https://instagram120.p.rapidapi.com/api/instagram/hls";
  const res = await fetch(url, {
    method: "GET",
    headers: {
      'x-rapidapi-host': 'instagram120.p.rapidapi.com',
      'x-rapidapi-key': '0bb79fc647msh9d7d11c2803c88ap1d489bjsnc6834f6ec4cf',
    },
  });
  if (!res.ok) throw new Error("Failed to fetch Instagram trends");
  const data = await res.json();
  // Normalize as needed; here we assume 'data' is an array of trending posts
  return (data.data || []).slice(0, 10).map((item: any) => ({
    topic: item.caption || item.username || "Instagram Trend",
    mentions: Math.floor(Math.random() * 500), // Instagram API doesn't provide mentions
    growth: Math.random() * 50,
    sentiment: "neutral",
    platforms: ["Instagram"],
    engagement: Math.floor(Math.random() * 100),
  }));
}

// LinkedIn Trending Topics
export async function fetchLinkedInTrends() {
  const url = "https://linkedin-data-scraper-api1.p.rapidapi.com/profile/posts?username=satyanadella&page_number=1";
  const res = await fetch(url, {
    method: "GET",
    headers: {
      'x-rapidapi-host': 'linkedin-data-scraper-api1.p.rapidapi.com',
      'x-rapidapi-key': '0bb79fc647msh9d7d11c2803c88ap1d489bjsnc6834f6ec4cf',
    },
  });
  if (!res.ok) throw new Error("Failed to fetch LinkedIn trends");
  const data = await res.json();
  // Normalize as needed; here we assume 'data' is an array of posts
  return (data.data || []).slice(0, 10).map((item: any) => ({
    topic: item.text || item.title || "LinkedIn Trend",
    mentions: Math.floor(Math.random() * 200),
    growth: Math.random() * 50,
    sentiment: "neutral",
    platforms: ["LinkedIn"],
    engagement: Math.floor(Math.random() * 100),
  }));
}

// Fetch all trends in parallel and merge
export async function fetchAllTrends() {
  const [yt, ig, li] = await Promise.all([
    fetchYouTubeTrends().catch(() => []),
    fetchInstagramTrends().catch(() => []),
    fetchLinkedInTrends().catch(() => []),
  ]);
  return [...yt, ...ig, ...li];
} 