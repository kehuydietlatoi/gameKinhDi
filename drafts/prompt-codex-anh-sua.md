# Prompt gửi Codex: sửa 4 ảnh nền (màn 2, 7, 8)

Chép nguyên khối dưới đây gửi Codex. 6 ảnh khác của commit `d987493` đã được tích hợp vào `feat/m4-m9` (commit `3d69652`).

---

Sửa 4 ảnh trên nhánh `codex/m4-m9-pixel-backgrounds` (commit `d987493`, worktree hiện có). Giữ nguyên pipeline `art/` và mọi quy cách trong `AGENTS.md` mục 8, `docs/dac-ta-kich-ban.md` mục 5. Đọc brief mới nhất bằng `git show feat/m4-m9:<đường dẫn>` (brief phòng 404 vừa sửa ở commit `4f71d25`), không merge. Chỉ thay đổi `art/` và `public/bg/`.

## 1. `phong_404_1986` và `phong_404_1986_mat_troi`: bỏ đồng hồ

Brief trong `docs/man-8-binh-minh-khong-den.md` giờ ghi: cửa ra vào ở tường đối diện cửa sổ bếp, ngoài khung hình; đồng hồ treo trên tranh mặt trời lặn ở tường cửa ra vào, nên **cấm vẽ đồng hồ**. Bản hiện tại có đồng hồ trên tường cửa sổ bếp.

- Xoá đồng hồ ở cả hai ảnh. Lấp chỗ trống bằng tranh sáp cùng loại đang có (sông, thuyền giấy, nhà, cây). Không thêm mặt trời, không thêm chữ.
- Giữ nguyên khoảng trống lớn chưa vẽ trên tường cửa sổ bếp, vì `_mat_troi` vẽ mặt trời vào đó.
- `phong_404_1986_mat_troi` vẫn dựng từ code của `phong_404_1986`; hai ảnh chỉ khác nhau ở tường cửa sổ bếp.

## 2. `cau_thang_chieu_nghi`: phải đọc ra là đang nhìn xuống cầu thang

Brief trong `docs/man-2-canh-linh-cuu.md`: đứng ở chiếu nghỉ nhìn xuống các bậc, ban đêm. Bản hiện tại để trần chiếm phần trên và các bậc chỉ là vạch ngang, nên trông như một hành lang phẳng.

- Góc nhìn chúc xuống: không thấy trần, hoặc chỉ một dải rất mỏng.
- Bậc thang bê tông mòn thấy rõ cả mặt bậc lẫn cổ bậc, nhỏ dần và tối dần về phía dưới.
- Tay vịn sắt dốc xuống theo các bậc. Tường vôi bong tróc. Chân cầu thang chìm vào bóng tối.
- Cấm vẽ: người, bàn thờ, bát hương, bài vị, chữ đọc được (như brief).
- Ảnh này dùng ở M2-09 và M3-15 với lớp `flicker`, nên kiểm cả sheet tối.

## 3. `bep_tap_the`: đặt cửa ra ngõ ở cuối gian

Brief trong `docs/man-7-giu-lua.md`: "cửa gỗ ra ngõ ở cuối gian, có khe hở".

- Chuyển cửa từ tường bên phải sang bức tường cuối gian.
- Mảng tường vôi trống phía trên lò (chỗ Huyết tự hiện) vẫn phải còn nguyên và đủ rộng.
- Giữ mọi mục khác của brief.

## Không đổi

6 ảnh còn lại của commit `d987493` (`phong_luu_benh`, `cau_noi_c4_c5`, `cau_noi_nhin_ve_c4`, `bang_tin_cao_pho_7_day`, `tiem_vang_ma_ngoai`, `hanh_lang_lo_khoa`) và 13 ảnh của màn 1–3 phải giữ nguyên từng byte.

## Kiểm tra trước khi báo xong

1. `python art/build.py` chạy hai lần, SHA-256 của cả 23 PNG giống nhau giữa hai lần. Cập nhật `art/preview/sha256.txt`; chỉ 4 dòng của 4 ảnh vừa sửa được đổi.
2. `python art/check.py` và `python art/verify.py` pass. Cập nhật `verify.py` cho các ảnh đã sửa:
   - `phong_404_1986` và bản `_mat_troi`: không còn đồng hồ;
   - `cau_thang_chieu_nghi`: không còn mảng trần lớn;
   - `bep_tap_the`: vùng tường trống trên lò vẫn trống.
3. `python art/preview.py`, tự mở xem cả sheet thường lẫn sheet tối.
4. Cập nhật các mục của 4 ảnh này trong `art/QA-m4-m9.md`: bảng "Bắt buộc có" và "Cấm vẽ", kèm một dòng ghi rõ đã bỏ đồng hồ và lý do.
5. Commit `fix(art): …`. Không sửa `content/`, `src/`, `docs/`, `tests/`.
