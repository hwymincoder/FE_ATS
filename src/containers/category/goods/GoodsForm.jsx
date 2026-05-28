import React from 'react';
import { Form, Input, InputNumber, Button, Card } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const GoodsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const onFinish = (values) => {
    console.log('Save goods:', values);
    navigate('/category/goods');
  };

  return (
    <div>
      <h2>{isEdit ? 'Sửa hàng hóa' : 'Thêm hàng hóa'}</h2>
      <Card>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Mã hàng" name="goodsCode" rules={[{ required: true }]}>
            <Input disabled={isEdit} />
          </Form.Item>
          <Form.Item label="Tên hàng" name="goodsName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Đơn vị tính" name="unit">
            <Input />
          </Form.Item>
          <Form.Item label="Giá" name="price">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Lưu</Button>
              <Button onClick={() => navigate('/category/goods')}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default GoodsForm;
