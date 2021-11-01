import React from 'react';

import Modal from './Modal';
import Button from './Button';

const SuccessModal = props => {
  return (
    <Modal
      onCancel={props.onClear}
      show={!!props.message}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      <p>{props.message}</p>
    </Modal>
  );
};

export default SuccessModal;