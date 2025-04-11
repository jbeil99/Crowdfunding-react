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
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUser } from "../../store/auth";
import Donations from "./components/Donations";
import Campaign from "./components/Campaign";



export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const getMemberSince = (createdAt) => {
    const date = new Date(createdAt);

    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user?.profile_picture}
                  alt="Profile"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <CardTitle>{user?.first_name} {user?.last_name}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
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
                  <p className="text-gray-800">{getMemberSince(user?.created_at)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <p className="text-gray-800">{user?.country ? user?.country : "Not Provided"}</p>
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
          <Campaign user={user} />

          {/* Supported Campaigns */}
          <Donations user={user} />

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
