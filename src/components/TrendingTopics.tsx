import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { fetchYouTubeTrends, fetchInstagramTrends, fetchLinkedInTrends } from "@/lib/trendApis";
import { Youtube, Instagram, Linkedin } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

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
  const [tab, setTab] = useState("youtube");

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="flex justify-center gap-2 mb-6 bg-background rounded-xl p-2 shadow">
        <TabsTrigger value="youtube" className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-[#ff0000]/10 data-[state=active]:text-[#ff0000] transition">
          <Youtube className="w-5 h-5" /> YouTube
        </TabsTrigger>
        <TabsTrigger value="linkedin" className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-[#0077b5]/10 data-[state=active]:text-[#0077b5] transition">
          <Linkedin className="w-5 h-5" /> LinkedIn
        </TabsTrigger>
        <TabsTrigger value="instagram" className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-[#e1306c]/10 data-[state=active]:text-[#e1306c] transition">
          <Instagram className="w-5 h-5" /> Instagram
        </TabsTrigger>
      </TabsList>
      <TabsContent value="youtube">
        <Card className="p-4 md:p-8 bg-gradient-to-br from-[#ff0000]/10 to-[#fff] rounded-2xl shadow-lg border-0">
          <h3 className="text-xl font-extrabold tracking-tight text-[#ff0000] mb-4 flex items-center gap-2"><Youtube className="w-6 h-6" /> YouTube Trends</h3>
          {ytLoading && <div className="text-center text-muted-foreground py-8">Loading...</div>}
          <div className="space-y-4">
            {ytTrends && ytTrends.map((topic: any, idx: number) => (
              <div key={idx} className="p-4 bg-white/80 rounded-lg shadow hover:shadow-md transition flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                  <div className={`w-3 h-3 rounded-full ${getSentimentColor(topic.sentiment)}`}></div>
                  <h4 className="font-bold text-foreground">{topic.topic}</h4>
                  <Badge className="ml-2 text-xs bg-[#ff0000]/10 text-[#ff0000]">YouTube</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground items-center">
                  <span>Mentions: {topic.mentions}</span>
                  <span>Growth: +{topic.growth?.toFixed(1) ?? 0}%</span>
                  <span>Engagement: {topic.engagement}%</span>
                  <Progress value={topic.engagement} className="h-2 bg-[#ff0000]/10 w-24" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="linkedin">
        <Card className="p-4 md:p-8 bg-gradient-to-br from-[#0077b5]/10 to-[#fff] rounded-2xl shadow-lg border-0">
          <h3 className="text-xl font-extrabold tracking-tight text-[#0077b5] mb-4 flex items-center gap-2"><Linkedin className="w-6 h-6" /> LinkedIn Trends & Influencers</h3>
          {liLoading && <div className="text-center text-muted-foreground py-8">Loading...</div>}
          <div className="space-y-4">
            {liTrends && liTrends.map((topic: any, idx: number) => (
              <div key={idx} className="p-4 bg-white/80 rounded-lg shadow hover:shadow-md transition flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                  <div className={`w-3 h-3 rounded-full ${getSentimentColor(topic.sentiment)}`}></div>
                  <h4 className="font-bold text-foreground">{topic.topic}</h4>
                  <Badge className="ml-2 text-xs bg-[#0077b5]/10 text-[#0077b5]">LinkedIn</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground items-center">
                  <span>Mentions: {topic.mentions}</span>
                  <span>Growth: +{topic.growth?.toFixed(1) ?? 0}%</span>
                  <span>Engagement: {topic.engagement}%</span>
                  <Progress value={topic.engagement} className="h-2 bg-[#0077b5]/10 w-24" />
                </div>
                {/* Influencer Profile & Recent Activities */}
                {topic.influencer && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-xl w-full md:w-auto">
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
      </TabsContent>
      <TabsContent value="instagram">
        <Card className="p-4 md:p-8 bg-gradient-to-br from-[#e1306c]/10 to-[#fff] rounded-2xl shadow-lg border-0">
          <h3 className="text-xl font-extrabold tracking-tight text-[#e1306c] mb-4 flex items-center gap-2"><Instagram className="w-6 h-6" /> Instagram Trends & Influencers</h3>
          {igLoading && <div className="text-center text-muted-foreground py-8">Loading...</div>}
          <div className="space-y-4">
            {igTrends && igTrends.map((topic: any, idx: number) => (
              <div key={idx} className="p-4 bg-white/80 rounded-lg shadow hover:shadow-md transition flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                  <div className={`w-3 h-3 rounded-full ${getSentimentColor(topic.sentiment)}`}></div>
                  <h4 className="font-bold text-foreground">{topic.topic}</h4>
                  <Badge className="ml-2 text-xs bg-[#e1306c]/10 text-[#e1306c]">Instagram</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground items-center">
                  <span>Mentions: {topic.mentions}</span>
                  <span>Growth: +{topic.growth?.toFixed(1) ?? 0}%</span>
                  <span>Engagement: {topic.engagement}%</span>
                  <Progress value={topic.engagement} className="h-2 bg-[#e1306c]/10 w-24" />
                </div>
                {/* Influencer Profile & Recent Activities */}
                {topic.influencer && (
                  <div className="mt-3 p-3 bg-pink-50 rounded-xl w-full md:w-auto">
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
      </TabsContent>
    </Tabs>
  );
};
