import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

type Props = {};

export const FirefoxIncompatibilityHint = (props: Props) => {
  const [show, setShow] = useState(true);
  return (
    show && (
      <Alert variant="warning" onClose={() => setShow(false)} dismissible>
        {' '}
        Firefox is not fully supported - some features might not work. Please use another browser (latest Chrome or Safari) to make sure all
        features are working as expected.
      </Alert>
    )
  );
};
