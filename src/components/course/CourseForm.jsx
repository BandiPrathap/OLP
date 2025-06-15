import { useState, useEffect } from 'react';

const CourseForm = ({ onSubmit, submitText = 'Submit' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    rating: '',
    duration: '',
    category: '',
    language: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (formData.discount && (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
      newErrors.discount = 'Discount must be between 0-100%';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.language.trim()) {
      newErrors.language = 'Language is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    const cloudName = 'drhcenaii'; // Your Cloudinary cloud name
    const uploadPreset = 'OnlineLP'; // The unsigned upload preset you created

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset);
    data.append('folder', 'samples/OLP'); // Optional: if not already fixed in preset

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (json.secure_url) {
        setFormData(prev => ({
          ...prev,
          imageUrl: json.secure_url,
        }));
      } else {
        console.error('Upload failed:', json);
      }
    } catch (error) {
      console.error('Image upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="card border-0 shadow-sm">

      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="form-label fw-medium">
              <i className="bi bi-pencil-square me-2 text-primary"></i>Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              placeholder="Enter course title"
            />
            {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="form-label fw-medium">
              <i className="bi bi-card-text me-2 text-primary"></i>Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              rows="4"
              placeholder="Describe your course in detail..."
            ></textarea>
            {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
            <div className="form-text">Minimum 20 characters. Include what students will learn.</div>
          </div>

          {/* Price & Discount */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label htmlFor="price" className="form-label fw-medium">
                <i className="bi bi-currency-dollar me-2 text-primary"></i>Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="discount" className="form-label fw-medium">
                <i className="bi bi-percent me-2 text-primary"></i>Discount
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className={`form-control ${errors.discount ? 'is-invalid' : ''}`}
                placeholder="0-100"
                min="0"
                max="100"
              />
              {errors.discount && <div className="invalid-feedback d-block">{errors.discount}</div>}
              <div className="form-text">Optional discount percentage</div>
            </div>
          </div>

          {/* Rating & Duration */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label htmlFor="rating" className="form-label fw-medium">
                <i className="bi bi-star-fill me-2 text-primary"></i>Rating
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                className="form-control"
                placeholder="4.8"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="duration" className="form-label fw-medium">
                <i className="bi bi-clock me-2 text-primary"></i>Duration
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                placeholder="e.g. 32 hours"
              />
              {errors.duration && <div className="invalid-feedback d-block">{errors.duration}</div>}
            </div>
          </div>

          {/* Category & Language */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label htmlFor="category" className="form-label fw-medium">
                <i className="bi bi-tags me-2 text-primary"></i>Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                placeholder="e.g. Web Development"
              />
              {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="language" className="form-label fw-medium">
                <i className="bi bi-translate me-2 text-primary"></i>Language
              </label>
              <input
                type="text"
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className={`form-control ${errors.language ? 'is-invalid' : ''}`}
                placeholder="e.g. English"
              />
              {errors.language && <div className="invalid-feedback d-block">{errors.language}</div>}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label htmlFor="imageFile" className="form-label fw-medium">
              <i className="bi bi-upload me-2 text-primary"></i>Upload Image
            </label>
            <input
              type="file"
              id="imageFile"
              accept="image/*"
              className="form-control"
              onChange={handleImageUpload}
            />
            <div className="form-text">Upload image to Cloudinary automatically.</div>

            {formData.imageUrl && (
              <div className="mt-3">
                <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: '200px', borderRadius: '0.5rem' }} />
              </div>
            )}
            {errors.imageUrl && <div className="invalid-feedback d-block">{errors.imageUrl}</div>}
            {uploadingImage && (
              <div className="text-info mt-2">
                <i className="spinner-border spinner-border-sm me-2"></i>Uploading image...
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="d-grid mt-5">
            <button
              type="submit"
              className={`btn btn-primary btn-lg ${isSubmitting ? 'disabled' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                <>
                  {submitText} <i className="bi bi-arrow-right ms-2"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
