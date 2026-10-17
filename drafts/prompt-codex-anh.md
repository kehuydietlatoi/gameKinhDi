# Prompt gửi Codex: vẽ ảnh nền màn 4–9

Chép nguyên khối dưới đây gửi Codex. Nếu chưa duyệt nhóm B trong `drafts/briefs-anh-bo-sung.md`, xoá các dòng B1–B3 ở mục "Phạm vi" trước khi gửi.

---

Đọc `AGENTS.md` (nhất là mục 8 "Hình ảnh") và mục 5 "Lớp hình ảnh" của `docs/dac-ta-kich-ban.md`, rồi vẽ ảnh nền pixel cho màn 4–9 bằng đúng pipeline `art/` bạn đã làm cho màn 1–3.

## Nhánh

- Tạo nhánh `codex/m4-m9-pixel-backgrounds` từ `codex/m2-m3-pixel-backgrounds`, để giữ pipeline `art/` (`lib.py`, `palette.py`, `build.py`, `check.py`, `preview.py`).
- Brief nằm trên nhánh `feat/m4-m9` (nhánh art chưa có). Đọc bằng `git show feat/m4-m9:<đường dẫn>`, không cần merge:
  - `docs/man-4-tram-y-te.md`, `docs/man-6-cau-noi.md`, `docs/man-7-giu-lua.md`, `docs/man-8-binh-minh-khong-den.md`, `docs/man-9-nguoi-dan-ba-khong-mat.md`: phần "Cảnh và ảnh nền";
  - `docs/tong-quan-cot-truyen.md`: danh sách ảnh toàn game;
  - `drafts/briefs-anh-bo-sung.md`: brief các ảnh bổ sung. Người dùng đã duyệt; coi như brief trong docs.
- Chỉ thay đổi `art/` và `public/bg/`. Không sửa `content/`, `src/`, `docs/`, `drafts/`, `tests/`.

## Phạm vi

Ảnh đã có brief trong docs:

1. `phong_luu_benh` (màn 4)
2. `cau_noi_c4_c5` (màn 6)
3. `bep_tap_the` (màn 7)
4. `phong_404_1986` (màn 8)
5. `bang_tin_cao_pho_7_day` (màn 9): dựng từ code của `bang_tin_cao_pho_7`, cùng góc nhìn và ánh sáng; chỉ thêm ảnh vào khung thứ bảy.

Ảnh bổ sung, brief ở `drafts/briefs-anh-bo-sung.md`:

6. A1 `phong_404_1986_mat_troi` (màn 8): dựng từ code của `phong_404_1986`; chỉ khác tường cửa sổ bếp.
7. A2 `cau_noi_nhin_ve_c4` (màn 6): cùng vật liệu với `cau_noi_c4_c5`, góc nhìn ngược lại về phía C4.
8. B1 `tiem_vang_ma_ngoai` (màn 9)
9. B2 `cau_thang_chieu_nghi` (màn 2, dùng lại ở màn 3)
10. B3 `hanh_lang_lo_khoa` (màn 5): dựng từ code của `hanh_lang_tang_2`.

## Quy cách bắt buộc

- PNG 320×180, mode P, không khử răng cưa, chỉ dùng 16 màu trong `art/palette.py`, giữ đúng thứ tự màu.
- `#8a0b0b` (đỏ máu) chỉ cho máu và Huyết tự. Trong 10 ảnh này, chỉ B3 được dùng (chữ đỏ trên cửa); các ảnh còn lại không có đỏ máu.
- Không vẽ người, kể cả bóng người. Chỗ NPC đứng nằm ngoài khung hoặc chìm trong vùng tối.
- Không vẽ chữ đọc được. Riêng số phòng là ngoại lệ, chỉ khi brief yêu cầu, như "404" ở `hanh_lang_tang_4`.
- Không vẽ biến thể ánh sáng: engine phủ `flicker`, `dark`, `dawn`, `candle` bằng CSS. Vẽ mỗi ảnh ở một trạng thái sáng gốc.
- Ảnh không chứa thông tin mà brief và chữ của kịch bản không có. Mỗi ảnh phải đủ mục "Bắt buộc có" và không có gì trong mục "Cấm vẽ". Lệch brief thì sửa ảnh, không sửa brief.
- Bảng màu không có vàng tươi: sáp vàng ở A1 dùng `#d9cfa8` và `#b8a77a`.
- Giữ phong cách màn 1–3: tái dùng helper trong `lib.py` (vôi bong tróc, gạch hoa, cửa gỗ xanh, khung gỗ). Helper mới thêm vào `lib.py`, không đổi thuật toán helper cũ, để 13 ảnh hiện có giữ nguyên từng byte.

## Kiểm tra trước khi báo xong

1. `python art/build.py` chạy hai lần, hash SHA-256 của cả 23 PNG giống nhau giữa hai lần; cập nhật `art/preview/sha256.txt`.
2. 13 PNG cũ giống nguyên byte với nhánh `codex/m2-m3-pixel-backgrounds`.
3. `python art/check.py` pass cho cả 23 PNG. Nếu `check.py` đang chặn mọi pixel đỏ máu, thêm ngoại lệ có tên riêng cho `hanh_lang_lo_khoa` (chữ Huyết tự trên cửa); các ảnh khác vẫn không được có đỏ máu.
4. `python art/preview.py`: sheet thường và sheet tối (phủ đen 60%) cho các ảnh mới; tự mở xem cả hai.
5. Viết `art/QA-m4-m9.md` theo đúng mẫu `art/QA-m2-m3.md`: bảng tự duyệt từng mục "Bắt buộc có" và "Cấm vẽ" của từng ảnh (kèm dấu hiệu trong hình, kiểm tra pixel nếu có), bảng kết quả lệnh, và mục "Điểm còn yếu".
6. Commit theo Conventional Commits: `feat(art): …`.

Không khai báo asset trong `content/assets.yaml` và không gán cảnh; phần đó Claude làm khi tích hợp.
