import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import CampaignDetail from './components/CampaignDetail';
import { getProject } from '../../lib/projects';

const CampaignDetailPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchCampaign = async () => {
    setIsLoading(true);
    try {
      const response = await getProject(id);
      if (response.status !== 200) {
        throw new Error('Failed to fetch campaign');
      }

      setCampaign(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };




  useEffect(() => {
    fetchCampaign();
  }, []);
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
  return <>
    {isLoading ? (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    ) : error ? (
      <div className="text-center py-12 text-red-500">
        <p>Error: {error}</p>
        <Button onClick={() => fetchCampaign()} className="mt-4">
          Try Again
        </Button>
      </div>
    ) : <CampaignDetail campaign={campaign} />}
  </>
};

export default CampaignDetailPage;
