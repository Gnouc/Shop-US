import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/api/productApi';
import ImageUploader from './ImageUploader';
import {
  Modal, Form, Input, InputNumber, Select,
  Divider, App,
} from 'antd';

const { TextArea } = Input;

export default function ProductFormModal({ product, categories, onClose }) {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const isEdit = !!product;
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);

  const showApiError = (err, fallbackMessage) => {
    const apiErrors = Array.isArray(err.errors) ? err.errors : [];

    if (apiErrors.length > 0) {
      form.setFields(
        apiErrors
          .filter((item) => item.field)
          .map((item) => ({
            name: item.field,
            errors: [item.message],
          }))
      );
      message.error(apiErrors[0].message || err.message || fallbackMessage);
      return;
    }

    message.error(err.message || fallbackMessage);
  };

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        categoryId: product.categoryId,
        description: product.description || '',
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : null,
        stock: product.stock,
        brand: product.brand || '',
        origin: product.origin || 'USA',
      });
      setImages(
        (product.images || []).map((img) => ({
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary,
          filename: null,
          id: img.id,
        }))
      );
    } else {
      form.resetFields();
      form.setFieldsValue({ origin: 'USA', stock: 0 });
      setImages([]);
    }
  }, [product, form]);

  const createMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      message.success('Tạo sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
    onError: (err) => showApiError(err, 'Tạo thất bại'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productApi.update(id, data),
    onSuccess: () => {
      message.success('Cập nhật thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
    onError: (err) => showApiError(err, 'Cập nhật thất bại'),
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        price: Number(values.price),
        salePrice: values.salePrice === undefined || values.salePrice === null ? null : Number(values.salePrice),
        stock: Number(values.stock),
        images: images.map((img, idx) => ({
          url: img.imageUrl,
          isPrimary: img.isPrimary || idx === 0,
        })),
      };
      if (isEdit) {
        updateMutation.mutate({ id: product.id, data: payload });
      } else {
        createMutation.mutate(payload);
      }
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      open
      onCancel={onClose}
      onOk={handleOk}
      okText={isEdit ? 'Cập nhật' : 'Tạo sản phẩm'}
      cancelText="Hủy"
      confirmLoading={isPending}
      width={680}
      destroyOnClose
      styles={{ body: { maxHeight: '75vh', overflowY: 'auto', paddingRight: 4 } }}
    >
      {/* Image Uploader */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
          Hình ảnh sản phẩm
          <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: 4 }}>(tối đa 5 ảnh)</span>
        </div>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <Form form={form} layout="vertical" requiredMark="optional">
        {/* Name */}
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: 'Tên sản phẩm là bắt buộc' }]}
        >
          <Input placeholder="Nature Made Multivitamin" />
        </Form.Item>

        {/* Category */}
        <Form.Item
          name="categoryId"
          label="Danh mục"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
        >
          <Select
            options={categoryOptions}
            placeholder="-- Chọn danh mục --"
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        {/* Price row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="price"
            label="Giá gốc (VNĐ)"
            rules={[{ required: true, message: 'Giá là bắt buộc' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => v.replace(/,/g, '')}
              placeholder="450000"
            />
          </Form.Item>

          <Form.Item name="salePrice" label="Giá sale (để trống nếu không)">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => v.replace(/,/g, '')}
              placeholder="399000"
            />
          </Form.Item>
        </div>

        {/* Stock */}
        <Form.Item
          name="stock"
          label="Số lượng tồn kho"
          rules={[{ required: true, message: 'Tồn kho là bắt buộc' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} placeholder="100" />
        </Form.Item>

        {/* Brand & Origin */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item name="brand" label="Thương hiệu">
            <Input placeholder="Nature Made" />
          </Form.Item>
          <Form.Item name="origin" label="Xuất xứ">
            <Input placeholder="USA" />
          </Form.Item>
        </div>

        {/* Description */}
        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} placeholder="Mô tả chi tiết sản phẩm..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
