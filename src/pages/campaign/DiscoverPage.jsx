import { useState, useEffect } from 'react';
import CampaignCard from './components//CampaignCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCategories, getProjects } from '../../lib/projects';

const DiscoverPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState();


  const fetchData = async (url) => {
    setIsLoading(true);
    try {
      const [campaigns, allcategories] = await Promise.all([
        getProjects(url),
        getCategories(),
      ]);

      const data = campaigns.data;
      setCampaigns((prev) => {
        if (url) {
          return [...prev, ...data.results];
        } else {
          return data.results;
        }
      });
      setCategories(allcategories.data)
      setNextPageUrl(data.next);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Something went wrong while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoadMore = () => {
    if (nextPageUrl) {
      setIsLoading(true);
      fetchData(nextPageUrl);
    }
  }




  const filteredCampaigns = campaigns?.filter(campaign => {
    const matchesSearch = searchTerm === '' ||
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === '' || campaign.category_detail.title === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];



  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Campaigns</h1>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('')}
            size="sm"
          >
            All
          </Button>

          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.title)}
              size="sm"
            >
              {category.title}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>Error: {error}</p>
          <Button onClick={() => fetchCampaigns()} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              fetchCampaigns();
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {nextPageUrl && (
        <div className="text-center mt-4">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;