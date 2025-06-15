import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import ModuleSelector from './ModuleSelector';
import LessonFormFields from './LessonFormFields';
import LessonPreview from './LessonPreview';
import { getLessonsByModule } from '../../api';

const CLOUDINARY_UPLOAD_PRESET = 'OnlineLP';
const CLOUDINARY_CLOUD_NAME = 'dzd2s04kl';

const LessonForm = ({ modules, onSubmit, lessons, setLessons }) => {

  const [currentModule, setCurrentModule] = useState(modules[0]?.id || '');
  const [title, setTitle] = useState('');
  const [lessonOrder, setLessonOrder] = useState(1);
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [duration, setDuration] = useState('');
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);

  console.log('LessonForm mounted with modules:', modules);
  console.log('Current module:', currentModule);
    useEffect(() => {
      fetchLessons();
    }, [currentModule]);

    const fetchLessons = async () => {
      if (!currentModule) return;
      console.log('Fetching lessons for module:', currentModule);
      try {
        const data = (await getLessonsByModule(currentModule))?.data || [];
        console.log('Fetched lessons:', data);
        setLessons(data);
      } catch (err) {
        toast.error('Could not load lessons for selected module.');
      }
    };
// ✅ Now it will run every time currentModule changes


  // // Update lesson order based on current lessons
  // useEffect(() => {
  //   setLessonOrder(lessons.length + 1);
  // }, [lessons]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Lesson title is required';
    else if (title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!lessonOrder || lessonOrder < 1) newErrors.lessonOrder = 'Lesson order must be at least 1';
    if (!videoUrl) newErrors.video = 'Please upload a video';
    if (!duration.trim()) newErrors.duration = 'Duration is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setTitle('');
    setVideoUrl('');
    setDuration('');
    setLessonOrder(lessons.length + 2);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!currentModule || !validateForm()) {
    toast.error('Please fill in all required fields correctly.');
    return;
  }

  const lessonData = {
    module_id: currentModule,
    title,
    video_url: videoUrl,
    lesson_order: lessonOrder,
    duration
  };
  setLoading(true); 
  try {
    await onSubmit(lessonData); // ✅ wait for lesson to be created
    resetForm();
    await fetchLessons(); // ✅ then fetch updated list
    toast.success('Lesson created successfully');
  } catch (err) {
    toast.error('Something went wrong while adding the lesson.');
  }finally {
    setLoading(false); // ✅ Stop loading
  }
};


  const handleVideoUpload = async (e) => {
    if (!currentModule) {
      toast.error('Please select a module first.');
      return;
    }

    const file = e?.target?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Only video files are allowed.');
      return;
    }

    if (file.size > 200 * 1024 * 1024) {
      toast.error('File size exceeds 200MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(percent);
      }
    });

    xhr.onload = () => {
      setIsUploading(false);
      setUploadProgress(0);
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setVideoUrl(response.secure_url);
        if (response.duration) {
          setDuration(Math.round(response.duration / 60) + ' mins');
        }
        toast.success('Video uploaded successfully');
      } else {
        setErrors(prev => ({ ...prev, video: 'Upload failed. Try again.' }));
        toast.error('Video upload failed. Please try again.');
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setUploadProgress(0);
      setErrors(prev => ({ ...prev, video: 'Upload failed. Try again.' }));
      toast.error('Video upload failed due to network error.');
    };

    xhr.send(formData);
  };

  return (
    <div className="container-fluid">
      <div className="row g-4">
        {/* Lesson Form */}
        <div className="col-lg-6">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white py-3">
              <h2 className="h4 mb-0 d-flex align-items-center">
                <i className="bi bi-film me-2"></i>
                Create New Lesson
              </h2>
            </div>
            <div className="card-body">
              <ModuleSelector 
                modules={modules}
                currentModule={currentModule}
                setCurrentModule={setCurrentModule}
                lessons={lessons} // ✅ Add this line
              />

              {currentModule && (
                <LessonFormFields 
                  title={title}
                  setTitle={setTitle}
                  lessonOrder={lessonOrder}
                  setLessonOrder={setLessonOrder}
                  videoUrl={videoUrl}
                  setVideoUrl={setVideoUrl}
                  duration={duration}
                  setDuration={setDuration}
                  errors={errors}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  fileInputRef={fileInputRef}
                  handleVideoUpload={handleVideoUpload}
                  handleSubmit={handleSubmit}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </div>

        {/* Lesson Preview */}
        <div className="col-lg-6">
          <LessonPreview 
            modules={modules}
            lessons={lessons} // ✅ must be an array
            currentModule={currentModule}
            highlightLessonId={null} // or your desired value
            onSelectLesson={null}
          />

        </div>
      </div>
    </div>
  );
};

export default LessonForm;
