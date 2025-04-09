import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HowItWorksPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">How FundRaiser Works</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          We make it easy to bring creative projects to life.
        </p>

        {/* Step 1 */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <div className="bg-primary/10 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-4xl">1</span>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Create Your Campaign</h2>
              <p className="text-gray-600 mb-4">
                Start by building your campaign page. Share your story, set your funding goal, and determine how long you'll fundraise for. Add compelling images and videos to help tell your story.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-4">
                <li>Choose a clear title that describes your project</li>
                <li>Upload high-quality images that showcase your idea</li>
                <li>Write a compelling story about why your project matters</li>
                <li>Set a realistic funding goal and timeline</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 md:order-last">
              <div className="bg-primary/10 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-4xl">2</span>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Share With Your Network</h2>
              <p className="text-gray-600 mb-4">
                Campaigns that share with their networks typically raise more funds. Use social media, email, and personal outreach to spread the word about your campaign.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-4">
                <li>Share your campaign on social media platforms</li>
                <li>Send personal emails to friends, family, and colleagues</li>
                <li>Update supporters regularly on your progress</li>
                <li>Engage with your community and respond to questions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <div className="bg-primary/10 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-4xl">3</span>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Collect Funds</h2>
              <p className="text-gray-600 mb-4">
                When your campaign reaches its goal, funds are transferred to you. If your campaign doesn't reach its goal by the deadline, no money changes hands.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-4">
                <li>Funds are only collected if you reach your goal (all-or-nothing funding)</li>
                <li>Transaction fees are deducted before funds are transferred</li>
                <li>Receive your funds typically within 14 days of campaign end</li>
                <li>Use dashboard tools to track your campaign's progress</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 md:order-last">
              <div className="bg-primary/10 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-4xl">4</span>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Bring Your Idea to Life</h2>
              <p className="text-gray-600 mb-4">
                Use the funds to bring your project to reality. Keep your backers updated on your progress and the impact of their support.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-4">
                <li>Fulfill the promises you made in your campaign</li>
                <li>Update your backers with progress reports</li>
                <li>Share the impact of your completed project</li>
                <li>Build a community around your success</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="mt-16 border-t pt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium mb-2">What if my campaign doesn't reach its goal?</h3>
              <p className="text-gray-600">
                FundRaiser uses all-or-nothing funding, which means if your campaign doesn't reach its goal, no funds are collected from backers and you don't receive any money.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">What types of projects can I fund?</h3>
              <p className="text-gray-600">
                FundRaiser supports a wide range of creative projects, community initiatives, tech innovations, and more. Projects that involve illegal activities, hate speech, or are purely charitable are not permitted.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">How much does it cost to use FundRaiser?</h3>
              <p className="text-gray-600">
                FundRaiser charges a 5% platform fee plus payment processing fees (typically 3-5%) on successfully funded campaigns. There is no cost to start a campaign.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">How long can my campaign run?</h3>
              <p className="text-gray-600">
                Campaigns can run for any length between 1 and 90 days. However, we recommend 30-60 days for most projects, as shorter campaigns often create a greater sense of urgency.
              </p>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Campaign?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of successful creators who have brought their ideas to life.
          </p>
          <Link to="/start-campaign">
            <Button size="lg">Start a Campaign</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
