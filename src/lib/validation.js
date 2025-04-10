const validateFormData = (data, step) => {
    const errors = {};

    // Step 1 validation
    if (step === 1 || step === 4) {
        if (!data.title) {
            errors.title = 'Title is required';
        } else if (data.title.length < 5) {
            errors.title = 'Title must be at least 5 characters';
        } else if (data.title.length > 100) {
            errors.title = 'Title must be less than 100 characters';
        }

        if (!data.total_target) {
            errors.total_target = 'Funding goal is required';
        } else if (isNaN(Number(data.total_target)) || Number(data.total_target) <= 0) {
            errors.total_target = 'Funding goal must be a positive number';
        }

        if (!data.start_time) {
            errors.start_time = 'Start date is required';
        }

        if (!data.end_time) {
            errors.end_time = 'End date is required';
        }

        // Validate date range
        if (data.start_time && data.end_time) {
            const start = new Date(data.start_time);
            const end = new Date(data.end_time);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (start < today) {
                errors.start_time = 'Start date cannot be in the past';
            }

            if (end <= start) {
                errors.end_time = 'End date must be after start date';
            }

            // Calculate duration in days
            const durationDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
            if (durationDays > 90) {
                errors.end_time = 'Campaign duration cannot exceed 90 days';
            }
        }
    }

    // Step 2 validation
    if (step === 2 || step === 4) {
        if (!data.details) {
            errors.details = 'Project details are required';
        } else if (data.details.length < 50) {
            errors.details = 'Project details must be at least 50 characters';
        } else if (data.details.length > 5000) {
            errors.details = 'Project details must be less than 5000 characters';
        }
    }

    // Step 3 validation
    if (step === 3 || step === 4) {
        if (!data.images || data.images.length === 0) {
            errors.images = 'At least one image is required';
        } else if (data.images.length > 5) {
            errors.images = 'Maximum 5 images allowed';
        } else {
            // Validate image sizes
            const invalidImages = data.images.filter(img => img.size > 5 * 1024 * 1024); // 5MB
            if (invalidImages.length > 0) {
                errors.images = 'One or more images exceed the 5MB size limit';
            }
        }
    }

    return errors;
};


export {
    validateFormData
}