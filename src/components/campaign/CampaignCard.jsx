import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const CampaignCard = ({ campaign }) => {
  // Calculate percentage raised
  const percentRaised = Math.min(
    Math.round((campaign.raisedAmount / campaign.goalAmount) * 100),
    100
  );

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/campaign/${campaign.id}`}>
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
              {campaign.category}
            </span>
          </div>

          <h3 className="font-bold text-lg mb-2 line-clamp-2">{campaign.title}</h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {campaign.description}
          </p>

          <Progress value={percentRaised} className="h-2 mb-2" />

          <div className="flex justify-between text-sm mt-2">
            <div>
              <span className="font-bold">${campaign.raisedAmount.toLocaleString()}</span>
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
          {campaign.backers} backers
        </div>
        <div className="text-gray-500">
          {campaign.daysLeft} days left
        </div>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
