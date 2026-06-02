import { useState, useRef } from 'react';
import { Upload, Image, Button, App, Tooltip, Badge } from 'antd';
import {
  PlusOutlined,
  StarOutlined,
  StarFilled,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { uploadApi } from '@/api/uploadApi';
import { API_BASE_URL } from '@/api/axiosClient';

/**
 * images: [{ imageUrl, isPrimary, filename, uid? }]
 * onChange: (images) => void  OR  onChange: (fn) => void  (React setState)
 */
export default function ImageUploader({ images = [], onChange }) {
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');

  // ref để tránh stale closure trong customRequest/beforeUpload
  const imagesRef = useRef(images);
  imagesRef.current = images;

  const getFullUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
  };

  // beforeUpload: chỉ validate type/size, KHÔNG check số lượng ở đây
  const beforeUpload = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      message.error(`"${file.name}" không phải ảnh hợp lệ (JPG, PNG, WEBP)`);
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 > 5) {
      message.error(`"${file.name}" vượt quá 5MB`);
      return Upload.LIST_IGNORE;
    }
    // Luôn trả về true để customRequest được gọi
    return true;
  };

  // customRequest: upload lên server rồi cập nhật state
  const handleUpload = async ({ file, onSuccess, onError }) => {
    // Dùng ref để đọc images mới nhất, tránh stale closure
    if (imagesRef.current.length >= 5) {
      message.warning('Tối đa 5 ảnh cho mỗi sản phẩm');
      onError(new Error('Max 5 images'));
      return;
    }

    setUploading(true);
    try {
      const res = await uploadApi.uploadImage(file);

      // axiosClient interceptor đã unwrap response.data
      // → res = { success: true, data: { imageUrl, filename } }
      const imageUrl = res?.data?.imageUrl;
      const filename = res?.data?.filename;

      if (!imageUrl) {
        throw new Error('Server không trả về URL ảnh');
      }

      const newImage = {
        uid: `upload-${Date.now()}-${Math.random()}`,
        imageUrl,
        filename,
        isPrimary: false,
      };

      // Dùng functional update để tránh stale closure
      onChange((prev) => {
        const arr = Array.isArray(prev) ? prev : [];
        const updated = [...arr, newImage];
        // Nếu chưa có ảnh primary → đặt ảnh đầu tiên
        if (!updated.some((img) => img.isPrimary)) {
          updated[0] = { ...updated[0], isPrimary: true };
        }
        return updated;
      });

      message.success('Upload thành công');
      onSuccess(res);
    } catch (err) {
      console.error('Upload error:', err);
      message.error(err.message || 'Upload thất bại');
      onError(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (index) => {
    const img = images[index];
    // Chỉ xóa file mới upload (có filename), không xóa ảnh cũ từ DB
    if (img.filename) {
      try {
        await uploadApi.deleteImage(img.filename);
      } catch { /* ignore server delete error */ }
    }
    const newImages = images.filter((_, i) => i !== index);
    if (img.isPrimary && newImages.length > 0) {
      newImages[0] = { ...newImages[0], isPrimary: true };
    }
    onChange(newImages);
  };

  const handleSetPrimary = (index) => {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  return (
    <div>
      {/* Grid ảnh đã upload */}
      {images.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
          {images.map((img, index) => (
            <Badge
              key={img.uid || img.imageUrl || index}
              count={img.isPrimary
                ? <StarFilled style={{ color: '#f59e0b', fontSize: 15 }} />
                : 0
              }
              offset={[-4, 4]}
            >
              <div
                className="img-upload-item"
                style={{
                  width: 96, height: 96,
                  position: 'relative',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: img.isPrimary ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                  background: '#f9fafb',
                  flexShrink: 0,
                  cursor: 'pointer',
                }}
              >
                {/* Ảnh */}
                <img
                  src={getFullUrl(img.imageUrl)}
                  alt={`product-${index}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onClick={() => {
                    setPreviewSrc(getFullUrl(img.imageUrl));
                    setPreviewOpen(true);
                  }}
                  onError={(e) => {
                    // fallback nếu ảnh load lỗi
                    e.target.style.display = 'none';
                  }}
                />

                {/* Overlay actions khi hover */}
                <div
                  className="img-upload-overlay"
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 6,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {!img.isPrimary && (
                    <Tooltip title="Đặt làm ảnh chính">
                      <Button
                        type="text" size="small"
                        icon={<StarOutlined style={{ color: '#fff' }} />}
                        onClick={(e) => { e.stopPropagation(); handleSetPrimary(index); }}
                        style={{
                          background: 'rgba(245,158,11,0.85)',
                          borderRadius: 6,
                          width: 32, height: 32, padding: 0,
                        }}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title="Xóa ảnh">
                    <Button
                      type="text" size="small"
                      icon={<DeleteOutlined style={{ color: '#fff' }} />}
                      onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                      style={{
                        background: 'rgba(239,68,68,0.85)',
                        borderRadius: 6,
                        width: 32, height: 32, padding: 0,
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            </Badge>
          ))}
        </div>
      )}

      {/* Upload zone - AntD Dragger */}
      {images.length < 5 && (
        <Upload.Dragger
          customRequest={handleUpload}
          beforeUpload={beforeUpload}
          showUploadList={false}
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          disabled={uploading}
          style={{ borderRadius: 8 }}
        >
          <div style={{ padding: '16px 0' }}>
            {uploading ? (
              <>
                <LoadingOutlined style={{ fontSize: 28, color: '#0284c7' }} />
                <div style={{ marginTop: 8, color: '#0284c7', fontWeight: 500 }}>
                  Đang upload...
                </div>
              </>
            ) : (
              <>
                <PlusOutlined style={{ fontSize: 28, color: '#9ca3af' }} />
                <div style={{ marginTop: 8, color: '#374151', fontWeight: 500 }}>
                  Click hoặc kéo thả ảnh vào đây
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                  JPG, PNG, WEBP · tối đa 5MB/ảnh · ({images.length}/5)
                </div>
              </>
            )}
          </div>
        </Upload.Dragger>
      )}

      {images.length > 0 && (
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
          Hover vào ảnh → ⭐ ảnh chính · 🗑️ xóa · click để xem lớn
        </div>
      )}

      {/* Lightbox preview */}
      <Image
        style={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          src: previewSrc,
          onVisibleChange: setPreviewOpen,
        }}
      />

      {/* Hover effect CSS */}
      <style>{`
        .img-upload-item:hover .img-upload-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
