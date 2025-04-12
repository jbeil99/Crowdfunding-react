import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { validateFormData } from "../../lib/validation"
import { addProject } from '../../lib/projects';
import { getCategories } from '../../lib/projects';


const CreateCampaignPage = () => {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    total_target: '',
    start_time: '',
    end_time: '',
    category: '',
    tags: [],
    images: [],
    thumbnail: null // Add thumbnail field
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    getCategories().then(res => setCategories(res.data))
  }, [])
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
    setTouched((prev) => ({ ...prev, category: true }));

    // Validate the specific field
    const fieldErrors = validateFormData({ ...formData, category: value }, formStep);
    setErrors((prev) => ({ ...prev, category: fieldErrors.category }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() === '') return;

    // Prevent duplicate tags
    if (formData.tags.includes(tagInput.trim())) {
      toast.error('This tag already exists');
      return;
    }

    // Limit to 10 tags
    if (formData.tags.length >= 10) {
      toast.error('Maximum 10 tags allowed');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    }));

    setTouched((prev) => ({ ...prev, tags: true }));
    setTagInput('');

    // Clear tag errors if we now have at least one tag
    if (errors.tags && formData.tags.length === 0) {
      setErrors((prev) => ({ ...prev, tags: undefined }));
    }
  };

  const removeTag = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));

    // Add validation if tags are required and we've removed all tags
    if (formData.tags.length === 1) {
      setErrors((prev) => ({ ...prev, tags: 'At least one tag is required' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate the specific field
    const fieldErrors = validateFormData({ ...formData }, formStep);
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  // Handle thumbnail change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: file
      }));
      setTouched((prev) => ({ ...prev, thumbnail: true }));

      // Clear any previous thumbnail errors
      setErrors((prev) => ({ ...prev, thumbnail: undefined }));
    }
  };

  // Remove thumbnail
  const removeThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: null
    }));

    // If thumbnail is required, set error
    if (touched.thumbnail) {
      setErrors((prev) => ({ ...prev, thumbnail: 'Thumbnail is required' }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedImages = [...formData.images, ...files];

    setFormData((prev) => ({
      ...prev,
      images: updatedImages
    }));

    setTouched((prev) => ({ ...prev, images: true }));

    // Validate images
    if (updatedImages.length > 5) {
      setErrors((prev) => ({ ...prev, images: 'Maximum 5 images allowed' }));
    } else {
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));

    // Clear image error if we're now under the limit
    if (formData.images.length - 1 <= 5) {
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData, 4);
    setErrors(validationErrors);

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the errors in the form');

      if (validationErrors.title || validationErrors.category || validationErrors.tags ||
        validationErrors.total_target || validationErrors.start_time || validationErrors.end_time) {
        setFormStep(1);
      } else if (validationErrors.details) {
        setFormStep(2);
      } else if (validationErrors.images || validationErrors.thumbnail) {
        setFormStep(3);
      }

      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('details', formData.details);
      formDataToSend.append('total_target', formData.total_target);
      formDataToSend.append('start_time', formData.start_time);
      formDataToSend.append('end_time', formData.end_time);
      formDataToSend.append('category', formData.category);

      // Append tags as JSON string or as separate values based on API requirements
      formDataToSend.append('tags', JSON.stringify(formData.tags));

      // Append thumbnail
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await addProject(formDataToSend);
      if (response.status == 201) {
        toast.success('Project created successfully!');
        navigate(`/campaign/${response.data.id}`)
      } else {
        const errorData = await response.json();
        toast.error(`Failed to create project: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      if (error.status === 401) {
        toast.error("Please login in first to add a campaign");
      } else {
        for (const k of Object.keys(error.response.data)) {
          toast.error('Failed to process campaign: ' + error.response.data[k].join("\n"));
        }
      }
    }
  };

  const nextStep = () => {
    const validationErrors = validateFormData(formData, formStep);
    setErrors(validationErrors);

    let fieldsToTouch = {};
    if (formStep === 1) {
      fieldsToTouch = {
        title: true,
        total_target: true,
        start_time: true,
        end_time: true,
        category: true,
        tags: true
      };
    } else if (formStep === 2) {
      fieldsToTouch = { details: true };
    } else if (formStep === 3) {
      fieldsToTouch = { images: true, thumbnail: true };
    }

    setTouched(prev => ({ ...prev, ...fieldsToTouch }));

    const stepErrors = Object.keys(validationErrors).filter(key => {
      if (formStep === 1) {
        return ['title', 'total_target', 'start_time', 'end_time', 'category', 'tags'].includes(key);
      } else if (formStep === 2) {
        return key === 'details';
      } else if (formStep === 3) {
        return ['images', 'thumbnail'].includes(key);
      }
      return false;
    });

    if (stepErrors.length === 0) {
      setFormStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error('Please fix the errors before continuing');
    }
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
          <h1 className="mb-2 text-3xl font-bold">Create Your Project</h1>
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
                className={`rounded-full px-4 py-1 font-medium ${formStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}
              >
                1. Basics
              </span>
              <span
                className={`rounded-full px-4 py-1 font-medium ${formStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}
              >
                2. Details
              </span>
              <span
                className={`rounded-full px-4 py-1 font-medium ${formStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}
              >
                3. Media
              </span>
              <span
                className={`rounded-full px-4 py-1 font-medium ${formStep >= 4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
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
                  <h2 className="text-xl font-semibold">Project Basics</h2>
                  <p className="text-sm text-gray-500">
                    Let's start with the essential information about your project.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="mb-2 block text-sm font-medium">
                        Project Title*
                      </label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Give your project a clear, specific title"
                        className={errors.title && touched.title ? "border-red-500" : ""}
                        required
                      />
                      {errors.title && touched.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="category" className="mb-2 block text-sm font-medium">
                        Project Category*
                      </label>
                      <Select
                        id="category"
                        name="category"
                        value={formData.category}
                        onValueChange={handleCategoryChange}
                        required
                      >
                        <SelectTrigger className={errors.category && touched.category ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && touched.category && (
                        <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="tags" className="mb-2 block text-sm font-medium">
                        Project Tags* (Add up to 10 tags)
                      </label>
                      <div className="flex">
                        <Input
                          id="tagInput"
                          name="tagInput"
                          value={tagInput}
                          onChange={handleTagInputChange}
                          placeholder="Enter a tag and press Add"
                          className="mr-2"
                        />
                        <Button type="button" onClick={addTag} variant="outline">
                          Add
                        </Button>
                      </div>
                      {errors.tags && touched.tags && (
                        <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
                      )}

                      {formData.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-gray-500">
                        {formData.tags.length}/10 tags added
                      </div>
                    </div>

                    <div>
                      <label htmlFor="total_target" className="mb-2 block text-sm font-medium">
                        Funding Goal*
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input
                          id="total_target"
                          name="total_target"
                          type="number"
                          min="1"
                          value={formData.total_target}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder="5000"
                          className={`pl-7 ${errors.total_target && touched.total_target ? "border-red-500" : ""}`}
                          required
                        />
                      </div>
                      {errors.total_target && touched.total_target && (
                        <p className="mt-1 text-sm text-red-500">{errors.total_target}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="start_time" className="mb-2 block text-sm font-medium">
                          Start Date*
                        </label>
                        <Input
                          id="start_time"
                          name="start_time"
                          type="date"
                          value={formData.start_time}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={errors.start_time && touched.start_time ? "border-red-500" : ""}
                          required
                        />
                        {errors.start_time && touched.start_time && (
                          <p className="mt-1 text-sm text-red-500">{errors.start_time}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="end_time" className="mb-2 block text-sm font-medium">
                          End Date*
                        </label>
                        <Input
                          id="end_time"
                          name="end_time"
                          type="date"
                          value={formData.end_time}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={errors.end_time && touched.end_time ? "border-red-500" : ""}
                          required
                        />
                        {errors.end_time && touched.end_time && (
                          <p className="mt-1 text-sm text-red-500">{errors.end_time}</p>
                        )}
                      </div>
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
                  <h2 className="text-xl font-semibold">Project Details</h2>
                  <p className="text-sm text-gray-500">
                    Tell potential backers about your project, why it matters, and what you'll do with the funds.
                  </p>

                  <div>
                    <label htmlFor="details" className="mb-2 block text-sm font-medium">
                      Project Details*
                    </label>
                    <Textarea
                      id="details"
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Share your story in detail. What inspired you? What will you accomplish? Why should people support this project?"
                      className={errors.details && touched.details ? "border-red-500" : ""}
                      rows={12}
                      required
                    />
                    {errors.details && touched.details && (
                      <p className="mt-1 text-sm text-red-500">{errors.details}</p>
                    )}
                    <div className="mt-1 text-xs text-gray-500">
                      {formData.details.length}/5000 characters
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

              {formStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Project Media</h2>
                  <p className="text-sm text-gray-500">
                    Add images to help tell your story and engage potential backers.
                  </p>

                  {/* Thumbnail upload section */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Project Thumbnail* (Cover image for your project)
                    </label>
                    <div className={`mt-1 flex cursor-pointer justify-center rounded-lg border border-dashed ${errors.thumbnail && touched.thumbnail ? "border-red-500" : "border-gray-300"
                      } px-6 py-5`}>
                      <div className="space-y-1 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-sm text-gray-600">
                          <label htmlFor="thumbnail" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                            <span>Upload thumbnail</span>
                            <input
                              id="thumbnail"
                              name="thumbnail"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleThumbnailChange}
                              required={!formData.thumbnail}
                            />
                          </label>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      </div>
                    </div>
                    {errors.thumbnail && touched.thumbnail && (
                      <p className="mt-1 text-sm text-red-500">{errors.thumbnail}</p>
                    )}

                    {formData.thumbnail && (
                      <div className="mt-4">
                        <h3 className="mb-2 text-sm font-medium">Thumbnail Preview</h3>
                        <div className="relative">
                          <div className="h-32 w-full overflow-hidden rounded-lg bg-gray-100">
                            <img
                              src={URL.createObjectURL(formData.thumbnail)}
                              alt="Thumbnail"
                              className="h-full w-full object-cover"
                              onLoad={() => { URL.revokeObjectURL(formData.thumbnail) }}
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1 text-xs text-white">
                            <p className="truncate">{formData.thumbnail.name} ({(formData.thumbnail.size / (1024 * 1024)).toFixed(2)} MB)</p>
                          </div>
                          <button
                            type="button"
                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                            onClick={removeThumbnail}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Project Images* (Maximum 5)
                    </label>
                    <div className={`mt-1 flex cursor-pointer justify-center rounded-lg border border-dashed ${errors.images && touched.images ? "border-red-500" : "border-gray-300"
                      } px-6 py-10`}>
                      <div className="space-y-1 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-sm text-gray-600">
                          <label htmlFor="images" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                            <span>Upload files</span>
                            <input
                              id="images"
                              name="images"
                              type="file"
                              accept="image/*"
                              multiple
                              className="sr-only"
                              onChange={handleImageChange}
                              required={formData.images.length === 0}
                            />
                          </label>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                        </div>
                      </div>
                    </div>
                    {errors.images && touched.images && (
                      <p className="mt-1 text-sm text-red-500">{errors.images}</p>
                    )}

                    {formData.images.length > 0 && (
                      <div className="mt-4">
                        <h3 className="mb-2 text-sm font-medium">Selected Images ({formData.images.length}/5)</h3>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative">
                              <div className="h-24 w-full overflow-hidden rounded-lg bg-gray-100">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={image.name}
                                  className="h-full w-full object-cover"
                                  onLoad={() => { URL.revokeObjectURL(image) }}
                                />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1 text-xs text-white">
                                <p className="truncate">{image.name} ({(image.size / (1024 * 1024)).toFixed(2)} MB)</p>
                              </div>
                              <button
                                type="button"
                                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                onClick={() => removeImage(index)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                    Review your project details before launching.
                  </p>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 font-bold">{formData.title || 'Project Title'}</h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Category</div>
                        <div>{formData.category || 'Not specified'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Funding Goal</div>
                        <div>${formData.total_target || '0'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Duration</div>
                        <div>
                          {formData.start_time && formData.end_time
                            ? `${formData.start_time} to ${formData.end_time}`
                            : 'Not specified'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Images</div>
                        <div>{formData.images.length} images uploaded</div>
                      </div>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="mt-4 space-y-1">
                        <div className="text-xs text-gray-500">Tags</div>
                        <div className="flex flex-wrap gap-1">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 space-y-1">
                      <div className="text-xs text-gray-500">Details</div>
                      <div className="max-h-32 overflow-hidden text-ellipsis">
                        {formData.details ? `${formData.details.substring(0, 200)}...` : 'No details provided'}
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
                          Once submitted, your project will be reviewed by our team before going live.
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
                      Launch Project
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