import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { toast } from 'sonner';

const CampaignDetail = ({ campaign }) => {
  const [isBackDialogOpen, setIsBackDialogOpen] = useState(false);
  const [pledgeAmount, setPledgeAmount] = useState('');

  // Calculate percentage raised
  const percentRaised = Math.min(
    Math.round((campaign.raisedAmount / campaign.goalAmount) * 100),
    100
  );

  const handlePledge = () => {
    // In a real app, this would connect to a payment processor
    toast.success(`Thank you for your support of $${pledgeAmount}!`);
    setIsBackDialogOpen(false);
    setPledgeAmount('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full rounded-lg aspect-video object-cover mb-6"
          />

          <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>

          <div className="mb-6">
            <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mr-2">
              {campaign.category}
            </span>
            <span className="text-gray-600 text-sm">
              by <strong>{campaign.creator}</strong>
            </span>
          </div>

          <div className="border-t border-b py-6 mb-6">
            <h2 className="text-xl font-bold mb-4">About this project</h2>
            <p className="text-gray-700 whitespace-pre-line">{campaign.longDescription}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Campaign Progress</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="mb-4">
                <div className="text-3xl font-bold">${campaign.raisedAmount.toLocaleString()}</div>
                <div className="text-sm text-gray-500">
                  raised of ${campaign.goalAmount.toLocaleString()} goal
                </div>
              </div>

              <Progress value={percentRaised} className="h-2 mb-4" />

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-xl font-bold">{percentRaised}%</div>
                  <div className="text-sm text-gray-500">Funded</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{campaign.backers}</div>
                  <div className="text-sm text-gray-500">Backers</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{campaign.daysLeft}</div>
                  <div className="text-sm text-gray-500">Days Left</div>
                </div>
              </div>

              <Dialog open={isBackDialogOpen} onOpenChange={setIsBackDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mb-2">Back this project</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Support this project</DialogTitle>
                    <DialogDescription>
                      Enter an amount you would like to contribute
                    </DialogDescription>
                  </DialogHeader>

                  <div className="py-4">
                    <label className="text-sm font-medium mb-2 block">
                      Pledge Amount ($)
                    </label>
                    <Input
                      type="number"
                      value={pledgeAmount}
                      onChange={(e) => setPledgeAmount(e.target.value)}
                      placeholder="10"
                      min="1"
                    />
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBackDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handlePledge} disabled={!pledgeAmount || pledgeAmount <= 0}>
                      Complete Pledge
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full">Share</Button>
            </CardContent>

            <CardFooter className="bg-gray-50 text-sm text-gray-500 border-t">
              <p>This project will only be funded if it reaches its goal by the deadline.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
