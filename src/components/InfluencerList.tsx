import { User, Instagram, Youtube, Linkedin, MoreVertical, Verified } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  platforms: Array<"instagram" | "youtube" | "linkedin">;
  followers: string;
  engagement: number;
  lastPost: string;
  category: string;
  verified: boolean;
  status: "active" | "inactive" | "monitoring";
}

export const InfluencerList = () => {
  const influencers: Influencer[] = [
    {
      id: "1",
      name: "Sarah Chen",
      handle: "@sarahchen",
      avatar: "/api/placeholder/40/40",
      platforms: ["instagram", "youtube"],
      followers: "2.3M",
      engagement: 4.2,
      lastPost: "2h ago",
      category: "Fashion",
      verified: true,
      status: "active"
    },
    {
      id: "2",
      name: "Tech Guru Mike",
      handle: "@techgurumike",
      avatar: "/api/placeholder/40/40",
      platforms: ["linkedin", "youtube"],
      followers: "890K",
      engagement: 3.8,
      lastPost: "5h ago",
      category: "Technology",
      verified: true,
      status: "monitoring"
    },
    {
      id: "3",
      name: "Fitness Queen",
      handle: "@fitnessqueen",
      avatar: "/api/placeholder/40/40",
      platforms: ["instagram"],
      followers: "1.5M",
      engagement: 5.1,
      lastPost: "1h ago",
      category: "Fitness",
      verified: false,
      status: "active"
    },
    {
      id: "4",
      name: "Food Explorer",
      handle: "@foodexplorer",
      avatar: "/api/placeholder/40/40",
      platforms: ["instagram", "youtube"],
      followers: "670K",
      engagement: 3.2,
      lastPost: "3h ago",
      category: "Food & Lifestyle",
      verified: true,
      status: "inactive"
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram": return <Instagram className="w-4 h-4" />;
      case "youtube": return <Youtube className="w-4 h-4" />;
      case "linkedin": return <Linkedin className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success";
      case "monitoring": return "bg-warning";
      case "inactive": return "bg-muted-foreground";
      default: return "bg-muted-foreground";
    }
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 4.5) return "text-success";
    if (engagement >= 3.5) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Monitored Influencers</h3>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {influencers.map((influencer) => (
          <div key={influencer.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={influencer.avatar} alt={influencer.name} />
                  <AvatarFallback>{influencer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(influencer.status)} border-2 border-background`}></div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-foreground">{influencer.name}</h4>
                  {influencer.verified && <Verified className="w-4 h-4 text-info" />}
                </div>
                <p className="text-sm text-muted-foreground">{influencer.handle}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">{influencer.category}</Badge>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{influencer.lastPost}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{influencer.followers}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              
              <div className="text-center">
                <p className={`text-sm font-medium ${getEngagementColor(influencer.engagement)}`}>
                  {influencer.engagement}%
                </p>
                <p className="text-xs text-muted-foreground">Engagement</p>
              </div>
              
              <div className="flex space-x-1">
                {influencer.platforms.map((platform) => (
                  <div key={platform} className="p-1 bg-primary/10 rounded text-primary">
                    {getPlatformIcon(platform)}
                  </div>
                ))}
              </div>
              
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};