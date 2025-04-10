import { useState, useEffect } from 'react';
import CampaignCard from './components//CampaignCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DiscoverPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1
  });

  const fetchCampaigns = async (url) => {
    setIsLoading(true);
    try {
      // Use the provided URL or default to the first page
      const apiUrl = url || 'http://127.0.0.1:8000/api/projects/';
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const data = await response.json();

      setCampaigns(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        currentPage: getPageNumberFromUrl(url) || 1
      });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to extract page number from URL
  const getPageNumberFromUrl = (url) => {
    if (!url) return 1;
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1]) : 1;
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // We need to ensure campaigns exists before getting categories
  const categories = campaigns?.length ? [...new Set(campaigns.map(campaign => campaign.category).filter(Boolean))] : [];

  const filteredCampaigns = campaigns?.filter(campaign => {
    const matchesSearch = searchTerm === '' ||
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === '' || campaign.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }) || [];

  const handleNextPage = () => {
    if (pagination.next) {
      fetchCampaigns(pagination.next);
    }
  };

  const handlePrevPage = () => {
    if (pagination.previous) {
      fetchCampaigns(pagination.previous);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(pagination.count / (campaigns.length || 10));

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
              onClick={() => setSelectedCategory(category)}
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

          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-8">
            <div className="text-sm text-gray-500">
              Showing page {pagination.currentPage} of {totalPages} ({pagination.count} total campaigns)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={!pagination.previous}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!pagination.next}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
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
    </div>
  );
};

export default DiscoverPage;