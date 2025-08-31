import { Card, CardContent } from "@/components/ui/card";
import { Star, TrendingUp, Users, Trophy, Clock, Medal } from "lucide-react";

interface ScoreCardsProps {
  result: {
    overallScore: string;
    shiftAverage: string;
    categoryAverage: string;
    overallRank: number;
    shiftRank: number;
    categoryRank: number;
    maxScore: string;
  };
  candidate: {
    category: string;
  };
}

export default function ScoreCards({ result, candidate }: ScoreCardsProps) {
  const cards = [
    {
      title: "Overall Score",
      value: parseFloat(result.overallScore).toFixed(1),
      subtitle: `out of ${parseFloat(result.maxScore).toFixed(0)}`,
      icon: Star,
      gradient: "from-blue-500 to-blue-600",
      testId: "card-overall-score"
    },
    {
      title: "Shift Average",
      value: parseFloat(result.shiftAverage).toFixed(1),
      subtitle: "You're above average!",
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      testId: "card-shift-average"
    },
    {
      title: "Category Average",
      value: parseFloat(result.categoryAverage).toFixed(1),
      subtitle: `${candidate.category} Category`,
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      testId: "card-category-average"
    },
    {
      title: "Overall Rank",
      value: result.overallRank.toLocaleString(),
      subtitle: "among all students",
      icon: Trophy,
      gradient: "from-orange-500 to-orange-600",
      testId: "card-overall-rank"
    },
    {
      title: "Shift Rank",
      value: result.shiftRank.toLocaleString(),
      subtitle: "in your shift",
      icon: Clock,
      gradient: "from-pink-500 to-pink-600",
      testId: "card-shift-rank"
    },
    {
      title: "Category Rank",
      value: result.categoryRank.toLocaleString(),
      subtitle: `in ${candidate.category} category`,
      icon: Medal,
      gradient: "from-indigo-500 to-indigo-600",
      testId: "card-category-rank"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card 
            key={index}
            className={`bg-gradient-to-br ${card.gradient} text-white rounded-xl shadow-lg border-0`}
            data-testid={card.testId}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <IconComponent className="h-6 w-6 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-2" data-testid={`text-${card.testId}-value`}>
                {card.value}
              </div>
              <div className="text-white/80 text-sm" data-testid={`text-${card.testId}-subtitle`}>
                {card.subtitle}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
