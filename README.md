# 🕵️ AnonForum Free - Diễn đàn ẩn danh

![Deploy Status](https://img.shields.io/badge/Deploy-Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Frontend Only](https://img.shields.io/badge/Frontend-Only-orange)

**AnonForum Free** là phiên bản đơn giản của diễn đàn thảo luận ẩn danh, được tối ưu để deploy miễn phí trên các PaaS platform như Vercel, Netlify, GitHub Pages.

## ✨ Tính năng

### 🛡️ **Bảo mật & Ẩn danh**
- ✅ **Frontend-only** - Không backend, không server
- ✅ **LocalStorage** - Dữ liệu chỉ lưu trên máy người dùng
- ✅ **Không tracking** - Không analytics, không cookies
- ✅ **Hoàn toàn ẩn danh** - Không cần đăng ký, đăng nhập

### 💬 **Tính năng diễn đàn**
- 📝 Đăng bài ẩn danh với nhiều chủ đề
- 💬 Bình luận ẩn danh
- 👍 Like posts
- 🏷️ Tag system
- 🔍 Filter theo category
- 📱 Responsive design

### 🎨 **Giao diện**
- 🌙 Dark theme với glassmorphism
- ✨ Smooth animations
- ⚡ Fast loading
- 📱 Mobile-first design

## 🚀 Deploy nhanh (1-click)

### **Vercel** (Khuyến nghị)
[![Deploy với Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/username/anonforum-free)

### **Netlify**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/username/anonforum-free)

### **GitHub Pages**
1. Fork repository này
2. Vào Settings → Pages
3. Chọn source: Deploy from a branch
4. Branch: main, folder: / (root)
5. Save → Website sẽ available tại `https://username.github.io/anonforum-free`

## 💻 Chạy local

```bash
# Clone repository
git clone https://github.com/username/anonforum-free.git
cd anonforum-free

# Chạy local server
npm run dev
# hoặc
python -m http.server 3000
# hoặc mở trực tiếp index.html
```

## 📁 Cấu trúc dự án

```
anonforum-free/
├── index.html              # Trang chính
├── package.json            # NPM config
├── vercel.json             # Vercel config
├── netlify.toml            # Netlify config
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── app.js             # Main app logic
│   ├── storage.js         # LocalStorage management
│   └── utils.js           # Utility functions
├── assets/
│   ├── favicon.ico        # Favicon
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service Worker
└── README.md              # This file
```

## 🔧 Cấu hình PaaS

### Vercel
- ✅ Tự động deploy từ Git
- ✅ Custom domain miễn phí
- ✅ SSL certificate tự động
- ✅ CDN global
- ✅ Analytics (optional)

### Netlify  
- ✅ 100GB bandwidth/tháng
- ✅ Form handling (nếu cần)
- ✅ Edge functions
- ✅ Deploy previews

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### GitHub Pages
- ✅ Hoàn toàn miễn phí
- ✅ Tự động deploy từ repository
- ✅ Custom domain
- ⚠️ Chỉ hỗ trợ static sites

## 🛡️ Bảo mật

### Headers đã cấu hình:
```
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block  
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline';
```

### Privacy:
- ❌ Không server-side processing
- ❌ Không database
- ❌ Không IP logging
- ❌ Không analytics tracking
- ✅ Dữ liệu chỉ lưu localStorage

## 📊 Giới hạn

### LocalStorage:
- **Dung lượng**: ~5-10MB per domain
- **Persistence**: Data bị xóa khi clear browser data
- **Sharing**: Không share data giữa users

### Tính năng không có:
- ❌ Real-time updates giữa users
- ❌ User authentication  
- ❌ Moderation tools
- ❌ Data backup/sync
- ❌ Search functionality

## 🚀 Mở rộng

### Thêm tính năng:
```javascript
// js/app.js - Thêm methods mới
class AnonForum {
    // Your custom features here
}
```

### Custom theme:
```css
/* css/style.css - Thay đổi colors */
:root {
    --primary: #your-color;
    --secondary: #your-color;
}
```

### PWA features:
- ✅ Service Worker có sẵn
- ✅ Manifest.json configured  
- ✅ Offline capability
- ✅ Install as app

## 🆘 Troubleshooting

### Build errors:
```bash
# Clear cache
rm -rf node_modules
npm install
```

### Deployment issues:
```bash
# Check logs
vercel logs
# hoặc
netlify logs
```

### LocalStorage full:
```javascript
// Clear data trong DevTools
localStorage.clear();
```

## 🤝 Đóng góp

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - xem [LICENSE](LICENSE) file.

## 🔗 Links

- **Demo**: https://anonforum-free.vercel.app
- **GitHub**: https://github.com/username/anonforum-free
- **Issues**: https://github.com/username/anonforum-free/issues

## ⭐ Support

Nếu project hữu ích, hãy cho 1 star ⭐ để support!

---

<div align="center">

**🕵️ AnonForum Free - Privacy First, Deploy Anywhere**

[⭐ Star](https://github.com/username/anonforum-free) • [🚀 Deploy](https://vercel.com/new/clone?repository-url=https://github.com/username/anonforum-free) • [📱 Demo](https://anonforum-free.vercel.app)

</div>