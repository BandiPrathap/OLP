// src/pages/courses/CourseDetail.jsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Spinner, 
  Accordion,
  Modal,
  Form,
  InputGroup
} from 'react-bootstrap';
import { 
  ArrowLeft, 
  Pencil, 
  Trash, 
  Clock, 
  CurrencyDollar,
  Calendar,
  PlayCircle,
  CheckCircle,
  FileText,
  Book,
  Award,
  Plus,
  X,
  Save
} from 'react-bootstrap-icons';
import { 
  getCourseById, 
  deleteCourse,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson
} from '../../api';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

    // Module management states
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [showAddModule, setShowAddModule] = useState(false);

    // Lesson management states
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [showAddLesson, setShowAddLesson] = useState(null); // moduleId for which to show add lesson
  

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // const response = await getCourseById(id);
        // setCourse(response.data);
        setCourse(
          {
          "id": 1,
          "title": "Full Stack Web Development",
          "description": "Learn to build modern web applications using HTML, CSS, JavaScript, React, Node.js, and databases.",
          "price": "199.99",
          "discount": "20.00",
          "created_at": "2025-05-24T07:37:49.964Z",
          "modules": [
            {
              "id": 1,
              "course_id": 1,
              "title": "Frontend Development",
              "module_order": 1,
              "created_at": "2025-05-24T21:33:56.119Z",
              "lessons":[
                {
                  "id": 1,
                  "module_id": 1,
                  "title": "Introduction to HTML",
                  "lesson_order": 1
                },
                {
                  "id": 2,
                  "module_id": 1,
                  "title": "CSS Fundamentals",
                  "lesson_order": 2
                }
              ]
            },
            {
              "id": 2,
              "course_id": 1,
              "title": "Backend Development",
              "module_order": 1,
              "created_at": "2025-05-24T21:33:56.119Z",
              "lessons":[
                {
                  "id": 1,
                  "module_id": 1,
                  "title": "Introduction to HTML",
                  "lesson_order": 1
                },
                {
                  "id": 2,
                  "module_id": 1,
                  "title": "CSS Fundamentals",
                  "lesson_order": 2
                }
              ]
            }
          ]
        }
      )
        
        // Simulate loading delay for better UX
        setTimeout(() => setLoading(false), 600);
      } catch (error) {
        toast.error('Failed to load course details', {
          position: "top-right",
          autoClose: 5000,
        });
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

    useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(id);
        setCourse(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load course details', {
          position: "top-right",
          autoClose: 5000,
        });
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

    // ===== MODULE MANAGEMENT FUNCTIONS =====
  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) {
      toast.error('Module title is required');
      return;
    }

    try {
      const response = await createModule(course.id, {
        title: newModuleTitle,
        module_order: course.modules.length + 1
      });
      
      setCourse(prev => ({
        ...prev,
        modules: [...prev.modules, response.data]
      }));
      
      toast.success('Module added successfully');
      setNewModuleTitle('');
      setShowAddModule(false);
    } catch (error) {
      toast.error('Failed to add module');
    }
  };

  const handleUpdateModule = async (moduleId) => {
    const module = course.modules.find(m => m.id === moduleId);
    if (!module || !module.title.trim()) {
      toast.error('Module title is required');
      return;
    }

    try {
      await updateModule(moduleId, { title: module.title });
      setEditingModuleId(null);
      toast.success('Module updated successfully');
    } catch (error) {
      toast.error('Failed to update module');
    }
  };

    const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module? All lessons in it will be deleted.')) {
      try {
        await deleteModule(moduleId);
        setCourse(prev => ({
          ...prev,
          modules: prev.modules.filter(m => m.id !== moduleId)
        }));
        toast.success('Module deleted successfully');
      } catch (error) {
        toast.error('Failed to delete module');
      }
    }
  };

    // ===== LESSON MANAGEMENT FUNCTIONS =====
  const handleAddLesson = async (moduleId) => {
    if (!newLessonTitle.trim()) {
      toast.error('Lesson title is required');
      return;
    }

    try {
      const module = course.modules.find(m => m.id === moduleId);
      const response = await createLesson(moduleId, {
        title: newLessonTitle,
        lesson_order: module.lessons ? module.lessons.length + 1 : 1
      });
      
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.map(m => 
          m.id === moduleId 
            ? { ...m, lessons: [...(m.lessons || []), response.data] } 
            : m
        )
      }));
      toast.success('Lesson added successfully');
      setNewLessonTitle('');
      setShowAddLesson(null);
    } catch (error) {
      toast.error('Failed to add lesson');
    }
  };

  const handleUpdateLesson = async (moduleId, lessonId) => {
    const module = course.modules.find(m => m.id === moduleId);
    const lesson = module.lessons.find(l => l.id === lessonId);
    
    if (!lesson || !lesson.title.trim()) {
      toast.error('Lesson title is required');
      return;
    }

    try {
      await updateLesson(lessonId, { title: lesson.title });
      setEditingLessonId(null);
      toast.success('Lesson updated successfully');
    } catch (error) {
      toast.error('Failed to update lesson');
    }
  };

  const handleDeleteLesson = async (moduleId, lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteLesson(lessonId);
        setCourse(prev => ({
          ...prev,
          modules: prev.modules.map(m => 
            m.id === moduleId 
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

    // Update module title in state
  const handleModuleTitleChange = (moduleId, value) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => 
        m.id === moduleId ? { ...m, title: value } : m
      )
    }));
  };

  // Update lesson title in state
  const handleLessonTitleChange = (moduleId, lessonId, value) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => 
        m.id === moduleId 
          ? { 
              ...m, 
              lessons: m.lessons.map(l => 
                l.id === lessonId ? { ...l, title: value } : l
              ) 
            } 
          : m
      )
    }));
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCourse(id);
      toast.success('Course deleted successfully', {
        position: "top-right",
        autoClose: 3000,
      });
      navigate('/courses');
    } catch (error) {
      toast.error('Failed to delete course');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatPrice = (price) => {
    return price > 0 ? `$${parseFloat(price).toFixed(2)}` : 'Free';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading course details...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <Container className="py-5 text-center animate-fade-in">
        <div className="display-1 text-muted mb-3">📚</div>
        <h2 className="mb-3">Course Not Found</h2>
        <p className="text-muted mb-4">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Button variant="primary" as={Link} to="/courses">
          <ArrowLeft className="me-2" />
          Back to Courses
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5 animate-fade-in">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/courses">Courses</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {course.title}
          </li>
        </ol>
      </nav>

      {/* Course Header */}
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body className="p-4">
          <Row>
            <Col md={8}>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="mb-3"
                as={Link} 
                to="/courses"
              >
                <ArrowLeft className="me-1" />
                Back to Courses
              </Button>
              
              <div className="d-flex align-items-center mb-3">
                <h1 className="h2 fw-bold mb-0 me-3">{course.title}</h1>
                {course.discount > 0 && (
                  <Badge bg="danger" className="fs-6">
                    {course.discount}% OFF
                  </Badge>
                )}
              </div>
              
              <p className="lead text-muted mb-4">{course.shortDescription || course.description.substring(0, 120) + '...'}</p>
              
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Badge bg="light" text="dark" className="fw-normal py-2 px-3">
                  <Clock className="me-1" />
                  Duration: {course.duration || 0} hours
                </Badge>
                <Badge bg="light" text="dark" className="fw-normal py-2 px-3">
                  <Calendar className="me-1" />
                  Created: {new Date(course.created_at).toLocaleDateString()}
                </Badge>
                <Badge bg="light" text="dark" className="fw-normal py-2 px-3">
                  <Award className="me-1" />
                  {course.level || 'All Levels'}
                </Badge>
              </div>
            </Col>
            
            <Col md={4} className="d-flex flex-column align-items-md-end">
              <div className="bg-light rounded mb-3" style={{ 
                width: '100%', 
                height: '200px',
                backgroundImage: course.imageUrl ? `url(${course.imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              
              <div className="d-flex flex-column w-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <CurrencyDollar className="me-1 text-warning" size={24} />
                    <span className="h4 mb-0 fw-bold">
                      {formatPrice(course.price)}
                    </span>
                    {course.originalPrice > 0 && (
                      <small className="text-muted text-decoration-line-through ms-2">
                        {formatPrice(course.originalPrice)}
                      </small>
                    )}
                  </div>
                </div>
                
                <div className="d-grid gap-2 d-md-flex">
                  <Button 
                    variant="primary" 
                    as={Link} 
                    to={`/courses/edit/${course.id}`}
                    className="me-md-2"
                  >
                    <Pencil className="me-2" />
                    Edit Course
                  </Button>
                  <Button 
                    variant="outline-danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash className="me-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Main Content */}
      <Row className="g-4">
        <Col lg={8}>
          {/* Description Card */}
          <Card className="shadow-sm mb-4 border-0 animate-card-hover">
            <Card.Body>
              <Card.Title className="mb-3">
                <Book className="me-2 text-primary" />
                Course Description
              </Card.Title>
              <Card.Text className="text-muted">
                {course.description}
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Modules Section */}
          <Card className="shadow-sm border-0 animate-card-hover">
            <Card.Body>
              <Card.Title className="mb-4 d-flex align-items-center justify-content-between">
                <span>
                  <FileText className="me-2 text-primary" />
                  Course Modules
                </span>
                <Button
                  variant={showAddModule ? "outline-secondary" : "outline-primary"}
                  size="sm"
                  onClick={() => setShowAddModule((v) => !v)}
                >
                  {showAddModule ? (
                    <>
                      <X className="me-1" /> Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="me-1" /> Add Module
                    </>
                  )}
                </Button>
              </Card.Title>

              {/* Add Module Form */}
              {showAddModule && (
                <Form
                  className="mb-4"
                  onSubmit={e => {
                    e.preventDefault();
                    handleAddModule();
                  }}
                >
                  <InputGroup>
                    <Form.Control
                      placeholder="Module title"
                      value={newModuleTitle}
                      onChange={e => setNewModuleTitle(e.target.value)}
                      autoFocus
                    />
                    <Button type="submit" variant="success">
                      <Save className="me-1" /> Save
                    </Button>
                  </InputGroup>
                </Form>
              )}

              {course.modules && course.modules.length > 0 ? (
                <Accordion defaultActiveKey="0" flush>
                  {course.modules.map((module, index) => (
                    <Accordion.Item 
                      key={module.id} 
                      eventKey={index.toString()}
                      className="border mb-2 rounded"
                    >
                      <Accordion.Header>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <Badge bg="light" text="dark" className="fw-normal">
                              {index + 1}
                            </Badge>
                          </div>
                          <div>
                            {editingModuleId === module.id ? (
                              <Form
                                className="d-inline-block"
                                onSubmit={e => {
                                  e.preventDefault();
                                  handleUpdateModule(module.id);
                                }}
                              >
                                <InputGroup size="sm">
                                  <Form.Control
                                    value={module.title}
                                    onChange={e =>
                                      handleModuleTitleChange(module.id, e.target.value)
                                    }
                                    autoFocus
                                  />
                                  <Button
                                    variant="success"
                                    size="sm"
                                    type="submit"
                                    title="Save"
                                  >
                                    <Save />
                                  </Button>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => setEditingModuleId(null)}
                                    title="Cancel"
                                  >
                                    <X />
                                  </Button>
                                </InputGroup>
                              </Form>
                            ) : (
                              <div className="d-flex align-items-center">
                                <h6 className="mb-0">{module.title}</h6>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="ms-2 p-0"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setEditingModuleId(module.id);
                                  }}
                                  title="Edit Module"
                                >
                                  <Pencil size={16} />
                                </Button>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="ms-1 p-0 text-danger"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleDeleteModule(module.id);
                                  }}
                                  title="Delete Module"
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            )}
                            <small className="text-muted d-block">
                              {module.lessons?.length || 0} lessons • {module.duration || 0} min
                            </small>
                          </div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="text-muted">{module.description}</p>
                        
                        {/* Add Lesson Form */}
                        {showAddLesson === module.id ? (
                          <Form
                            className="mb-3"
                            onSubmit={e => {
                              e.preventDefault();
                              handleAddLesson(module.id);
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
                                onClick={() => setShowAddLesson(null)}
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
                            onClick={() => setShowAddLesson(module.id)}
                          >
                            <Plus className="me-1" /> Add Lesson
                          </Button>
                        )}

                        {module.lessons && module.lessons.length > 0 ? (
                          <ul className="list-group list-group-flush">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <li 
                                key={lesson.id} 
                                className="list-group-item d-flex align-items-center border-0 px-0 py-3"
                              >
                                <PlayCircle className="text-muted me-3" />
                                <div className="flex-grow-1">
                                  {editingLessonId === lesson.id ? (
                                    <Form
                                      className="d-inline-block"
                                      onSubmit={e => {
                                        e.preventDefault();
                                        handleUpdateLesson(module.id, lesson.id);
                                      }}
                                    >
                                      <InputGroup size="sm">
                                        <Form.Control
                                          value={lesson.title}
                                          onChange={e =>
                                            handleLessonTitleChange(module.id, lesson.id, e.target.value)
                                          }
                                          autoFocus
                                        />
                                        <Button
                                          variant="success"
                                          size="sm"
                                          type="submit"
                                          title="Save"
                                        >
                                          <Save />
                                        </Button>
                                        <Button
                                          variant="outline-secondary"
                                          size="sm"
                                          onClick={() => setEditingLessonId(null)}
                                          title="Cancel"
                                        >
                                          <X />
                                        </Button>
                                      </InputGroup>
                                    </Form>
                                  ) : (
                                    <div className="d-flex align-items-center">
                                      <h6 className="mb-0">
                                        Lesson {lessonIndex + 1}: {lesson.title}
                                      </h6>
                                      <Button
                                        variant="link"
                                        size="sm"
                                        className="ms-2 p-0"
                                        onClick={() => setEditingLessonId(lesson.id)}
                                        title="Edit Lesson"
                                      >
                                        <Pencil size={16} />
                                      </Button>
                                      <Button
                                        variant="link"
                                        size="sm"
                                        className="ms-1 p-0 text-danger"
                                        onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                        title="Delete Lesson"
                                      >
                                        <Trash size={16} />
                                      </Button>
                                    </div>
                                  )}
                                  <small className="text-muted">{lesson.duration || 5} minutes</small>
                                </div>
                                <Badge bg="light" text="secondary">
                                  <Clock size={12} className="me-1" />
                                  Video
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted">No lessons added to this module yet</p>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                <Card className="text-center py-5 bg-light border-0">
                  <Card.Body>
                    <div className="display-4 text-muted mb-3">📂</div>
                    <h5>No modules added yet</h5>
                    <p className="text-muted">
                      This course doesn't have any modules. Add modules to structure your content.
                    </p>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          {/* Additional Info */}
          <Card className="shadow-sm mb-4 border-0 animate-card-hover">
            <Card.Body>
              <Card.Title className="mb-3">
                <CheckCircle className="me-2 text-success" />
                What You'll Learn
              </Card.Title>
              
              {course.learningOutcomes && course.learningOutcomes.length > 0 ? (
                <ul className="list-unstyled">
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="d-flex mb-2">
                      <CheckCircle className="text-success me-2 mt-1" size={16} />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No learning outcomes specified</p>
              )}
            </Card.Body>
          </Card>

          {/* Requirements */}
          <Card className="shadow-sm mb-4 border-0 animate-card-hover">
            <Card.Body>
              <Card.Title className="mb-3">
                <Award className="me-2 text-warning" />
                Requirements
              </Card.Title>
              
              {course.requirements && course.requirements.length > 0 ? (
                <ul className="list-unstyled">
                  {course.requirements.map((requirement, index) => (
                    <li key={index} className="d-flex mb-2">
                      <span className="me-2">•</span>
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No special requirements for this course</p>
              )}
            </Card.Body>
          </Card>

          {/* Stats Card */}
          <Card className="shadow-sm border-0 animate-card-hover">
            <Card.Body>
              <Card.Title className="mb-3">Course Statistics</Card.Title>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Total Students</span>
                  <strong>{(course.enrollments || 0).toLocaleString()}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Completion Rate</span>
                  <strong>{(course.completionRate || 0).toFixed(1)}%</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Average Rating</span>
                  <strong>{course.rating || 0}/5.0</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Last Updated</span>
                  <strong>
                    {course.updatedAt
                      ? new Date(course.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : '-'}
                  </strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="lead">
            Are you sure you want to delete <strong>"{course.title}"</strong>?
          </p>
          <p className="text-danger">
            This action cannot be undone. All course data will be permanently removed.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" />
                <span className="ms-2">Deleting...</span>
              </>
            ) : (
              'Delete Course'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CourseDetail;