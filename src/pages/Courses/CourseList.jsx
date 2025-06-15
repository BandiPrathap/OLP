import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // ✅ added useLocation
import { toast } from 'react-toastify';
import {
  Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Badge, Dropdown
} from 'react-bootstrap';
import {
  Search, PlusCircle, ArrowRight, Filter, SortDown, SortUp, Clock, Calendar
} from 'react-bootstrap-icons';
import { getAllCourses } from '../../api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('courseSearchTerm') || '');
  const [sortOrder, setSortOrder] = useState(() => localStorage.getItem('courseSortOrder') || 'newest');
  const [priceFilter, setPriceFilter] = useState(() => localStorage.getItem('coursePriceFilter') || 'all');

  const navigate = useNavigate();
  const location = useLocation(); // ✅ track location state

  // ✅ Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getAllCourses();
        setCourses(res.data || []);
      } catch (err) {
        toast.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    if (location.state?.courseAdded) {
      toast.success("New course added successfully!");
      // ✅ Remove state from URL history to prevent repeated toast
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ✅ Persist filters in localStorage
  useEffect(() => localStorage.setItem('courseSearchTerm', searchTerm), [searchTerm]);
  useEffect(() => localStorage.setItem('courseSortOrder', sortOrder), [sortOrder]);
  useEffect(() => localStorage.setItem('coursePriceFilter', priceFilter), [priceFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setSortOrder('newest');
    setPriceFilter('all');
    localStorage.removeItem('courseSearchTerm');
    localStorage.removeItem('courseSortOrder');
    localStorage.removeItem('coursePriceFilter');
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Count how many filters are active
  const activeFilters =
    (searchTerm.trim() ? 1 : 0) +
    (priceFilter !== 'all' ? 1 : 0) +
    (sortOrder !== 'newest' ? 1 : 0);



  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = priceFilter === 'all' || 
                          (priceFilter === 'free' && course.price === 0) ||
                          (priceFilter === 'paid' && course.price > 0);
      
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortOrder === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortOrder === 'price-low') {
        return a.price - b.price;
      } else if (sortOrder === 'price-high') {
        return b.price - a.price;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading courses...</span>
      </div>
    );
  }
  console.log(filteredCourses);
  return (
    <Container className="py-5 animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        
        <div>
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={() => navigate("/")} // <-- Go back button
            size="sm"
          >
            &larr; Back
          </Button>
          <h1 className="h2 fw-bold mb-3">Course Catalog</h1>
          <p className="text-muted">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <Button 
          as={Link} 
          to="/courses/new" 
          variant="primary" 
          className="mb-3 mb-md-0"
        >
          <PlusCircle className="me-2" />
          Create New Course
        </Button>
      </div>

      {/* Filter/Search Bar */}
      <Card className="shadow-sm mb-4 animate-card-hover">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text className="bg-light">
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  type="search"
                  placeholder="Search courses by title or description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSearchTerm('')}
                  >
                    Clear
                  </Button>
                )}
              </InputGroup>
            </Col>
            
            <Col md={3}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-between">
                  <div>
                    <Filter className="me-2" />
                    {priceFilter === 'all' ? 'All Prices' : priceFilter === 'free' ? 'Free Only' : 'Paid Only'}
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setPriceFilter('all')}>All Prices</Dropdown.Item>
                  <Dropdown.Item onClick={() => setPriceFilter('free')}>Free Only</Dropdown.Item>
                  <Dropdown.Item onClick={() => setPriceFilter('paid')}>Paid Only</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            
            <Col md={3}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-between">
                  <div>
                    {sortOrder === 'newest' ? <SortDown className="me-2" /> : <SortUp className="me-2" />}
                    {sortOrder === 'newest' && 'Newest'}
                    {sortOrder === 'oldest' && 'Oldest'}
                    {sortOrder === 'price-low' && 'Price: Low to High'}
                    {sortOrder === 'price-high' && 'Price: High to Low'}
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSortOrder('newest')}>
                    <SortDown className="me-2" /> Newest
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortOrder('oldest')}>
                    <SortUp className="me-2" /> Oldest
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortOrder('price-low')}>
                    Price: Low to High
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortOrder('price-high')}>
                    Price: High to Low
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          
          {activeFilters > 0 && (
            <div className="mt-3">
              <Badge bg="light" text="dark" className="me-2 fw-normal">
                {activeFilters} active filter{activeFilters !== 1 ? 's' : ''}
              </Badge>
              <Button 
                variant="link" 
                className="text-decoration-none p-0"
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="text-center py-5 shadow-sm animate-fade-in">
          <Card.Body>
            <div className="display-4 text-muted mb-3">📚</div>
            <h3 className="mb-2">No courses found</h3>
            <p className="text-muted mb-4">
              {searchTerm ? `No courses match "${searchTerm}"` : 'Try adjusting your filters'}
            </p>
            <Button variant="outline-primary" onClick={clearFilters}>
              Clear filters
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredCourses.map((course, index) => (
            <Col key={course.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <Card className="h-100 shadow-sm border-0 animate-card-hover">
                <div className="position-relative">
                  {course.discount > 0 && (
                    <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                      {course.discount}% OFF
                    </Badge>
                  )}
                  <div 
                    className="bg-light border-bottom" 
                    style={{ 
                      height: '160px',
                      backgroundImage: course.imageurl ? `url(${course.imageurl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">{course.title}</Card.Title>
                    <Badge bg="light" text="dark" className="ms-2">
                      <Clock className="me-1" size={12} />
                      {course.duration} hrs
                    </Badge>
                  </div>
                  
                  <Card.Text className="text-muted flex-grow-1">
                    {course.description.length > 100 
                      ? `${course.description.substring(0, 100)}...` 
                      : course.description}
                  </Card.Text>
                  
                  <div className="mt-auto">
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
                      
                      <Badge bg="light" text="dark">
                        <Calendar className="me-1" size={12} />
                        {new Date(course.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Badge>
                    </div>
                    
                    <Button 
                      as={Link} 
                      to={`/courses/${course.id}`} 
                      variant="outline-primary" 
                      className="w-100 d-flex align-items-center justify-content-center"
                    >
                      View Details <ArrowRight className="ms-2" size={16} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CourseList;