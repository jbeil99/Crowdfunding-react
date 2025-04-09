import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const CreateCampaignPage = () => {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    goal: '',
    duration: '30',
    description: '',
    story: '',
    image: null,
  });

  const categories = [
    'Technology',
    'Arts',
    'Education',
    'Environment',
    'Health',
    'Community',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Campaign created successfully!');
    // Here you would typically submit the form data to your backend
  };

  const nextStep = () => {
    setFormStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setFormStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary">
          <span className="mr-1">←</span>
          Back to Home
        </Link>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Create Your Campaign</h1>
          <p className="text-gray-600">
            Share your idea with the world and get the funding you need to make it happen.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-between text-sm">
              <span
                className={`rounded-full px-4 py-1 font-medium ${
                  formStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                1. Basics
              </span>
              <span
                className={`rounded-full px-4 py-1 font-medium ${
                  formStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                2. Story
              </span>
              <span
                className={`rounded-full px-4 py-1 font-medium ${
                  formStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                3. Media
              </span>
              <span
                className={`rounded-full px-4 py-1 font-medium ${
                  formStep >= 4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                4. Review
              </span>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              {formStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Campaign Basics</h2>
                  <p className="text-sm text-gray-500">
                    Let's start with the essential information about your campaign.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="mb-2 block text-sm font-medium">
                        Campaign Title*
                      </label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Give your campaign a clear, specific title"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="mb-2 block text-sm font-medium">
                        Category*
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange(value, 'category')}
                      >
                        <SelectTrigger id="category">
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

                    <div>
                      <label htmlFor="goal" className="mb-2 block text-sm font-medium">
                        Funding Goal (USD)*
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input
                          id="goal"
                          name="goal"
                          type="number"
                          min="1"
                          value={formData.goal}
                          onChange={handleInputChange}
                          placeholder="5000"
                          className="pl-7"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="duration" className="mb-2 block text-sm font-medium">
                        Campaign Duration (Days)*
                      </label>
                      <Select
                        value={formData.duration}
                        onValueChange={(value) => handleSelectChange(value, 'duration')}
                      >
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="45">45 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="description" className="mb-2 block text-sm font-medium">
                        Short Description*
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Summarize your campaign in 1-2 sentences"
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={nextStep}>
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Campaign Story</h2>
                  <p className="text-sm text-gray-500">
                    Tell potential backers about your project, why it matters, and what you'll do with the funds.
                  </p>

                  <div>
                    <label htmlFor="story" className="mb-2 block text-sm font-medium">
                      Campaign Story*
                    </label>
                    <Textarea
                      id="story"
                      name="story"
                      value={formData.story}
                      onChange={handleInputChange}
                      placeholder="Share your story in detail. What inspired you? What will you accomplish? Why should people support this project?"
                      rows={12}
                      required
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {formStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Campaign Media</h2>
                  <p className="text-sm text-gray-500">
                    Add images to help tell your story and engage potential backers.
                  </p>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Campaign Image*
                    </label>
                    <div
                      className={`mt-1 flex cursor-pointer justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 ${
                        formData.image ? 'bg-primary/10' : ''
                      }`}
                    >
                      <div className="space-y-1 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        {formData.image ? (
                          <div className="text-sm text-primary">
                            <p className="font-medium">Image uploaded</p>
                            <p>{formData.image.name}</p>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            <label htmlFor="image" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                              <span>Upload a file</span>
                              <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageChange}
                                required
                              />
                            </label>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {formStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Review & Launch</h2>
                  <p className="text-sm text-gray-500">
                    Review your campaign details before launching.
                  </p>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 font-bold">{formData.title || 'Campaign Title'}</h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Category</div>
                        <div>{formData.category || 'Not specified'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Funding Goal</div>
                        <div>${formData.goal || '0'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Duration</div>
                        <div>{formData.duration || '0'} days</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Image</div>
                        <div>{formData.image ? formData.image.name : 'Not uploaded'}</div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1">
                      <div className="text-xs text-gray-500">Description</div>
                      <div>{formData.description || 'No description provided'}</div>
                    </div>

                    <div className="mt-4 space-y-1">
                      <div className="text-xs text-gray-500">Story Preview</div>
                      <div className="max-h-32 overflow-hidden text-ellipsis">
                        {formData.story ? `${formData.story.substring(0, 200)}...` : 'No story provided'}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-medium">Before you submit</p>
                        <p className="text-sm">
                          Once submitted, your campaign will be reviewed by our team before going live.
                          This typically takes 1-3 business days.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="submit">
                      Launch Campaign
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
