// src/pages/courses/components/CourseSidebar.jsx
import { Card } from 'react-bootstrap';
import { 
  CheckCircle,
  Award
} from 'react-bootstrap-icons';

const CourseSidebar = ({ course }) => {
  return (
    <>
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
    </>
  );
};

export default CourseSidebar;