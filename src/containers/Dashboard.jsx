import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t('dashboard.title')}</h2>
      <p>{t('dashboard.welcome')}</p>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng đơn hàng" value={0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Doanh thu" value={0} prefix="₫" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Khách hàng" value={0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Sản phẩm" value={0} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
