// src/pages/courses/components/LessonList.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  Button,
  Form,
  InputGroup,
  ListGroup,
  Badge
} from 'react-bootstrap';
import { 
  PlayCircle,
  Plus,
  Save,
  X,
  Pencil,
  Trash,
  Clock
} from 'react-bootstrap-icons';
import { 
  createLesson,
  getLessonsByModule,
  updateLesson,
  deleteLesson
} from '../../../api';



const LessonList = ({ module, course, setCourse }) => {
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [expandedLessonId, setExpandedLessonId] = useState(null);

 const toggleLessonExpansion = (lessonId) => {
    setExpandedLessonId(expandedLessonId === lessonId ? null : lessonId);
  };
  const handleAddLesson = async () => {
    if (!newLessonTitle.trim()) {
      toast.error('Lesson title is required');
      return;
    }

    try {
      const response = await createLesson(module.id, {
        title: newLessonTitle,
        lesson_order: module.lessons ? module.lessons.length + 1 : 1
      });
      
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.map(m => 
          m.id === module.id 
            ? { ...m, lessons: [...(m.lessons || []), response.data] } 
            : m
        )
      }));
      toast.success('Lesson added successfully');
      setNewLessonTitle('');
      setShowAddLesson(false);
    } catch (error) {
      toast.error('Failed to add lesson');
    }
  };


  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteLesson(lessonId);
        setCourse(prev => ({
          ...prev,
          modules: prev.modules.map(m => 
            m.id === module.id 
              ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } 
              : m
          )
        }));
        toast.success('Lesson deleted successfully');
      } catch (error) {
        toast.error('Failed to delete lesson');
      }
    }
  };

  const formatDuration = (min) => `${min} ${min === 1 ? 'minute' : 'minutes'}`;

  const getYouTubeVideoId = (url) => {
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : '';
};




  return (
    <>
      {showAddLesson ? (
        <Form
          className="mb-3"
          onSubmit={e => {
            e.preventDefault();
            handleAddLesson();
          }}
        >
          <InputGroup>
            <Form.Control
              placeholder="Lesson title"
              value={newLessonTitle}
              onChange={e => setNewLessonTitle(e.target.value)}
              autoFocus
            />
            <Button type="submit" variant="success">
              <Save className="me-1" /> Save
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setShowAddLesson(false)}
            >
              <X />
            </Button>
          </InputGroup>
        </Form>
      ) : (
        <Button
          variant="outline-primary"
          size="sm"
          className="mb-3"
          onClick={() => setShowAddLesson(true)}
        >
          <Plus className="me-1" /> Add Lesson
        </Button>
      )}

      {module.lessons && module.lessons.length > 0 ? (
        <ListGroup className="list-group-flush">
          {module.lessons.map((lesson, lessonIndex) => (
            <ListGroup.Item 
              key={lesson.id} 
              className="border-0 px-0 py-3"
            >
              <div className="d-flex align-items-center">
                <div 
                  className="flex-grow-1 d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleLessonExpansion(lesson.id)}
                >
                  <PlayCircle className="text-muted me-3" />
                  <div>
                    <h6 className="mb-0">
                      Lesson {lessonIndex + 1}: {lesson.title}
                    </h6>
                    <small className="text-muted">{formatDuration(lesson.duration || 5)}</small>
                  </div>
                </div>
                
                <div>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0"
                    
                    title="Edit Lesson"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="ms-1 p-0 text-danger"
                    onClick={() => handleDeleteLesson(lesson.id)}
                    title="Delete Lesson"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
              
              {expandedLessonId === lesson.id && (
                <div className="mt-3">
                    <div className="mb-2">
                    {lesson.video_url?.includes('youtube.com') || lesson.video_url?.includes('youtu.be') ? (
                        <div className="ratio ratio-16x9">
                            <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(lesson.video_url)}`}
                            title="YouTube video"
                            allowFullScreen
                            />
                        </div>
                        ) : (
                        <video
                            controls
                            width="100%"
                            style={{ maxHeight: '480px', borderRadius: '8px' }}
                            poster={lesson.video_url.replace('.mp4', '.jpg')}
                        >
                            <source src={lesson.video_url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        )}
                    </div>

                    {lesson.description && (
                    <div className="mt-2">
                        <h6>Description:</h6>
                        <p className="text-muted">{lesson.description}</p>
                    </div>
                    )}

                    <div className="d-flex justify-content-end mt-2">
                    <Button 
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setExpandedLessonId(null)}
                    >
                        Close
                    </Button>
                    </div>
                </div>
                )}

            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted">No lessons added to this module yet</p>
      )}
    </>
  );
};

export default LessonList;