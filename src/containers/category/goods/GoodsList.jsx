import React, { useState } from 'react';
import { Table, Button, Space, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const GoodsList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: 'Mã hàng', dataIndex: 'goodsCode', key: 'goodsCode' },
    { title: 'Tên hàng', dataIndex: 'goodsName', key: 'goodsName' },
    { title: 'Đơn vị tính', dataIndex: 'unit', key: 'unit' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (v) => v?.toLocaleString() },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/category/goods/${record.id}`)} />
          <Button icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Hàng hóa</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/category/goods/new')}>
          Thêm mới
        </Button>
      </div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="Tìm kiếm..." style={{ width: 300 }} />
      </Space>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />
    </div>
  );
};

export default GoodsList;
