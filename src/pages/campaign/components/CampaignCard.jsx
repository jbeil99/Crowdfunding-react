import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { calculateDaysLeft } from '../../../lib/helpers';



const CampaignCard = ({ campaign }) => {
  const raisedAmount = campaign.total_donations || 0;
  const goalAmount = campaign.total_target || 1;
  const percentRaised = Math.min(
    Math.round((raisedAmount / goalAmount) * 100),
    100
  );


  const backers = campaign.backers_count || 0;
  const rating = campaign.rating || 0;
  const reviewCount = campaign.review_count || 0;

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={16}
          fill="#FFD700"
          color="#FFD700"
          className="mr-1"
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative mr-1">
          <Star size={16} color="#E5E7EB" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star size={16} fill="#FFD700" color="#FFD700" />
          </div>
        </div>
      );
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} color="#E5E7EB" className="mr-1" />);
    }

    return stars;
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/campaign/${campaign.id}`}>
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={campaign.thumbnail_url}
            alt={campaign.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            {campaign.category_detail && (
              <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
                {campaign.category_detail.title || "No Category"}
              </span>
            )}

            {/* Rating section */}
            <div className="flex items-center">
              <div className="flex mr-1">
                {renderRatingStars(rating)}
              </div>
              <span className="text-xs text-gray-500">({reviewCount})</span>
            </div>
          </div>

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
          {calculateDaysLeft(campaign)} days left
        </div>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;