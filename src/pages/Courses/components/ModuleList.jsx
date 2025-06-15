// src/pages/courses/components/ModuleList.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  Card, 
  Button, 
  Badge, 
  Accordion,
  Form,
  InputGroup
} from 'react-bootstrap';
import { 
  FileText,
  Plus,
  X,
  Save,
  Pencil,
  Trash
} from 'react-bootstrap-icons';
import LessonList from './LessonList';
import { 
  createModule,
  updateModule,
  deleteModule
} from '../../../api';

const ModuleList = ({ course, setCourse }) => {
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [showAddModule, setShowAddModule] = useState(false);

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

  const handleModuleTitleChange = (moduleId, value) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => 
        m.id === moduleId ? { ...m, title: value } : m
      )
    }));
  };

  return (
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
                  <LessonList 
                    module={module}
                    course={course}
                    setCourse={setCourse}
                  />
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
  );
};

export default ModuleList;