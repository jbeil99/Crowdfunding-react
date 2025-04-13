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
import { useEffect, useState } from "react";
import { getUser, logout } from "../../store/auth";
import Donations from "./components/Donations";
import Campaign from "./components/Campaign";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteUser } from "../../lib/profile";
import { toast } from "sonner";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const getMemberSince = (createdAt) => {
    const date = new Date(createdAt);
    const options = { year: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDeleteAccount = async () => {
    if (!currentPassword) return;

    setIsLoading(true);

    try {
      const response = await deleteUser(currentPassword)

      if (response.status !== 200) {
        throw new Error('Failed to process request');
      }
      toast.success(`Your Acoount has beean deleted!`);
      setDeleteDialogOpen(false);
      setCurrentPassword("")
      dispatch(logout()).unwrap();
      navigate("/");
    } catch (error) {
      console.log(error)
      if (error.status === 401) {
        toast.error("Please login in first to Delete your account");

      } else {
        for (const k of Object.keys(error.response.data)) {
          toast.error('Failed to process report: ' + error.response.data[k].join("\n"));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.profile_picture} alt="Profile" />
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
                  <p className="text-gray-800">{user?.total_donations}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Donations
                  </h3>
                  <p className="text-gray-800">{user?.total_donations}</p>
                </div>
                {user?.date_of_birth && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Age
                    </h3>
                    <p className="text-gray-800">{calculateAge(user?.date_of_birth)} years</p>
                  </div>
                )}
                {user?.facebook && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Facebook Profile
                    </h3>
                    <a
                      href={user.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>View Profile</span>
                    </a>
                  </div>
                )}
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
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-gray-600">Update your password</p>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Delete your account</h3>
                  <p className="text-sm text-gray-600">
                    You can't get it back. Are you sure?
                  </p>
                </div>
                <div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
          <DialogDescription>
            Please enter your current password to confirm account deletion.
          </DialogDescription>
          <div className="space-y-4">
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              required
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}
