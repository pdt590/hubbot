# Đề xuất: Thêm các connected apps tại Việt Nam

> Trạng thái: **chỉ phân tích khả thi, chưa triển khai.** Không có thay đổi mã nguồn nào.

## 1. Phạm vi

Danh sách 16 ứng dụng trong mục "Ứng dụng Trọng tâm tại Việt Nam" (ảnh mẫu):

Zalo Web, Telegram, TikTok (Kênh & TikTok Studio), TikTok Shop Seller VN, TikTok Affiliate Center, Shopee Kênh Người Bán, Lazada Seller Center, Meta Business Suite, Lark Suite & Lark Base, Kalodata Việt Nam, Pancake Đa Kênh, KiotViet Quản lý, Thư viện Pháp luật, VietQR, SePay, Hóa đơn Điện tử Thuế.

## 2. Hiện trạng trong repo

| Thành phần                                        | Vị trí                                                                                       | Ý nghĩa cho đề xuất                                                                                                                                                     |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Connected apps qua Composio (managed / self-hosted) | `server/composio*.ts`, `shared/connector-curated.ts`, `shared/connector-availability.ts` | Đường chính để thêm app có OAuth/API key. Danh sách curated hiện chỉ có app quốc tế (slack, github, notion, stripe…), chưa có app nào trong 16 mục trên. |
| Trình duyệt bot (agent-browser / Chrome qua CDP)  | `server/browser/`                                                                            | Đường dự phòng cho app không có API. Skill `shopee-analysis` đã dùng cách này.                                                                                 |
| Webhook đầu vào                                  | `server/webhook-ingress.ts`                                                                  | Dùng cho app đẩy sự kiện về (SePay, Pancake, Telegram, Lark).                                                                                                          |
| Skill tra cứu/tạo nội dung                       | `skills/`, `shared/app-*.ts`                                                               | Phù hợp với app chỉ là công cụ tiện ích (VietQR).                                                                                                                   |

Không thấy mã tích hợp sẵn nào cho Zalo, Telegram, Shopee, Lazada, Lark, KiotViet, Pancake, SePay, VietQR hay Kalodata trong `server/` và `shared/`. Một số tên khớp là kết quả trùng ký tự (ví dụ `parsePayload` khớp "sepay").

## 3. Đánh giá từng ứng dụng

Mức khả thi: **Cao** = có API công khai, xác thực rõ, ít rủi ro. **Trung bình** = có API nhưng phải đăng ký app/đối tác hoặc qua duyệt. **Thấp** = không có API công khai hoặc rủi ro pháp lý/bảo mật lớn.

