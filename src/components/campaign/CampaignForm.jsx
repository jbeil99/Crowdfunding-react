import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categories = [
  "Technology",
  "Community",
  "Education",
  "Environment",
  "Health",
  "Arts",
  "Film",
  "Music",
  "Publishing",
  "Fashion",
  "Food",
  "Games",
  "Sports",
  "Design",
  "Animals",
  "Product"
];

const CampaignForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    longDescription: '',
    goalAmount: '',
    image: '',
    daysToRun: 30
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCategoryChange = (value) => {
    setFormData({
      ...formData,
      category: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.title || !formData.category || !formData.description ||
        !formData.longDescription || !formData.goalAmount || !formData.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, we would send this data to an API
    console.log('Campaign data:', formData);

    // Show success message
    toast.success('Campaign created successfully!');

    // Redirect to home page after creation
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Start a Campaign</CardTitle>
          <CardDescription>
            Fill in the details to create your crowdfunding campaign.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Campaign Title *
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a clear, specific title"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category *
              </label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Short Description *
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a compelling short description (1-2 sentences)"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="longDescription" className="text-sm font-medium">
                Campaign Story *
              </label>
              <Textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                placeholder="Explain your campaign in detail, including what the funds will be used for"
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="goalAmount" className="text-sm font-medium">
                Funding Goal ($) *
              </label>
              <Input
                id="goalAmount"
                name="goalAmount"
                type="number"
                value={formData.goalAmount}
                onChange={handleChange}
                placeholder="Enter amount in USD"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Campaign Image URL *
              </label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter the URL of your campaign image"
                required
              />
              <p className="text-xs text-gray-500">
                This will be the main image for your campaign. Use a high-quality image that represents your project.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="daysToRun" className="text-sm font-medium">
                Campaign Duration (Days) *
              </label>
              <Input
                id="daysToRun"
                name="daysToRun"
                type="number"
                value={formData.daysToRun}
                onChange={handleChange}
                min="1"
                max="90"
                required
              />
              <p className="text-xs text-gray-500">
                The number of days your campaign will accept funding (maximum 90 days).
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" type="button" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit">Create Campaign</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CampaignForm;
