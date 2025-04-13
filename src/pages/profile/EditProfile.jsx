import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getUser } from "../../store/auth";
import { updateProfile } from "../../lib/profile";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").optional().or(z.literal("")),
  first_name: z.string().min(1, "First name is required").optional().or(z.literal("")),
  last_name: z.string().min(1, "Last name is required").optional().or(z.literal("")),
  mobile_phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian mobile number")
    .optional()
    .or(z.literal("")),
  profile_picture: z.any().optional(),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date (YYYY-MM-DD)")
    .optional()
    .or(z.literal("")),
  facebook: z
    .string()
    .url("Enter a valid Facebook profile URL")
    .optional()
    .or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
});


const EditProfileForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth);

  const [previewImage, setPreviewImage] = useState(null);

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
    if (user) {
      setValue("username", user.username || "");
      setValue("first_name", user.first_name || "");
      setValue("last_name", user.last_name || "");
      setValue("mobile_phone", user.mobile_phone || "");
      setValue("date_of_birth", user.date_of_birth || "");
      setValue("facebook", user.facebook || "");
      setValue("country", user.country || "");
    }
  }, [user, setValue]);


  const onSubmit = async (data) => {
    try {
      const response = await updateProfile(data);
      if (response.status === 200) {
        toast.success("Profile data were updated successfully");
        navigate("/profile")
      }
    } catch (error) {
      if (error.status === 401) {
        toast.error("Please login in first to update");
      } else {
        for (const k of Object.keys(error.response.data)) {
          toast.error('Failed: ' + error.response.data[k].join("\n"));
        }
      }
      console.error("Error submitting comment:", error);
    }
  }
  const submitHandler = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
      if (key === "profile_picture") {
        if (data[key] instanceof FileList && data[key].length > 0) {
          formData.append(key, data[key][0]);
        } else if (data[key] instanceof File) {
          formData.append(key, data[key]);
        }
      } else if (data[key] !== undefined && data[key] !== "") {
        formData.append(key, data[key]);
      }
    });

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    onSubmit(formData);
  };



  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4 max-w-md mx-auto"
      encType="multipart/form-data"
    >
      {/* Avatar and Profile Picture Upload */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={previewImage || user?.profile_picture}
            alt={user?.username}
          />
          <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="profile_picture">Change Profile Picture</Label>
          <Input
            id="profile_picture"
            type="file"
            className="hidden"
            accept="image/*"
            {...register("profile_picture")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              console.log(e.target.files[0])
              if (file) {
                setValue("profile_picture", file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
      </div>

      {/* Read-only field */}
      <div>
        <Label>Email</Label>
        <Input value={user?.email} disabled />
      </div>

      {/* Editable Fields */}
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
        <Label htmlFor="date_of_birth">Birthdate</Label>
        <Input id="date_of_birth" type="date" {...register("date_of_birth")} />
        {errors.date_of_birth && (
          <p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="facebook">Facebook Profile</Label>
        <Input
          id="facebook"
          type="url"
          {...register("facebook")}
        />
        {errors.facebook && (
          <p className="text-red-500 text-sm">
            {errors.facebook.message}
          </p>
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
