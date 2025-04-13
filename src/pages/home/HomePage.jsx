import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import CampaignSlider from './components/CampaignSlider';
import { getFeaturedProjects, getLatestProjects, getTopProjects } from '../../lib/projects';


const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);

  const handleStartCampaign = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in first to start a campaign",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    navigate('/start-campaign');
  };

  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [latestCampaigns, setLatestCampaigns] = useState([]);
  const [topRatedCampaigns, setTopRatedCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const [featured, latest, topRated] = await Promise.all([
          getFeaturedProjects(),
          getLatestProjects(),
          getTopProjects(),
        ]);

        if (featured.status !== 200 || latest.status !== 200 || topRated.status !== 200) {
          throw new Error('Failed to fetch some campaigns');
        }

        setFeaturedCampaigns(featured.data.results);
        setLatestCampaigns(latest.data.results);
        setTopRatedCampaigns(topRated.data.results);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

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
            <Button size="lg" onClick={handleStartCampaign}>
              Start a Campaign
            </Button>
            <Link to="/discover">
              <Button variant="outline" size="lg">
                Discover Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured campaigns */}
      <CampaignSlider title="Featured Campaigns" campaigns={featuredCampaigns} />

      {/* Top Rated campaigns */}
      <CampaignSlider title="Top Rated Projects" campaigns={topRatedCampaigns} />

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
      <CampaignSlider title="Latest Campaigns" campaigns={latestCampaigns} />
    </div>
  );
};

export default HomePage;