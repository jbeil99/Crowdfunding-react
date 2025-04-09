import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import CampaignDetail from '@/components/campaign/CampaignDetail';
import { campaigns } from '@/data/campaigns';

const CampaignDetailPage = () => {
  const { id } = useParams();

  // Find the campaign by ID
  const campaign = campaigns.find((c) => c.id === parseInt(id));

  // Handle case where campaign is not found
  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
        <p className="mb-6">The campaign you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>Return to Homepage</Button>
        </Link>
      </div>
    );
  }

  return <CampaignDetail campaign={campaign} />;
};

export default CampaignDetailPage;
