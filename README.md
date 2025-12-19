# BrainHub - English Learning Platform

BrainHub là nền tảng học tiếng Anh toàn diện với các tính năng flashcard, quiz, grammar và reading comprehension.

## Tính năng chính

- **Flashcard**: Học từ vựng với hệ thống thẻ ghi nhớ
- **Quiz**: Làm bài kiểm tra trắc nghiệm với nhiều cấp độ
- **Grammar**: Học ngữ pháp tiếng Anh
- **Reading**: Luyện đọc hiểu với các bài đọc


## Công nghệ sử dụng

### Frontend
- React + Vite
- TailwindCSS
- React Router
- Axios
- React Hot Toast

### Backend
- Node.js + Express
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Bcrypt

## Cài đặt và chạy project

### 1. Clone repository
```bash
git clone <repository-url>
cd DA_brainhub
```

### 2. Cài đặt Backend

```bash
cd server
npm install
```

Tạo file `.env` trong thư mục `server` (copy từ `.env.example`):
```bash
cp .env.example .env
```

Sau đó cập nhật các giá trị trong file `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=brainhub
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

Chạy server:
```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

### 3. Cài đặt Frontend

```bash
cd client
npm install
```

Chạy client:
```bash
npm run dev
```

Client sẽ chạy tại: `http://localhost:5173`

## Sử dụng

1. Mở trình duyệt và truy cập `http://localhost:5173`
2. Đăng ký tài khoản hoặc đăng nhập
3. Bắt đầu học tiếng Anh với các tính năng có sẵn

## Cấu trúc project

```
DA_brainhub/
├── client/          # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
├── server/          # Backend Node.js application
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── seeders/
│   └── package.json
└── README.md
```

## License

MIT
