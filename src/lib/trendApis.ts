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

// Fetch all trends (YouTube only)
export async function fetchAllTrends() {
  return await fetchYouTubeTrends();
} 