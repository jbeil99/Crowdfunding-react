import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CampaignCard from '@/components/campaign/CampaignCard';
import { campaigns } from '@/data/campaigns';

// Categories with icons
const categories = [
  { name: 'Technology', icon: '💻' },
  { name: 'Arts', icon: '🎨' },
  { name: 'Education', icon: '📚' },
  { name: 'Environment', icon: '🌱' },
  { name: 'Health', icon: '🩺' },
  { name: 'Community', icon: '🏙️' },
];

const HomePage = () => {
  const [filter, setFilter] = useState('trending');

  // Get featured campaigns (in a real app, these might be most funded, newest, etc.)
  const featuredCampaigns = campaigns.slice(0, 3);
  const otherCampaigns = campaigns.slice(3);

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gray-50 py-12 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Bring Your Ideas to Life
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            FundRaiser helps creators and communities raise funds and bring creative projects to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/start-campaign">
              <Button size="lg">Start a Campaign</Button>
            </Link>
            <Link to="/discover">
              <Button variant="outline" size="lg">
                Discover Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured campaigns */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Campaigns</h2>
            <Link to="/discover" className="text-primary hover:underline">
              View all campaigns
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Explore Categories</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Technology', 'Arts', 'Community', 'Environment', 'Education', 'Health', 'Film', 'Music'].map((category) => (
              <Link to={`/category/${category.toLowerCase()}`} key={category} className="group">
                <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all border">
                  <h3 className="font-medium group-hover:text-primary">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Create a Campaign</h3>
              <p className="text-gray-600">
                Share your story, set a funding goal, and choose a timeline.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Spread the Word</h3>
              <p className="text-gray-600">
                Share your campaign with friends, family, and social networks.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Get Funded</h3>
              <p className="text-gray-600">
                Receive funds when you reach your goal and bring your idea to life.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/how-it-works">
              <Button variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* More campaigns */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">More Projects to Explore</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/discover">
              <Button variant="outline">Discover More</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
