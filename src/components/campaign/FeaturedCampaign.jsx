import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function FeaturedCampaign({ campaign }) {
  const percentFunded = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-900 text-white">
      <div className="absolute inset-0">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>

      <div className="relative px-6 py-12 sm:px-12 md:flex md:items-center md:justify-between md:py-16 lg:px-16">
        <div className="md:max-w-2xl lg:max-w-xl">
          <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-sm font-medium text-white">
            {campaign.category}
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {campaign.title}
          </h2>

          <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl">
            {campaign.description}
          </p>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium">${campaign.raised.toLocaleString()} raised of ${campaign.goal.toLocaleString()}</span>
              <span>{percentFunded}% funded</span>
            </div>
            <Progress value={percentFunded} className="h-2 bg-gray-700" />

            <div className="mt-2 flex justify-between text-sm">
              <span>{campaign.backers} backers</span>
              <span>{campaign.daysLeft} days left</span>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <Link to={`/campaign/${campaign.id}`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                View Campaign
              </Button>
            </Link>
            <Link to={`/campaign/${campaign.id}#back`}>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Back This Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
