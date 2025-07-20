import { Hash, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { fetchAllTrends } from "@/lib/trendApis";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, XCircle } from "lucide-react";

interface TrendingTopic {
  topic: string;
  mentions: number;
  growth: number;
  sentiment: "positive" | "negative" | "neutral";
  platforms: string[];
  engagement: number;
}

export const TrendingTopics = () => {
  const [brand, setBrand] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const popularBrands = [
    "Nike",
    "Adidas",
    "Apple",
    "Tesla",
    "Google",
    "Amazon",
    "Microsoft",
    "Coca-Cola",
    "Samsung"
  ];
  const { data: topics, isLoading, isError } = useQuery({
    queryKey: ["trending-topics"],
    queryFn: fetchAllTrends,
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-success";
      case "negative": return "bg-destructive";
      default: return "bg-muted-foreground";
    }
  };

  // Filter topics by brand (LinkedIn included)
  const filteredTopics =
    !brand.trim()
      ? topics
      : (topics || []).filter((topic: any) =>
          topic.topic?.toLowerCase().includes(brand.toLowerCase())
        );

  return (
    <Card className="p-6 shadow-xl bg-gradient-to-br from-background to-secondary/40 border-2 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Hash className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="text-2xl font-extrabold text-foreground tracking-tight drop-shadow">Trending Topics</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 animate-spin-slow" />
          <span>Last 48 hours</span>
        </div>
      </div>
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="relative w-full max-w-md">
          <Input
            ref={inputRef}
            value={brand}
            onChange={e => setBrand(e.target.value)}
            placeholder="Type any brand name (e.g. Nike, Apple, your brand...)"
            className="pl-10 pr-10 py-3 rounded-xl border-2 border-primary/30 shadow focus:border-primary focus:ring-2 focus:ring-primary/30 text-lg bg-white/80 backdrop-blur"
            autoFocus
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5 opacity-80" />
          {brand && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => { setBrand(""); inputRef.current?.focus(); }}
              aria-label="Clear"
              type="button"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
        {brand.length < 2 && (
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {popularBrands.map(b => (
              <button
                key={b}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-all shadow-sm"
                onClick={() => setBrand(b)}
                type="button"
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </div>
      {isLoading && <div className="text-center text-muted-foreground py-8 animate-pulse">Loading trends...</div>}
      {isError && <div className="text-center text-destructive py-8">Failed to load trends. Please try again later.</div>}
      <div className="space-y-4">
        {filteredTopics && filteredTopics.length === 0 && !isLoading && !isError && (
          <div className="text-center text-muted-foreground py-8">No trends found for this brand.</div>
        )}
        {filteredTopics && filteredTopics.map((topic: any, index: number) => (
          <div
            key={index}
            className="p-4 bg-secondary/30 rounded-xl hover:bg-primary/10 transition-transform duration-300 shadow-md group animate-fade-in-up"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getSentimentColor(topic.sentiment)} group-hover:scale-125 transition-transform`}></div>
                <h4 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{topic.topic}</h4>
                <div className="flex items-center space-x-1 text-success text-sm">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{topic.growth?.toFixed(1) ?? 0}%</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{topic.mentions} mentions</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex space-x-1">
                {topic.platforms.map((platform: string) => (
                  <Badge key={platform} variant="outline" className="text-xs group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    {platform}
                  </Badge>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{topic.engagement}% engagement</span>
            </div>
            <Progress value={topic.engagement} className="h-2 group-hover:bg-primary/30 transition-colors" />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(.23,1.01,.32,1) both;
        }
        .animate-spin-slow {
          animation: spin 2.5s linear infinite;
        }
      `}</style>
    </Card>
  );
};