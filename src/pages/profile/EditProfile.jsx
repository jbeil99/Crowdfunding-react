import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUser } from "../../store/auth";

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  mobile_phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian mobile number"),
  profile_picture: z.any().optional(), // will handle as File
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date (YYYY-MM-DD)").optional(),
  facebook_profile: z.string().url("Enter a valid Facebook profile URL").optional(),
  country: z.string().optional(),
});

const EditProfileForm = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    // Set form data only after user data is available
    if (user) {
      setValue("username", user.username || "");
      setValue("first_name", user.first_name || "");
      setValue("last_name", user.last_name || "");
      setValue("mobile_phone", user.mobile_phone || "");
      setValue("birthdate", user.birthdate || "");
      setValue("facebook_profile", user.facebook_profile || "");
      setValue("country", user.country || "");
    }
  }, [user, setValue]);

  const submitHandler = (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    }
    onSubmit(formData);
  };

  if (!user) {
    return <div>Loading...</div>; // Optional: Show loading state until user data is available
  }

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4 max-w-md mx-auto"
    >
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.profile_picture} alt={user?.username} />
          <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="profile_picture">Change Profile Picture</Label>
          <Input
            id="profile_picture"
            type="file"
            {...register("profile_picture")}
            onChange={(e) => setValue("profile_picture", e.target.files?.[0])}
            accept="image/*"
          />
        </div>
      </div>

      {/* Read-only fields */}
      <div>
        <Label>Email</Label>
        <Input value={user?.email} disabled />
      </div>
      <div>
        <Label>User ID</Label>
        <Input value={user?.id} disabled />
      </div>
      <div>
        <Label>Status</Label>
        <Input value={user?.is_active ? "Active" : "Inactive"} disabled />
      </div>

      {/* Editable fields */}
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register("username")} />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="first_name">First Name</Label>
        <Input id="first_name" {...register("first_name")} />
        {errors.first_name && (
          <p className="text-red-500 text-sm">{errors.first_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="last_name">Last Name</Label>
        <Input id="last_name" {...register("last_name")} />
        {errors.last_name && (
          <p className="text-red-500 text-sm">{errors.last_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="mobile_phone">Mobile Phone</Label>
        <Input id="mobile_phone" {...register("mobile_phone")} />
        {errors.mobile_phone && (
          <p className="text-red-500 text-sm">{errors.mobile_phone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="birthdate">Birthdate</Label>
        <Input id="birthdate" type="date" {...register("birthdate")} />
        {errors.birthdate && (
          <p className="text-red-500 text-sm">{errors.birthdate.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="facebook_profile">Facebook Profile</Label>
        <Input
          id="facebook_profile"
          type="url"
          {...register("facebook_profile")}
        />
        {errors.facebook_profile && (
          <p className="text-red-500 text-sm">{errors.facebook_profile.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="country">Country</Label>
        <Input id="country" {...register("country")} />
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
};

export default EditProfileForm;
