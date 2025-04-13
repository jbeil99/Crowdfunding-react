import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/store/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/NewCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  re_password: z.string().min(1, "Please confirm your password"),
  mobile_phone: z.string().min(10, "Valid phone number is required"),
  profile_picture: z.any(),
}).refine((data) => data.password === data.re_password, {
  message: "Passwords do not match",
  path: ["re_password"],
});

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    re_password: "",
    mobile_phone: "",
    profile_picture: null,
  });

  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  // Create preview URL when profile picture changes
  useEffect(() => {
    if (formData.profile_picture) {
      const objectUrl = URL.createObjectURL(formData.profile_picture);
      setPreviewUrl(objectUrl);

      // Free memory when this component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.profile_picture]);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "profile_picture") {
      setFormData((prev) => ({
        ...prev,
        [id]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const validateForm = () => {
    try {
      registerSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error) {
      const formattedErrors = {};
      error.errors.forEach((err) => {
        const path = err.path[0];
        formattedErrors[path] = err.message;
      });
      setValidationErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Important: prevent default form submission
    setErrors({});

    // Validate form with Zod
    if (!validateForm()) {
      return;
    }


    const submitData = new FormData();

    Object.keys(formData).forEach(key => {
      if (key === 'profile_picture') {
        if (formData[key] instanceof File) {
          submitData.append(key, formData[key]);
        }
      } else if (formData[key] !== null && formData[key] !== undefined) {
        submitData.append(key, formData[key]);
      }
    });


    try {
      const result = await dispatch(register(submitData)).unwrap();
      if (result) {
        navigate("/login");
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(error);
    }
  };

  return (
    <div className="container max-w-xl py-24">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your information to create a FundRaiser account
          </CardDescription>
          {errors.non_field_errors && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
              {errors.non_field_errors}
            </div>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className={validationErrors.first_name ? "border-red-500" : ""}
                  />
                  {(validationErrors.first_name || errors.first_name) && (
                    <p className="text-xs text-red-500">{validationErrors.first_name || errors.first_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className={validationErrors.last_name ? "border-red-500" : ""}
                  />
                  {(validationErrors.last_name || errors.last_name) && (
                    <p className="text-xs text-red-500">{validationErrors.last_name || errors.last_name}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  required
                  className={validationErrors.username ? "border-red-500" : ""}
                />
                {(validationErrors.username || errors.username) && (
                  <p className="text-xs text-red-500">{validationErrors.username || errors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  required
                  className={validationErrors.email ? "border-red-500" : ""}
                />
                {(validationErrors.email || errors.email) && (
                  <p className="text-xs text-red-500">{validationErrors.email || errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile_phone">Mobile Phone</Label>
                <Input
                  id="mobile_phone"
                  type="tel"
                  value={formData.mobile_phone}
                  onChange={handleChange}
                  placeholder="+201xxxxxxxxx"
                  required
                  className={validationErrors.mobile_phone ? "border-red-500" : ""}
                />
                {(validationErrors.mobile_phone || errors.mobile_phone) && (
                  <p className="text-xs text-red-500">{validationErrors.mobile_phone || errors.mobile_phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile_picture">Profile Picture</Label>
                <Input
                  id="profile_picture"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className={validationErrors.profile_picture ? "border-red-500" : ""}
                />
                {(validationErrors.profile_picture || errors.profile_picture) && (
                  <p className="text-xs text-red-500">
                    {validationErrors.profile_picture || errors.profile_picture}
                  </p>
                )}
                {previewUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={validationErrors.password ? "border-red-500" : ""}
                />
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
                {(validationErrors.password || errors.password) && (
                  <p className="text-xs text-red-500">{validationErrors.password || errors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="re_password">Confirm Password</Label>
                <Input
                  id="re_password"
                  type="password"
                  value={formData.re_password}
                  onChange={handleChange}
                  required
                  className={validationErrors.re_password ? "border-red-500" : ""}
                />
                {(validationErrors.re_password || errors.re_password) && (
                  <p className="text-xs text-red-500">{validationErrors.re_password || errors.re_password}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-gray-800 hover:underline"
              >
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}