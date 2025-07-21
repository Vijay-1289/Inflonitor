import { FileText, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reports = [
  { title: "1 Progressive vs 20 Far-Right Conservatives (ft. Mehdi Hasan)", mentions: 42810, growth: "17.3%", engagement: "4%", sentiment: "neutral", platform: "YouTube" },
  { title: "Survive 100 Days Trapped In A Private Jet, Keep It", mentions: 32399, growth: "34.7%", engagement: "3%", sentiment: "neutral", platform: "YouTube" },
  { title: "Pacquiao vs Barrios HIGHLIGHTS: July 19, 2025 | PBC on Prime Video PPV", mentions: 5456, growth: "17.4%", engagement: "1%", sentiment: "neutral", platform: "YouTube" },
  { title: "AJ Styles Returns To TNA After 11 Years | TNA Slammiversary 2025 Highlights", mentions: 2810, growth: "22.2%", engagement: "4%", sentiment: "neutral", platform: "YouTube" },
  { title: "ATTEMPTING TO START THE FLOODED ASTON MARTIN DBX THAT I BOUGHT MY DAD", mentions: 5280, growth: "28.6%", engagement: "8%", sentiment: "neutral", platform: "YouTube" },
  { title: "FULL FIGHT HIGHLIGHTS | Manny Pacquiao vs Mario Barrios | Prime Video PPV", mentions: 4145, growth: "9.8%", engagement: "1%", sentiment: "neutral", platform: "YouTube" },
  { title: "THE HARDEST STEAK CHALLENGE I'VE DONE IN YEARS! | BeardMeatsFood", mentions: 5630, growth: "5.8%", engagement: "8%", sentiment: "neutral", platform: "YouTube" },
  { title: "I Bought An Abandoned Storage Unit and Made $____", mentions: 4737, growth: "8.5%", engagement: "3%", sentiment: "neutral", platform: "YouTube" },
  { title: "Max Holloway vs Dustin Poirier 3 - FULL FIGHT RECAP", mentions: 1615, growth: "19.2%", engagement: "8%", sentiment: "neutral", platform: "YouTube" },
  { title: "FULL FIGHT HIGHLIGHTS | Isaac Cruz vs Omar Salcido | Prime Video PPV", mentions: 1155, growth: "9.1%", engagement: "1%", sentiment: "neutral", platform: "YouTube" },
];

export const RecentReports = () => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <CardTitle>Recent Trend Reports</CardTitle>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {reports.map((report, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{report.title}</p>
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>Mentions: {report.mentions}</span>
                <span>Growth: {report.growth}</span>
                <span>Engagement: {report.engagement}</span>
                <span>Sentiment: {report.sentiment}</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">{report.platform}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
); 