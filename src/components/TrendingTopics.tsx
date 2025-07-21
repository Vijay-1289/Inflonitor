import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Youtube } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

const trends = [
    { topic: "1 Progressive vs 20 Far-Right Conservatives (ft. Mehdi Hasan)", mentions: 42810, growth: "17.3%", engagement: 4, sentiment: "neutral", platform: "YouTube" },
    { topic: "Survive 100 Days Trapped In A Private Jet, Keep It", mentions: 32399, growth: "34.7%", engagement: 3, sentiment: "neutral", platform: "YouTube" },
    { topic: "Pacquiao vs Barrios HIGHLIGHTS: July 19, 2025 | PBC on Prime Video PPV", mentions: 5456, growth: "17.4%", engagement: 1, sentiment: "neutral", platform: "YouTube" },
];

const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-500";
      case "negative": return "bg-red-500";
      default: return "bg-gray-500";
    }
};

export const TrendingTopics = () => {
  const [tab, setTab] = useState("youtube");

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="youtube" className="flex items-center gap-2">
          <Youtube className="w-5 h-5" /> YouTube
        </TabsTrigger>
      </TabsList>
      <TabsContent value="youtube">
        <Card className="p-6">
          <div className="space-y-4">
            {trends.map((topic, idx) => (
              <div key={idx} className="p-4 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getSentimentColor(topic.sentiment)}`}></div>
                        <h4 className="font-medium">{topic.topic}</h4>
                    </div>
                    <Badge variant="outline">{topic.platform}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span>Mentions: {topic.mentions}</span>
                  <span>Growth: {topic.growth}</span>
                  <span>Engagement: {topic.engagement}%</span>
                  <Progress value={topic.engagement} className="h-2 w-24" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}; 