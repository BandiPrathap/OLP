// src/pages/courses/components/DeleteModal.jsx
import { Modal, Button, Spinner } from 'react-bootstrap';

const DeleteModal = ({ 
  show, 
  setShow, 
  deleting, 
  handleDelete, 
  courseTitle 
}) => {
  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">
          Are you sure you want to delete <strong>"{courseTitle}"</strong>?
        </p>
        <p className="text-danger">
          This action cannot be undone. All course data will be permanently removed.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
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
  );
};

export default DeleteModal;