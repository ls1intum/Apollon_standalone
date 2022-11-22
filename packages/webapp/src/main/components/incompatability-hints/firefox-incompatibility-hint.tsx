import React, { ReactElement, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';

export const FirefoxIncompatibilityHint: React.FC = (): ReactElement | null => {
  const [show, setShow] = useState(true);
  return (
    <Alert variant="warning" onClose={() => setShow(false)} show={show}>
      {' '}
      Firefox is not fully supported - some features might not work. Please use another browser (latest Chrome or
      Safari) to make sure all features are working as expected.
      <Button variant="warning" onClick={() => setShow(false)} type="button" className="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </Button>
    </Alert>
  );
};
