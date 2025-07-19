import { Bell, Settings, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const DashboardHeader = () => {
  return (
    <header className="bg-card border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">IM</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Influencer Monitor</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Social Intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search influencers, trends..."
                className="pl-10 w-64"
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Influencer
            </Button>

            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-destructive"></Badge>
            </div>

            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};