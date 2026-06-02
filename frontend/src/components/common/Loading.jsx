import { Spin } from 'antd';

export default function Loading({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
      }}>
        <Spin size="large" />
        <span style={{ color: '#6b7280' }}>Đang tải...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
      <Spin size="default" />
    </div>
  );
}
