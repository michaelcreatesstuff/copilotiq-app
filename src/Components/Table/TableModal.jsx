import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const TableModal = ({ title, data }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        View All
      </Button>
      <Modal title={title} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div style={{ height: '50vh', overflowY: 'scroll' }}>
          {data?.map((a) => {
            return <div key={a.value}>{a.value}</div>;
          })}
        </div>
      </Modal>
    </>
  );
};

export default TableModal;
