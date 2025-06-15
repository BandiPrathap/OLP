// src/pages/courses/components/CourseHeader.jsx
import { Link } from 'react-router-dom';
import { Card, Button, Badge, Breadcrumb, Row, Col, } from 'react-bootstrap';
import { ArrowLeft, Pencil, Trash, Clock, Calendar, Award } from 'react-bootstrap-icons';

const CourseHeader = ({ course, setShowDeleteModal }) => {
  return (
    <>
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
                backgroundImage: course.imageurl ? `url(${course.imageurl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              
              <div className="d-flex flex-column w-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <span className="fw-bold">
                      {course.price > 0 
                        ? `₹${parseFloat(course.price).toFixed(2)}`
                        : 'Free'}
                    </span>
                    {course.originalPrice > 0 && (
                      <small className="text-muted text-decoration-line-through ms-2">
                        ₹{parseFloat(course.originalPrice).toFixed(2)}
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
    </>
  );
};

export default CourseHeader;