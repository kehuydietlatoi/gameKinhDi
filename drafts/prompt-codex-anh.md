# Prompt gửi Codex: vẽ ảnh nền còn thiếu (màn 2–9)

Chép nguyên khối dưới đây gửi Codex. Mọi brief đã nằm trong `docs/man-*.md` (bổ sung ngày 2026-10-17).

---

Đọc `AGENTS.md` (nhất là mục 8 "Hình ảnh") và mục 5 "Lớp hình ảnh" của `docs/dac-ta-kich-ban.md`, rồi vẽ 10 ảnh nền pixel còn thiếu bằng đúng pipeline `art/` bạn đã làm cho màn 1–3.

## Nhánh

- Tạo nhánh `codex/m4-m9-pixel-backgrounds` từ `codex/m2-m3-pixel-backgrounds`, để giữ pipeline `art/` (`lib.py`, `palette.py`, `build.py`, `check.py`, `preview.py`).
- Brief nằm trên nhánh `feat/m4-m9`; nhánh art chưa có các file này. Đọc bằng `git show feat/m4-m9:<đường dẫn>`, không cần merge. Mỗi file dưới đây có phần "Cảnh và ảnh nền", gồm bảng "Brief vẽ" và bảng "Gán cảnh cho node":
  - `docs/man-2-canh-linh-cuu.md`, `docs/man-3-hinh-nhan-the-mang.md`, `docs/man-4-tram-y-te.md`, `docs/man-5-noi-quy.md`, `docs/man-6-cau-noi.md`, `docs/man-7-giu-lua.md`, `docs/man-8-binh-minh-khong-den.md`, `docs/man-9-nguoi-dan-ba-khong-mat.md`;
  - `docs/tong-quan-cot-truyen.md`: danh sách 23 ảnh toàn game.
- Chỉ thay đổi `art/` và `public/bg/`. Không sửa `content/`, `src/`, `docs/`, `drafts/`, `tests/`.

## Phạm vi: 10 ảnh

| # | id | Brief ở | Ghi chú |
| --- | --- | --- | --- |
| 1 | `phong_luu_benh` | man-4 | Cả màn 4 dùng ảnh này |
| 2 | `cau_noi_c4_c5` | man-6 | Đứng ở C4 nhìn sang C5 |
| 3 | `cau_noi_nhin_ve_c4` | man-6 | Cùng vật liệu với #2, góc nhìn ngược về phía C4 |
| 4 | `bep_tap_the` | man-7 | Cả màn 7 dùng ảnh này |
| 5 | `phong_404_1986` | man-8 | Cả màn 8 dùng ảnh này |
| 6 | `phong_404_1986_mat_troi` | man-8 | Dựng từ code của #5; chỉ khác tường cửa sổ bếp. Đọc cả đoạn "Ghi chú" ngay dưới bảng brief |
| 7 | `bang_tin_cao_pho_7_day` | man-9 | Dựng từ code của `bang_tin_cao_pho_7`, cùng góc nhìn và ánh sáng |
| 8 | `tiem_vang_ma_ngoai` | man-9 | Mặt tiền tiệm, cửa xếp kéo kín |
| 9 | `cau_thang_chieu_nghi` | man-2 | Dùng ở màn 2 và màn 3; không có bàn thờ |
| 10 | `hanh_lang_lo_khoa` | man-5 | Dựng từ code của `hanh_lang_tang_2`; khung lỗ khoá |

## Quy cách bắt buộc

- PNG 320×180, mode P, không khử răng cưa, chỉ dùng 16 màu trong `art/palette.py`, giữ đúng thứ tự màu.
- `#8a0b0b` (đỏ máu) chỉ cho máu và Huyết tự. Trong 10 ảnh này, chỉ `hanh_lang_lo_khoa` được dùng (chữ đỏ trên cửa).
- Không vẽ người, kể cả bóng người. Chỗ NPC đứng nằm ngoài khung hoặc chìm trong vùng tối.
- Không vẽ chữ đọc được. Riêng số phòng là ngoại lệ, chỉ khi brief yêu cầu, như "404" ở `hanh_lang_tang_4`.
- Không vẽ biến thể ánh sáng: engine phủ `flicker`, `dark`, `dawn`, `candle` bằng CSS. Vẽ mỗi ảnh ở một trạng thái sáng gốc.
- Ảnh không chứa thông tin mà brief và chữ của kịch bản không có. Mỗi ảnh phải đủ mục "Bắt buộc có" và không có gì trong mục "Cấm vẽ". Lệch brief thì sửa ảnh, không sửa brief.
- Giữ phong cách màn 1–3: tái dùng helper trong `lib.py`. Helper mới thêm vào `lib.py`, không đổi thuật toán helper cũ, để 13 ảnh hiện có giữ nguyên từng byte.

## Kiểm tra trước khi báo xong

1. `python art/build.py` chạy hai lần, hash SHA-256 của cả 23 PNG giống nhau giữa hai lần; cập nhật `art/preview/sha256.txt`.
2. 13 PNG cũ giống nguyên byte với nhánh `codex/m2-m3-pixel-backgrounds`.
3. `python art/check.py` pass cho cả 23 PNG. Nếu `check.py` đang chặn mọi pixel đỏ máu, thêm ngoại lệ có tên riêng cho `hanh_lang_lo_khoa`; các ảnh khác vẫn không được có đỏ máu.
4. `python art/preview.py`: sheet thường và sheet tối (phủ đen 60%) cho 10 ảnh mới; tự mở xem cả hai.
5. Viết `art/QA-m4-m9.md` theo đúng mẫu `art/QA-m2-m3.md`: bảng tự duyệt từng mục "Bắt buộc có" và "Cấm vẽ" của từng ảnh (kèm dấu hiệu trong hình, kiểm tra pixel nếu có), bảng kết quả lệnh, và mục "Điểm còn yếu".
6. Commit theo Conventional Commits: `feat(art): …`.

Không sửa `content/assets.yaml` và không gán cảnh; phần đó Claude làm khi tích hợp (các ảnh đã được khai báo placeholder, chỉ cần bỏ `placeholder: true` khi có file).
