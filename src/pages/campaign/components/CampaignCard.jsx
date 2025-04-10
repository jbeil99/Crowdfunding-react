import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const CampaignCard = ({ campaign }) => {
  const imageUrl = campaign.thumbnail || "/api/placeholder/400/225";

  const raisedAmount = campaign.total_donations || 0;
  const goalAmount = campaign.total_target || 1;
  const percentRaised = Math.min(
    Math.round((raisedAmount / goalAmount) * 100),
    100
  );

  const calculateDaysLeft = () => {
    if (!campaign.end_time) return "N/A";
    const endDate = new Date(campaign.end_time);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const backers = campaign.backers_count || 0;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/campaign/${campaign.id}`}>
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={campaign.thumbnail}
            alt={campaign.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>

        <CardContent className="p-4">
          {campaign.category && (
            <div className="mb-2">
              <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
                {campaign.category.title || "No Category"}
              </span>
            </div>
          )}

          <h3 className="font-bold text-lg mb-2 line-clamp-2">{campaign.title}</h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {campaign.description}
          </p>

          <Progress value={percentRaised} className="h-2 mb-2" />

          <div className="flex justify-between text-sm mt-2">
            <div>
              <span className="font-bold">${raisedAmount.toLocaleString()}</span>
              <span className="text-gray-500 ml-1">raised</span>
            </div>
            <div>
              <span className="font-bold">{percentRaised}%</span>
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="border-t p-4 flex justify-between text-sm">
        <div className="text-gray-500">
          {backers} backers
        </div>
        <div className="text-gray-500">
          {calculateDaysLeft()} days left
        </div>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;