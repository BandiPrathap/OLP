// src/components/course/CourseForm.jsx
import { useState, useEffect } from 'react';

const CourseForm = ({ onSubmit, submitText = 'Submit' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setShowForm(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        <div className="card-header bg-primary text-white py-3">
          <h2 className="h5 mb-0">
            <i className="bi bi-journal-bookmark me-2"></i>
            Course Details
          </h2>
        </div>
        
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="form-label fw-medium">
                <i className="bi bi-pencil-square me-2 text-primary"></i>
                Course Title
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-card-heading"></i>
                </span>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="Enter course title"
                />
              </div>
              {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="form-label fw-medium">
                <i className="bi bi-card-text me-2 text-primary"></i>
                Description
              </label>
              <div className="input-group">
                <span className="input-group-text align-items-start">
                  <i className="bi bi-text-paragraph"></i>
                </span>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  placeholder="Describe your course in detail..."
                ></textarea>
              </div>
              {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
              <div className="form-text">Minimum 20 characters. Include what students will learn.</div>
            </div>
            
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label htmlFor="price" className="form-label fw-medium">
                  <i className="bi bi-currency-dollar me-2 text-primary"></i>
                  Price
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-cash"></i>
                  </span>
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
                  <span className="input-group-text">USD</span>
                </div>
                {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="discount" className="form-label fw-medium">
                  <i className="bi bi-percent me-2 text-primary"></i>
                  Discount
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-tag"></i>
                  </span>
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
                  <span className="input-group-text">%</span>
                </div>
                {errors.discount && <div className="invalid-feedback d-block">{errors.discount}</div>}
                <div className="form-text">Optional discount percentage</div>
              </div>
            </div>
            
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