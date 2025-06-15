// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllCourses, getAllJobs, getAllApplications } from '../api';
import { 
  Card, 
  Container, 
  Row, 
  Col, 
  Spinner, 
  Button,
  Badge
} from 'react-bootstrap';
import { 
  JournalBookmark, 
  Briefcase, 
  ClipboardData, 
  PlusCircle,
  JournalPlus,
  BriefcaseFill
} from 'react-bootstrap-icons';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    courses: 0,
    jobs: 0,
    applications: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const cached = localStorage.getItem('dashboardData');
      const oneHour = 60 * 60 * 1000;

      if (cached) {
        const parsed = JSON.parse(cached);
        const isExpired = Date.now() - parsed.timestamp > oneHour;

        if (!isExpired) {
          setStats(parsed.stats);
          setRecentCourses(parsed.recentCourses);
          setRecentJobs(parsed.recentJobs);
          setLoading(false);
          return;
        } else {
          localStorage.removeItem('dashboardData'); // Expired
        }
      }

      try {
        const [coursesRes, jobsRes, applicationsRes] = await Promise.all([
          getAllCourses(),
          getAllJobs(),
          getAllApplications()
        ]);

        const sortedCourses = [...coursesRes.data]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);

        const sortedJobs = [...jobsRes.data]
          .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
          .slice(0, 3);

        const applicationsCount = applicationsRes.data.length;

        const dashboardData = {
          stats: {
            courses: coursesRes.data.length,
            jobs: jobsRes.data.length,
            applications: applicationsCount
          },
          recentCourses: sortedCourses,
          recentJobs: sortedJobs,
          timestamp: Date.now()
        };

        // Store in localStorage
        localStorage.setItem('dashboardData', JSON.stringify(dashboardData));

        setStats(dashboardData.stats);
        setRecentCourses(dashboardData.recentCourses);
        setRecentJobs(dashboardData.recentJobs);

        toast.success('Dashboard data loaded successfully!', {
          position: 'top-right',
          autoClose: 3000
        });

      } catch (error) {
        toast.error('Failed to load dashboard data', {
          position: 'top-right',
          autoClose: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


  const handleLogout = () => {
  localStorage.removeItem('token'); // remove token
  toast.success('Logged out successfully!');
  navigate('/login'); // redirect to login page
};

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" role="status" />
          <h4 className="mt-3">Loading dashboard data...</h4>
          <p className="text-muted">Please wait while we gather your information</p>
        </div>
      </div>
    );
  }

  return (
    <Container className="py-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-primary" style={{fontSize:"1.5rem"}} >
          <BriefcaseFill className="me-2"/>
          Admin Dashboard
        </h1>
        <Badge bg="light" text="dark" className="fs-6 p-2">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Badge>
        <Button variant="outline-danger" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Row className="g-4 mb-4">
        <DashboardCard 
          title="Courses" 
          value={stats.courses} 
          link="/courses" 
          linkText="Manage Courses"
          icon={<JournalBookmark size={36} />}
          color="primary"
        />
        
        <DashboardCard 
          title="Job Listings" 
          value={stats.jobs} 
          link="/jobs" 
          linkText="Manage Jobs"
          icon={<Briefcase size={36} />}
          color="success"
        />
        
        <DashboardCard 
          title="Applications" 
          value={stats.applications} 
          link="/applications" 
          linkText="View Applications"
          icon={<ClipboardData size={36} />}
          color="warning"
        />
      </Row>

      <Row className="g-4 mb-5">
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0 animate-card-hover">
            <Card.Body className="d-flex flex-column p-4">
              <div className="d-flex align-items-center mb-3">
                <JournalPlus size={32} className="text-primary me-3" />
                <Card.Title className="mb-0">Create New Course</Card.Title>
              </div>
              <Card.Text className="text-muted flex-grow-1">
                Add a new learning course to the platform with detailed curriculum
              </Card.Text>
              <Button 
                as={Link} 
                to="/courses/new" 
                variant="primary" 
                className="mt-3 align-self-start"
              >
                <PlusCircle className="me-1" />
                Create Course
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0 animate-card-hover">
            <Card.Body className="d-flex flex-column p-4">
              <div className="d-flex align-items-center mb-3">
                <Briefcase size={32} className="text-success me-3" />
                <Card.Title className="mb-0">Post New Job</Card.Title>
              </div>
              <Card.Text className="text-muted flex-grow-1">
                Add a new job opportunity with detailed requirements and description
              </Card.Text>
              <Button 
                as={Link} 
                to="/jobs/new" 
                variant="success" 
                className="mt-3 align-self-start"
              >
                <PlusCircle className="me-1" />
                Post Job
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <RecentItems 
          title="Recent Courses" 
          items={recentCourses} 
          link="/courses"
          icon={<JournalBookmark className="me-2" />}
        />
        
        <RecentItems 
          title="Recent Job Postings" 
          items={recentJobs} 
          link="/jobs"
          icon={<Briefcase className="me-2" />}
        />
      </Row>
    </Container>
  );
};

const DashboardCard = ({ 
  title, 
  value, 
  link, 
  linkText, 
  icon, 
  color, 
  trend 
}) => (
  <Col md={4}>
    <Card className={`h-100 shadow-sm border-0 border-start border-4 border-${color} animate-card-hover`}>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <div className={`text-${color} mb-2`}>
              {icon}
            </div>
            <Card.Title className="text-muted fs-6 mb-1">{title}</Card.Title>
          </div>
        </div>
        
        <div className="d-flex align-items-end">
          <h2 className="fw-bold mb-0">{value}</h2>
          <Link 
            to={link} 
            className={`ms-auto text-${color} text-decoration-none small fw-bold`}
          >
            {linkText} →
          </Link>
        </div>
      </Card.Body>
    </Card>
  </Col>
);

const RecentItems = ({ title, items, link, icon }) => (
  <Col md={6}>
    <Card className="h-100 shadow-sm border-0">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">
            {icon}
            {title}
          </Card.Title>
          <Link to={link} className="text-decoration-none small">
            View All →
          </Link>
        </div>
        
        <div className="list-group list-group-flush">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div 
                key={index} 
                className={`list-group-item list-group-item-action border-0 px-0 py-3 animate-fade-in delay-${index + 1}`}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1 fw-bold">{item.title || item.jobTitle}</h6>
                  <small className="text-muted">
                    {item.created_at 
                      ? new Date(item.created_at).toLocaleDateString() 
                      : new Date(item.postedDate).toLocaleDateString()}
                  </small>
                </div>
                <p className="mb-0 text-truncate text-muted">
                  {item.description || item.jobDescription}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No items found</p>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  </Col>
);

export default DashboardPage;