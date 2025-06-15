// src/pages/courses/CourseDetail.jsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { 
  Container, 
  Row, 
  Col,
  Spinner,
  Button
} from 'react-bootstrap';
import { ArrowLeft} from 'react-bootstrap-icons';
import { 
  getCourseById, 
  deleteCourse
} from '../../api';
import CourseHeader from './components/CourseHeader';
import ModuleList from './components/ModuleList';
import DeleteModal from './components/DeleteModal';
import CourseSidebar from './components/CourseSidebar';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      <CourseHeader 
        course={course} 
        setShowDeleteModal={setShowDeleteModal}
      />
      
      <Row className="g-4">
        <Col lg={8}>
          <ModuleList 
            course={course} 
            setCourse={setCourse} 
          />
        </Col>
        
        <Col lg={4}>
          <CourseSidebar course={course} />
        </Col>
      </Row>

      <DeleteModal 
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        deleting={deleting}
        handleDelete={handleDelete}
        courseTitle={course.title}
      />
    </Container>
  );
};

export default CourseDetail;