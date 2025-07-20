import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { fetchYouTubeTrends, fetchInstagramTrends, fetchLinkedInTrends } from "@/lib/trendApis";
import { Hash, TrendingUp, Clock, Youtube, Instagram, Linkedin } from "lucide-react";

const PanelHeader = ({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) => (
  <div className="flex items-center space-x-3 mb-6">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>{icon}</div>
    <h3 className={`text-xl font-extrabold tracking-tight ${color}`}>{title}</h3>
  </div>
);

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case "positive": return "bg-success";
    case "negative": return "bg-destructive";
    default: return "bg-muted-foreground";
  }
};

export const TrendingTopics = () => {
  const { data: ytTrends, isLoading: ytLoading } = useQuery({
    queryKey: ["youtube-trends"],
    queryFn: fetchYouTubeTrends,
  });
  const { data: igTrends, isLoading: igLoading } = useQuery({
    queryKey: ["instagram-trends"],
    queryFn: fetchInstagramTrends,
  });
  const { data: liTrends, isLoading: liLoading } = useQuery({
    queryKey: ["linkedin-trends"],
    queryFn: fetchLinkedInTrends,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* YouTube Panel */}
      <Card className="p-6 bg-gradient-to-br from-[#ff0000]/10 to-[#fff] rounded-2xl shadow-lg border-0">
        <PanelHeader icon={<Youtube className="w-6 h-6 text-[#ff0000]" />} title="YouTube Trends" color="text-[#ff0000]" />
        {ytLoading && <div className="text-center text-muted-foreground py-8">Loading...</div>}
        <div className="space-y-4">
          {ytTrends && ytTrends.map((topic: any, idx: number) => (
            <div key={idx} className="p-4 bg-white/80 rounded-lg shadow hover:shadow-md transition">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${getSentimentColor(topic.sentiment)}`}></div>
                <h4 className="font-bold text-foreground">{topic.topic}</h4>
                <Badge className="ml-2 text-xs bg-[#ff0000]/10 text-[#ff0000]">YouTube</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Mentions: {topic.mentions}</span>
                <span>Growth: +{topic.growth?.toFixed(1) ?? 0}%</span>
                <span>Engagement: {topic.engagement}%</span>
              </div>
              <Progress value={topic.engagement} className="h-2 bg-[#ff0000]/10" />
            </div>
          ))}
        </div>
      </Card>
      {/* LinkedIn Panel */}
      <Card className="p-6 bg-gradient-to-br from-[#0077b5]/10 to-[#fff] rounded-2xl shadow-lg border-0">
        <PanelHeader icon={<Linkedin className="w-6 h-6 text-[#0077b5]" />} title="LinkedIn Trends & Influencers" color="text-[#0077b5]" />
        {liLoading && <div className="text-center text-muted-foreground py-8">Loading...</div>}
        <div className="space-y-4">
          {liTrends && liTrends.map((topic: any, idx: number) => (
            <div key={idx} className="p-4 bg-white/80 rounded-lg shadow hover:shadow-md transition">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${getSentimentColor(topic.sentiment)}`}></div>
                <h4 className="font-bold text-foreground">{topic.topic}</h4>
                <Badge className="ml-2 text-xs bg-[#0077b5]/10 text-[#0077b5]">LinkedIn</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Mentions: {topic.mentions}</span>
                <span>Growth: +{topic.growth?.toFixed(1) ?? 0}%</span>
                <span>Engagement: {topic.engagement}%</span>
              </div>
              <Progress value={topic.engagement} className="h-2 bg-[#0077b5]/10" />
              {/* Influencer Profile & Recent Activities */}
              {topic.influencer && (
                <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <img src={topic.influencer.avatar} alt={topic.influencer.name} className="w-10 h-10 rounded-full border-2 border-[#0077b5]" />
                    <div>
                      <div className="font-bold text-[#0077b5]">{topic.influencer.name}</div>
                      <div className="text-xs text-muted-foreground">{topic.influencer.handle}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-xs mb-1">Recent Activities:</div>
                    <ul className="list-disc ml-5 text-xs">
                      {topic.influencer.activities?.map((act: string, i: number) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
      {/* Instagram Panel */}
      <Card className="p-6 bg-gradient-to-br from-[#e1306c]/10 to-[#fff] rounded-2xl shadow-lg border-0">
        <PanelHeader icon={<Instagram className="w-6 h-6 text-[#e1306c]" />} title="Instagram Trends & Influencers" color="text-[#e1306c]" />
        {igLoading && <div className="text-center text-muted-foreground py-8">Loading...</div>}
        <div className="space-y-4">
          {igTrends && igTrends.map((topic: any, idx: number) => (
            <div key={idx} className="p-4 bg-white/80 rounded-lg shadow hover:shadow-md transition">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${getSentimentColor(topic.sentiment)}`}></div>
                <h4 className="font-bold text-foreground">{topic.topic}</h4>
                <Badge className="ml-2 text-xs bg-[#e1306c]/10 text-[#e1306c]">Instagram</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Mentions: {topic.mentions}</span>
                <span>Growth: +{topic.growth?.toFixed(1) ?? 0}%</span>
                <span>Engagement: {topic.engagement}%</span>
              </div>
              <Progress value={topic.engagement} className="h-2 bg-[#e1306c]/10" />
              {/* Influencer Profile & Recent Activities */}
              {topic.influencer && (
                <div className="mt-3 p-3 bg-pink-50 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <img src={topic.influencer.avatar} alt={topic.influencer.name} className="w-10 h-10 rounded-full border-2 border-[#e1306c]" />
                    <div>
                      <div className="font-bold text-[#e1306c]">{topic.influencer.name}</div>
                      <div className="text-xs text-muted-foreground">{topic.influencer.handle}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-xs mb-1">Recent Activities:</div>
                    <ul className="list-disc ml-5 text-xs">
                      {topic.influencer.activities?.map((act: string, i: number) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
