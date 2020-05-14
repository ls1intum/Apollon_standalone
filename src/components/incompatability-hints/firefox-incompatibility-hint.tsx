import React, { ReactElement, useState } from 'react';
import { Alert } from 'react-bootstrap';

export const FirefoxIncompatibilityHint: React.FC = (): ReactElement | null => {
  const [show, setShow] = useState(true);
  if (show) {
    return (
      <Alert variant="warning" onClose={() => setShow(false)} dismissible>
        {' '}
        Firefox is not fully supported - some features might not work. Please use another browser (latest Chrome or
        Safari) to make sure all features are working as expected.
      </Alert>
    );
  }
  return null;
};
