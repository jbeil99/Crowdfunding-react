import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getProject, updateProject } from '../../../lib/projects';

export default function UpdateProjectForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        details: '',
        total_target: '',
        start_time: '',
        end_time: '',
        tags: [],
        category: ''
    });
    const [tagInput, setTagInput] = useState('');
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await getProject(id);
                if (response.status === 200) {
                    const project = response.data;
                    setFormData({
                        title: project.title,
                        details: project.details,
                        total_target: project.total_target,
                        start_time: new Date(project.start_time).toISOString().split('T')[0],
                        end_time: new Date(project.end_time).toISOString().split('T')[0],
                        tags: project.tags || [],
                        category: project.category.id
                    });

                    // Extract image URLs from the images array of objects
                    if (project.images && project.images.length > 0) {
                        const imageUrls = project.images.map(img => img.image_url);
                        setPreviewUrls(imageUrls);
                    }

                    if (project.thumbnail) {
                        setThumbnailPreview(project.thumbnail);
                    }
                }
            } catch (error) {
                console.error('Error fetching project:', error);
                toast.error('Failed to load project details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();

            // Handle form data except tags
            Object.keys(formData).forEach(key => {
                if (key !== 'tags') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Add each tag individually with 'tags' key
            formData.tags.forEach(tag => {
                formDataToSend.append('tags', tag);
            });

            // Add thumbnail if exists
            if (thumbnail) {
                formDataToSend.append('thumbnail', thumbnail);
            }

            // Add images if exists
            if (images.length > 0) {
                images.forEach(image => {
                    formDataToSend.append('images', image);
                });
            }

            const response = await updateProject(id, formDataToSend);

            if (response.status === 200) {
                toast.success('Project updated successfully');
                navigate(`/campaign/${id}`);
            }
        } catch (error) {
            console.error('Error updating project:', error);
            toast.error('Failed to update project');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const addTag = () => {
        if (tagInput.trim() && formData.tags.length < 10) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

        setImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Update Project</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Details</label>
                        <Textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            required
                            rows={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Target Amount</label>
                        <Input
                            type="number"
                            name="total_target"
                            value={formData.total_target}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date</label>
                            <Input
                                type="date"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Date</label>
                            <Input
                                type="date"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="tags" className="mb-2 block text-sm font-medium">
                            Project Tags* (Add up to 10 tags)
                        </label>
                        <div className="flex">
                            <Input
                                id="tagInput"
                                value={tagInput}
                                onChange={handleTagInputChange}
                                placeholder="Enter a tag and press Add"
                                className="mr-2"
                            />
                            <Button type="button" onClick={addTag} variant="outline">
                                Add
                            </Button>
                        </div>

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
                        <label className="mb-2 block text-sm font-medium">
                            Project Thumbnail
                        </label>
                        <div className="space-y-4">
                            {thumbnailPreview && (
                                <div className="relative w-full max-w-[200px]">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail Preview"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setThumbnail(null);
                                            setThumbnailPreview(null);
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="mb-4"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Project Images
                        </label>
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="mb-4"
                        />

                        {previewUrls.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/admin/dashboard')}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Project'}
                    </Button>
                </div>
            </form>
        </div>
    );
}