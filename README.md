# Ray Stock Market

Ray Stock Market là ứng dụng bảng giá chứng khoán mô phỏng giao diện priceboard theo phong cách thị trường Việt Nam. Dự án được xây dựng bằng React, TypeScript và Vite, tập trung vào trải nghiệm xem nhanh chỉ số, mã chứng khoán, dư mua, khớp lệnh, dư bán, giao dịch nước ngoài và biểu đồ trong ngày.

## Tính năng chính

- Bảng giá chứng khoán với các cột giá trần, tham chiếu, sàn, dư mua, khớp lệnh, dư bán, cao, trung bình, thấp và khối lượng.
- Mô phỏng cập nhật giá theo thời gian thực bằng dữ liệu local.
- Thanh chỉ số thị trường với biểu đồ mini và trạng thái tăng giảm.
- Bộ lọc theo nhóm dữ liệu Vietcap như watchlist, chỉ số, ngành, trái phiếu và chứng quyền.
- Tìm kiếm và thêm mã vào watchlist.
- Modal biểu đồ trong ngày khi bấm vào mã chứng khoán hoặc chỉ số.
- Hỗ trợ dark mode và light mode.
- CI/CD bằng GitHub Actions, build Vite và deploy GitHub Pages qua branch `gh-pages`.

## Công nghệ sử dụng

- React 19
- TypeScript
- Vite
- ESLint
- AG Grid Community / AG Grid React
- shadcn-ui
- GitHub Actions
- GitHub Pages

## Cấu trúc thư mục

```text
src/
  components/          Các component giao diện chính
  data/generated/      Dữ liệu Vietcap đã được sinh sẵn
  data/mockMarket.ts   Dữ liệu mock chỉ số/thị trường
  lib/                 Hàm format, filter, normalize và mô phỏng giá
  types/               TypeScript types cho priceboard và Vietcap data
  App.tsx              Entry component của ứng dụng
  main.tsx             React bootstrap

.github/workflows/
  deploy.yml           Workflow CI/CD deploy GitHub Pages
```

## Yêu cầu môi trường

- Node.js 22 hoặc mới hơn
- npm

## Cài đặt

```bash
npm ci
```

Nếu đang phát triển local và chưa có `package-lock.json` đồng bộ, có thể dùng:

```bash
npm install
```

## Chạy local

```bash
npm run dev
```

Sau đó mở URL Vite hiển thị trong terminal, thường là:

```text
http://127.0.0.1:5173/
```

## Kiểm tra chất lượng code

```bash
npm run lint
```

## Build production

```bash
npm run build
```

Build output nằm trong thư mục:

```text
dist/
```

Với GitHub Pages project site, workflow sẽ truyền `VITE_BASE_URL` theo tên repository để asset được build đúng path, ví dụ:

```bash
VITE_BASE_URL=/ray-stock-market/ npm run build
```

## Preview production build

```bash
npm run preview
```

## Đồng bộ dữ liệu Vietcap

Dự án có script:

```bash
npm run sync:vietcap-data
```

Script này chạy `scripts/sync-vietcap-data.mjs` để đồng bộ/generate dữ liệu vào `src/data/generated/`.

## CI/CD và GitHub Pages

Workflow nằm tại:

```text
.github/workflows/deploy.yml
```

Luồng CI/CD hiện tại:

- Khi có `pull_request` vào `main`: chạy `npm ci`, `npm run lint`, `npm run build`.
- Khi có `push` vào `main`: chạy kiểm tra như trên, build project, rồi publish thư mục `dist` lên branch `gh-pages`.
- GitHub Pages đọc nội dung public từ branch `gh-pages`, folder `/`.

Thiết lập GitHub Pages:

1. Vào repository GitHub.
2. Mở `Settings > Pages`.
3. Ở `Build and deployment`, chọn `Deploy from a branch`.
4. Chọn branch `gh-pages`.
5. Chọn folder `/ (root)`.
6. Bấm `Save`.

URL public dự kiến:

```text
https://nanxnguyen.github.io/ray-stock-market/
```

## Ghi chú

- Vite có thể cảnh báo bundle JavaScript lớn do ứng dụng bảng giá và dữ liệu UI khá nhiều. Đây là warning tối ưu hiệu năng, không phải lỗi build.
- Nếu GitHub Pages trả 404 ngay sau khi deploy, hãy đợi thêm vài phút và kiểm tra workflow mới nhất trong tab `Actions`.
- Nếu đổi tên repository, URL public và `VITE_BASE_URL` cũng sẽ đổi theo tên repository mới.
