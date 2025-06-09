import { useState } from 'react';
import { addLesson } from '../../api/lessons';
import { openCloudinaryWidget } from '../../utils/cloudinary';
import { toast } from 'react-toastify';

const LessonForm = ({ modules, onSubmit }) => {
    const [currentModule, setCurrentModule] = useState(modules[0]);
    const [lessons, setLessons] = useState([]);
    const [lessonTitle, setLessonTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const handleAddLesson = async (e) => {
        e.preventDefault();
        if (!lessonTitle || !videoUrl) {
            toast.error('Please provide a lesson title and upload a video.');
            return;
        }
        const lessonData = {
            title: lessonTitle,
            video_url: videoUrl,
            module_id: currentModule.id,
        };
        try {
            await addLesson(lessonData);
            setLessons([...lessons, lessonData]);
            setLessonTitle('');
            setVideoUrl('');
            toast.success('Lesson added!');
        } catch (error) {
            toast.error('Failed to add lesson');
        }
    };

    const handleVideoUpload = () => {
        openCloudinaryWidget((url) => {
            setVideoUrl(url);
        });
    };

    return (
        <div>
            <h3>Add Lessons for {currentModule.title}</h3>
            
            <div className="module-selector">
                {modules.map(module => (
                    <button 
                        key={module.id} 
                        onClick={() => {
                            setCurrentModule(module);
                            setLessonTitle('');
                            setVideoUrl('');
                        }}
                        className={currentModule.id === module.id ? 'active' : ''}
                    >
                        {module.title}
                    </button>
                ))}
            </div>

            <form onSubmit={handleAddLesson}>
                {/* Lesson title input */}
                <input 
                    type="text" 
                    placeholder="Lesson Title" 
                    value={lessonTitle}
                    onChange={e => setLessonTitle(e.target.value)}
                    required 
                />
                
                {/* Video upload */}
                <button 
                    type="button" 
                    onClick={handleVideoUpload}
                >
                    Upload Video
                </button>
                
                {videoUrl && (
                    <div>
                        <video src={videoUrl} controls width="250" />
                        <input type="hidden" value={videoUrl} />
                    </div>
                )}

                <button type="submit">Add Lesson</button>
            </form>

            <ul>
                {lessons
                    .filter(lesson => lesson.module_id === currentModule.id)
                    .map((lesson, idx) => (
                        <li key={idx}>{lesson.title}</li>
                ))}
            </ul>

            <button onClick={onSubmit}>Finish Course Setup</button>
        </div>
    );
};

export default LessonForm;