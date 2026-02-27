# 🌤️ Hướng dẫn Setup Cloudinary cho Upload Ảnh

## ✅ Tại sao dùng Cloudinary?

- ✅ **Miễn phí**: 25GB storage, 25GB bandwidth/tháng
- ✅ **Không cần backend**: Upload trực tiếp từ frontend
- ✅ **CDN toàn cầu**: Ảnh load nhanh ở mọi nơi
- ✅ **Auto optimize**: Tự động resize, compress, convert format
- ✅ **Không giới hạn request**: Không cần API key với unsigned preset

## 🚀 Setup trong 3 phút

### Bước 1: Đăng ký tài khoản miễn phí

1. Truy cập: https://cloudinary.com/users/register_free
2. Điền email, password
3. Verify email
4. ✅ Xong! Vào Dashboard

### Bước 2: Tạo Upload Preset (Unsigned)

1. Vào **Settings** (góc trên bên phải)
2. Click tab **Upload**
3. Scroll xuống phần **Upload presets**
4. Click **Add upload preset**
5. Điền thông tin:
   - **Preset name**: `happybox_unsigned`
   - **Signing Mode**: Chọn **Unsigned** ⚠️ (quan trọng!)
   - **Folder**: `products` (optional - để organize)
   - **Allowed formats**: `jpg,png,jpeg,webp`
6. Click **Save**
7. ✅ Copy **Preset name** vừa tạo

### Bước 3: Lấy Cloud Name

1. Vào **Dashboard** (trang chủ sau khi login)
2. Nhìn phần **Product Environment Credentials**
3. Tìm dòng **Cloud name**: `dxxxxxxxx`
4. ✅ Copy Cloud Name

### Bước 4: Cập nhật Code

Mở file: `src/services/uploadService.ts`

```typescript
class UploadService {
  // THAY ĐỔI 2 DÒNG NÀY:
  private cloudName = "dxxxxxxxx"; // ← Paste Cloud Name của bạn
  private uploadPreset = "happybox_unsigned"; // ← Paste Preset Name của bạn

  // ...
}
```

### Bước 5: Test

1. Chạy app: `npm run dev`
2. Vào Admin → Quản lý sản phẩm → Thêm sản phẩm mới
3. Upload ảnh
4. Check console log:
   - `📤 Đang upload X ảnh lên Cloudinary...`
   - `☁️ Upload Cloudinary thành công: [urls]`
   - `✅ Lưu ảnh vào database thành công`

5. Kiểm tra URL ảnh trong database - nó sẽ có dạng:
   ```
   https://res.cloudinary.com/dxxxxxxxx/image/upload/v1234567890/products/abc123.jpg
   ```

## 📊 Kiểm tra Usage (Dung lượng đã dùng)

1. Vào Cloudinary Dashboard
2. Xem phần **Usage** ở sidebar
3. Theo dõi:
   - Storage: XX / 25GB
   - Bandwidth: XX / 25GB/month
   - Transformations: Unlimited

## 🔧 Troubleshooting

### Lỗi: "Upload failed: Unauthorized"

- ✅ **Giải pháp**: Kiểm tra `Signing Mode` = **Unsigned** trong Upload Preset
- Xóa preset cũ, tạo lại và chọn **Unsigned**

### Lỗi: "Upload failed: Not Found"

- ✅ **Giải pháp**:
  - Kiểm tra `cloudName` đúng chưa
  - Kiểm tra `uploadPreset` name đúng chưa (case-sensitive)

### Ảnh upload chậm

- ✅ **Bình thường**: Lần đầu upload có thể mất 3-5 giây
- File lớn (>2MB) sẽ upload lâu hơn
- Khuyến nghị: Resize ảnh trước khi upload (< 1MB)

### Vượt quá 25GB/tháng?

- ✅ Có thể upgrade plan (từ $99/tháng)
- Hoặc optimize: Xóa ảnh cũ không dùng
- Hoặc chuyển sang AWS S3

## 🎯 Best Practices

1. **Resize ảnh trước khi upload**:
   - Product images: Max 1200x1200px
   - Thumbnails: 400x400px

2. **Organize với folders**:

   ```
   /products/product-123-main.jpg
   /products/product-123-thumbnail.jpg
   /categories/category-abc.jpg
   ```

3. **Use transformations** (auto optimize):
   ```typescript
   // Cloudinary tự động optimize khi access URL:
   https://res.cloudinary.com/.../w_800,h_800,c_fill,f_auto,q_auto/product.jpg
   //                             ↑ width ↑ height ↑ crop ↑ format ↑ quality
   ```

## 🆓 Free Tier Limits

| Feature         | Free Tier            |
| --------------- | -------------------- |
| Storage         | 25 GB                |
| Bandwidth       | 25 GB/month          |
| Transformations | Unlimited            |
| Images          | Unlimited            |
| CDN             | Global               |
| API Requests    | Unlimited (unsigned) |

## ❓ FAQ

**Q: Có cần API Key không?**
A: Không! Với **Unsigned Upload Preset**, không cần API key hay secret.

**Q: Ảnh có bị mất không?**
A: Không. Cloudinary lưu vĩnh viễn, có backup, 99.9% uptime.

**Q: Có thể dùng cho production không?**
A: Có! Nhiều startup lớn dùng Cloudinary (Airbnb, Shopify, etc.)

**Q: Nếu muốn xóa ảnh thì sao?**
A: Backend cần API key để xóa. Hoặc xóa manually trên Cloudinary Dashboard.

**Q: Có giải pháp khác không?**
A: Có:

- **Imgbb**: Free, đơn giản hơn nhưng ít tính năng
- **AWS S3**: Professional, cần backend integration
- **Firebase Storage**: Tốt nếu đang dùng Firebase
- **Self-hosted**: Upload lên server của bạn (cần backend API)

## 🔗 Tài liệu tham khảo

- Dashboard: https://cloudinary.com/console
- Docs: https://cloudinary.com/documentation
- Upload API: https://cloudinary.com/documentation/upload_images
- Free tier: https://cloudinary.com/pricing

---

✅ **Xong!** Giờ bạn có thể upload ảnh lên cloud miễn phí, không cần lo database phình to!
