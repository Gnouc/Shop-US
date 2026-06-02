import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '@/api/categoryApi';
import {
  Table, Button, Modal, Form, Input, Space, Tag,
  Popconfirm, Typography, Card, Tooltip, App,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function AdminCategoriesPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      message.success('Tạo danh mục thành công');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setModalOpen(false);
    },
    onError: (err) => message.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),
    onSuccess: () => {
      message.success('Cập nhật thành công');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setModalOpen(false);
    },
    onError: (err) => message.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => {
      message.success('Đã xóa danh mục');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => message.error(err.message),
  });

  const openCreate = () => {
    setEditCategory(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditCategory(cat);
    form.setFieldsValue({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editCategory) {
        updateMutation.mutate({ id: editCategory.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  const categories = data?.data || [];
  const isPending = createMutation.isPending || updateMutation.isPending;

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, idx) => <Text type="secondary">{idx + 1}</Text>,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      render: (slug) => (
        <code style={{
          background: '#f5f5f5', padding: '2px 8px',
          borderRadius: 4, fontSize: 12, color: '#555',
        }}>
          {slug}
        </code>
      ),
    },
    {
      title: 'Sản phẩm',
      key: 'productCount',
      width: 120,
      render: (_, record) => (
        <Tag color="blue">{record._count?.products || 0} sản phẩm</Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      ellipsis: true,
      render: (desc) => <Text type="secondary">{desc || '—'}</Text>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 110,
      align: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              style={{ color: '#3b82f6' }}
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa danh mục"
            description={
              record._count?.products > 0
                ? 'Không thể xóa danh mục còn sản phẩm!'
                : `Xóa "${record.name}"?`
            }
            onConfirm={() => {
              if (record._count?.products > 0) {
                message.warning('Không thể xóa danh mục còn sản phẩm!');
                return;
              }
              deleteMutation.mutate(record.id);
            }}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, disabled: record._count?.products > 0 }}
          >
            <Tooltip title={record._count?.products > 0 ? 'Còn sản phẩm, không thể xóa' : 'Xóa'}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={record._count?.products > 0}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Quản lý danh mục</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm danh mục
        </Button>
      </div>

      {/* Table */}
      <Card size="small">
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          size="middle"
          locale={{ emptyText: 'Chưa có danh mục nào' }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={editCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText={editCategory ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        confirmLoading={isPending}
        width={480}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Tên danh mục là bắt buộc' }]}
          >
            <Input placeholder="Vitamin tổng hợp" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Mô tả danh mục..." />
          </Form.Item>

          <Form.Item name="image" label="URL ảnh">
            <Input placeholder="/images/categories/vitamins.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