| #  | Ứng dụng                                                                       | Đường tích hợp khả thi                                                                                  | Khả thi                             | Rủi ro / ghi chú                                                                                                                                 |
| -- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | [Zalo Web](https://chat.zalo.me)                                                  | Zalo Official Account (OA) API cho kênh doanh nghiệp. Tài khoản Zalo cá nhân không có API công khai. | Thấp (cá nhân) / Trung bình (OA) | Tự động hóa Zalo Web ngoài API có thể vi phạm điều khoản và làm khóa tài khoản. Chỉ nên làm OA.                                 |
| 2  | [Telegram](https://web.telegram.org/k/)                                           | Bot API (bot token + webhook)                                                                                 | **Cao**                        | Đơn giản nhất. Dùng được `webhook-ingress` có sẵn cho báo cáo tự động.                                                            |
| 3  | [TikTok (Kênh &amp; TikTok Studio)](https://www.tiktok.com)                      | TikTok for Developers: Login Kit và Content Posting API                                                      | Trung bình                          | Cần đăng ký app và qua duyệt để có quyền đăng video. API phân tích kênh hạn chế.                                                  |
| 4  | [TikTok Shop Seller VN](https://seller-vn.tiktok.com)                             | TikTok Shop Open Platform API (đăng ký partner app, ký yêu cầu)                                         | Trung bình                          | Cần đăng ký đối tác và xác nhận hỗ trợ cho Việt Nam.                                                                                  |
| 5  | [TikTok Affiliate Center](https://affiliate.tiktok.com)                           | Chưa thấy API công khai để tìm KOC/KOL. Chỉ có đường trình duyệt.                                | Thấp–Trung bình                   | Dựa vào giao diện web, dễ vỡ khi trang đổi.                                                                                                 |
| 6  | [Shopee Kênh Người Bán](https://banhang.shopee.vn)                            | Shopee Open Platform API (partner app, OAuth theo shop, chữ ký)                                             | Trung bình–Cao                     | Đã có skill `shopee-analysis` chạy qua trình duyệt làm phương án dự phòng. API nên ưu tiên cho đơn hàng và sản phẩm.        |
| 7  | [Lazada Seller Center](https://sellercenter.lazada.vn)                            | Lazada Open Platform (seller API, OAuth)                                                                      | Trung bình                          | Cần đăng ký app trên cổng nhà phát triển Lazada.                                                                                          |
| 8  | [Meta Business Suite](https://business.facebook.com)                              | Graph API / Marketing API (Pages, Messenger, Ads)                                                             | Trung bình                          | Cần Meta App và duyệt quyền nâng cao (App Review, xác minh doanh nghiệp). Ảnh mẫu cho thấy app này có cả đường "Chrome · active". |
| 9  | [Lark Suite &amp; Lark Base](https://www.larksuite.com)                           | Lark Open API (app nội bộ hoặc marketplace, tenant access token), Base API                                 | **Cao**                        | Tài liệu rõ ràng. Phù hợp làm đích ghi dữ liệu (bảng Base).                                                                            |
| 10 | [Kalodata Việt Nam](https://kalodata.com)                                        | Không thấy API công khai. Là SaaS phân tích, có thuê bao.                                             | Thấp–Trung bình                   | Chỉ dùng trình duyệt, phụ thuộc gói thuê bao và điều khoản dịch vụ.                                                                  |
| 11 | [Pancake Đa Kênh](https://pancake.vn)                                           | Pancake Open API (API key hoặc token theo shop)                                                              | Trung bình–Cao                     | Cần xác minh tài liệu API hiện hành và phạm vi quyền.                                                                                     |
| 12 | [KiotViet Quản lý](https://www.kiotviet.vn)                                     | KiotViet Public API (đăng ký ứng dụng, xác thực theo cửa hàng)                                       | Trung bình–Cao                     | Cần xác minh điều kiện cấp quyền cho bên thứ ba.                                                                                          |
| 13 | [Thư viện Pháp luật](https://thuvienphapluat.vn)                              | Không có API công khai. Nội dung trả phí và có bản quyền.                                           | Thấp                                | Thu thập nội dung từ web có rủi ro pháp lý. Thay thế: CSDL văn bản chính thức hoặc nguồn có giấy phép.                            |
| 14 | [VietQR](https://vietqr.io)                                                       | API tạo mã QR (không cần tài khoản người dùng cho tạo ảnh QR cơ bản)                             | **Cao**                        | Thực chất là một công cụ (tool), không phải connected app. Nên làm dưới dạng tool hoặc skill.                                        |
| 15 | [SePay](https://sepay.vn)                                                         | API lịch sử giao dịch ngân hàng và webhook biến động số dư (API token)                             | **Cao**                        | Dữ liệu ngân hàng nhạy cảm. Cần mã hóa token và giới hạn quyền đọc.                                                                 |
| 16 | [Hóa đơn Điện tử Thuế (Tổng cục Thuế)](https://hoadondientu.gdt.gov.vn) | Cổng thuế không có OAuth cho bên thứ ba. Đăng nhập bằng MST và mật khẩu.                         | Thấp                                | Rủi ro bảo mật cao vì là thông tin thuế. Thay thế: API của nhà cung cấp hóa đơn điện tử mà người dùng đang dùng.            |

## 4. Ba đường tích hợp

- **A. API chính thức qua Composio hoặc connector riêng.** Dùng cho Telegram, Lark, SePay, Pancake, KiotViet, Shopee, Lazada, TikTok Shop, Meta, TikTok.
- **B. Trình duyệt bot (Chrome/CDP).** Chỉ dùng khi không có API: Kalodata, TikTok Affiliate, và Zalo Web nếu được chấp nhận rủi ro.
- **C. Không làm connected app.** VietQR nên là tool. Thư viện Pháp luật nên là nguồn tra cứu chính thức. Hóa đơn điện tử nên đi qua nhà cung cấp đang dùng.

## 5. Đề xuất thứ tự triển khai

1. **Giai đoạn 1 (API rõ, ít rủi ro):** SePay, Lark Suite & Lark Base, Telegram, Pancake. VietQR làm tool.
2. **Giai đoạn 2 (cần đăng ký đối tác hoặc duyệt app):** Shopee, Lazada, TikTok Shop, KiotViet, Meta, TikTok.
3. **Giai đoạn 3 (hoãn hoặc chỉ khi có nhu cầu rõ):** Zalo OA, Kalodata, TikTok Affiliate, Hóa đơn điện tử, Thư viện Pháp luật.

## 6. Rủi ro chung

- **Đăng ký và duyệt:** Shopee, Lazada, TikTok, Meta cần thời gian duyệt, có thể lâu và có thể bị từ chối. Cần tính vào lịch trình.
- **Lưu trữ thông tin xác thực:** API key, token và OAuth cần mã hóa, không ghi vào log, và có cơ chế thu hồi.
- **Điều khoản dịch vụ:** Mọi cách tự động hóa giao diện web (đặc biệt Zalo, Kalodata, TikTok Affiliate) có thể vi phạm điều khoản. Cần rà soát pháp lý trước khi làm.
- **Dữ liệu cá nhân và tài chính:** Giao dịch ngân hàng (SePay) và thông tin thuế là dữ liệu nhạy cảm, cần cân nhắc lưu trữ và quyền truy cập.
- **Giới hạn tốc độ và thay đổi API:** Các nền tảng thương mại điện tử thay đổi API thường xuyên. Cần theo dõi phiên bản.
- **Trình duyệt dễ vỡ:** Đường B phụ thuộc giao diện trang và yêu cầu người dùng đăng nhập, nên cần chấp nhận bảo trì liên tục.

## 7. Cần xác minh trước khi làm

Phân tích này dựa trên kiến thức chung và cấu trúc repo, **chưa kiểm tra tài liệu API hiện hành**. Trước khi chốt, cần:

- [ ] Kiểm tra danh mục toolkit của Composio xem có sẵn cho từng app trong danh sách không.
- [ ] Đọc tài liệu API hiện hành của từng nền tảng: Shopee, Lazada, TikTok, Meta, Lark, Pancake, KiotViet, SePay, VietQR.
- [ ] Xác nhận điều kiện đăng ký đối tác cho Việt Nam (Shopee, Lazada, TikTok Shop).
- [ ] Xác nhận với nhà cung cấp hóa đơn điện tử đang dùng có API cho bên thứ ba không.
- [ ] Rà soát điều khoản dịch vụ của Zalo, Kalodata, TikTok Affiliate, Thư viện Pháp luật.

## 8. Câu hỏi mở cho người phụ trách

1. Ưu tiên nhóm nào trước: tài chính/thanh toán (SePay, VietQR), bán hàng (Shopee, Lazada, TikTok Shop), hay CRM/tin nhắn (Telegram, Pancake, Zalo OA)?
2. Có chấp nhận đường trình duyệt (B) cho Kalodata và TikTok Affiliate, với rủi ro điều khoản và bảo trì không?
3. Hóa đơn điện tử: người dùng đang dùng nhà cung cấp nào?
