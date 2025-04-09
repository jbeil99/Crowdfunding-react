import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="Profile"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <CardTitle>John Doe</CardTitle>
                <CardDescription>john.doe@example.com</CardDescription>
              </div>
              <Button className="w-full bg-black hover:bg-gray-800" asChild>
                <Link to="/edit-profile">Edit Profile</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Member since
                  </h3>
                  <p className="text-gray-800">April 2025</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <p className="text-gray-800">New York, USA</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Campaigns Supported
                  </h3>
                  <p className="text-gray-800">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <div className="md:w-2/3 space-y-8">
          {/* My Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>My Campaigns</CardTitle>
              <CardDescription>
                Campaigns you've created and are managing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center border-b border-gray-200 py-4">
                <div>
                  <h3 className="font-medium">Community Garden Initiative</h3>
                  <p className="text-sm text-gray-600">Started 3 weeks ago</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$12,500 / $20,000</p>
                  <p className="text-sm text-green-600">Active</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 py-4">
                <div>
                  <h3 className="font-medium">Local Art Exhibition</h3>
                  <p className="text-sm text-gray-600">Started 2 months ago</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$5,680 / $6,000</p>
                  <p className="text-sm text-green-600">Active</p>
                </div>
              </div>
              <div className="pt-4">
                <Link to="/start-campaign">
                  <Button variant="outline" className="w-full">
                    Start a New Campaign
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Supported Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Supported Campaigns</CardTitle>
              <CardDescription>Campaigns you've contributed to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center border-b border-gray-200 py-4">
                <div>
                  <h3 className="font-medium">Save the Local Animal Shelter</h3>
                  <p className="text-sm text-gray-600">
                    Contributed $50 - 1 month ago
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$8,350 / $10,000</p>
                  <p className="text-sm text-green-600">Active</p>
                </div>
              </div>
              <div className="flex justify-between items-center py-4">
                <div>
                  <h3 className="font-medium">
                    Revolutionary Eco-Friendly Water Bottle
                  </h3>
                  <p className="text-sm text-gray-600">
                    Contributed $25 - 3 months ago
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$15,230 / $12,000</p>
                  <p className="text-sm text-green-600">Funded</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-600">
                    Receive updates about your campaigns
                  </p>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security
                  </p>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-gray-600">Update your password</p>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
