import { Hash, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { fetchAllTrends } from "@/lib/trendApis";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Sparkles, Search } from "lucide-react";
import { useRef } from "react";
import clsx from "clsx";

interface TrendingTopic {
  topic: string;
  mentions: number;
  growth: number;
  sentiment: "positive" | "negative" | "neutral";
  platforms: string[];
  engagement: number;
}

// Brand theme mapping
const brandThemes: Record<string, { gradient: string; accent: string; icon: string }> = {
  Nike: {
    gradient: "from-[#111] to-[#4F8A10]", // black to Nike green
    accent: "text-[#4F8A10]",
    icon: "text-[#4F8A10]",
  },
  Adidas: {
    gradient: "from-[#fff] to-[#1D428A]", // white to Adidas blue
    accent: "text-[#1D428A]",
    icon: "text-[#1D428A]",
  },
  Apple: {
    gradient: "from-[#f5f5f7] to-[#a2aaad]", // Apple silver
    accent: "text-[#a2aaad]",
    icon: "text-[#a2aaad]",
  },
  Tesla: {
    gradient: "from-[#e82127] to-[#111]", // Tesla red to black
    accent: "text-[#e82127]",
    icon: "text-[#e82127]",
  },
  Google: {
    gradient: "from-[#4285F4] via-[#34A853] to-[#FBBC05]", // Google blue-green-yellow
    accent: "text-[#4285F4]",
    icon: "text-[#4285F4]",
  },
  Amazon: {
    gradient: "from-[#FF9900] to-[#232F3E]", // Amazon orange to dark
    accent: "text-[#FF9900]",
    icon: "text-[#FF9900]",
  },
  Microsoft: {
    gradient: "from-[#F25022] via-[#7FBA00] to-[#00A4EF]", // Microsoft orange-green-blue
    accent: "text-[#00A4EF]",
    icon: "text-[#00A4EF]",
  },
  "Coca-Cola": {
    gradient: "from-[#F40009] to-[#fff]", // Coke red to white
    accent: "text-[#F40009]",
    icon: "text-[#F40009]",
  },
  Samsung: {
    gradient: "from-[#1428A0] to-[#fff]", // Samsung blue to white
    accent: "text-[#1428A0]",
    icon: "text-[#1428A0]",
  },
};

export const TrendingTopics = () => {
  const [brand, setBrand] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const brands = [
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: topics, isLoading, isError, refetch } = useQuery({
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

  // Filter topics by brand
  const filteredTopics =
    !brand
      ? topics
      : (topics || []).filter((topic: any) =>
          topic.topic?.toLowerCase().includes(brand.toLowerCase())
        );

  // Handle input change and autocomplete
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setBrand(e.target.value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setBrand(suggestion);
    inputRef.current?.blur();
  };

  // Determine theme based on brand
  const theme = brandThemes[brand] || {
    gradient: "from-primary/10 to-secondary/30",
    accent: "text-primary",
    icon: "text-primary",
  };

  return (
    <Card
      className={clsx(
        "p-8 shadow-2xl rounded-3xl border-0 relative overflow-hidden animate-fade-in transition-all duration-700",
        `bg-gradient-to-br ${theme.gradient}`
      )}
    >
      <div className="absolute -top-8 -right-8 opacity-20 pointer-events-none select-none">
        <Sparkles className={clsx("w-32 h-32 animate-spin-slow transition-colors duration-700", theme.icon)} />
      </div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Hash className={clsx("w-7 h-7 drop-shadow-lg animate-bounce transition-colors duration-700", theme.icon)} />
          <h3 className={clsx("text-2xl font-extrabold tracking-tight drop-shadow transition-colors duration-700", theme.accent)}>Trending Topics</h3>
        </div>
        <div className="flex items-center space-x-2 text-base text-muted-foreground">
          <Clock className={clsx("w-5 h-5 animate-pulse transition-colors duration-700", theme.icon)} />
          <span>Last 48 hours</span>
        </div>
      </div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4 gap-2">
        <div className="relative w-full md:w-80">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type or select a brand (e.g. Nike, Apple, Tesla...)"
            className="pl-10 pr-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-lg shadow-md bg-white/80 backdrop-blur"
            onKeyDown={e => { if (e.key === 'Enter') setBrand(inputValue); }}
            autoComplete="off"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5 opacity-70" />
          {inputValue && brands.filter(b => b.toLowerCase().includes(inputValue.toLowerCase()) && b.toLowerCase() !== inputValue.toLowerCase()).length > 0 && (
            <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-primary/10 max-h-40 overflow-y-auto animate-fade-in">
              {brands.filter(b => b.toLowerCase().includes(inputValue.toLowerCase()) && b.toLowerCase() !== inputValue.toLowerCase()).map(b => (
                <div
                  key={b}
                  className="px-4 py-2 cursor-pointer hover:bg-primary/10 text-primary font-semibold rounded-xl transition-colors"
                  onClick={() => handleSuggestionClick(b)}
                >
                  {b}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          className="mt-2 md:mt-0 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
          onClick={() => refetch()}
        >
          <Sparkles className="inline-block w-5 h-5 mr-2 animate-pulse" />
          Discover Trends
        </button>
      </div>
      {isLoading && <div className="text-center text-muted-foreground py-12 text-xl animate-pulse">Loading trends...</div>}
      {isError && <div className="text-center text-destructive py-12 text-xl">Failed to load trends. Please try again later.</div>}
      <div className="space-y-6 mt-4">
        {filteredTopics && filteredTopics.length === 0 && !isLoading && !isError && (
          <div className="text-center text-muted-foreground py-12 text-xl">No trends found for this brand.</div>
        )}
        {filteredTopics && filteredTopics.map((topic: any, index: number) => (
          <div
            key={index}
            className="p-6 bg-white/90 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-l-8 border-primary/40 group relative overflow-hidden animate-fade-in"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${getSentimentColor(topic.sentiment)} animate-pulse`}></div>
                <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                  {topic.topic}
                </h4>
                <div className="flex items-center space-x-1 text-success text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{topic.growth?.toFixed(1) ?? 0}%</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground font-semibold">{topic.mentions} mentions</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex space-x-2">
                {topic.platforms.map((platform: string) => (
                  <Badge key={platform} variant="outline" className="text-xs px-2 py-1 bg-primary/10 text-primary font-semibold rounded-lg">
                    {platform}
                  </Badge>
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-semibold">{topic.engagement}% engagement</span>
            </div>
            <Progress value={topic.engagement} className="h-2 rounded-full bg-primary/10" />
            {/* LinkedIn extra: show LinkedIn icon if platform includes LinkedIn */}
            {topic.platforms.includes("LinkedIn") && (
              <div className="absolute top-2 right-4 flex items-center space-x-1 text-blue-700 font-bold animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.785-1.75-1.75s.784-1.75 1.75-1.75 1.75.785 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2 3.6 4.59v5.606z"/></svg>
                <span>LinkedIn</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};