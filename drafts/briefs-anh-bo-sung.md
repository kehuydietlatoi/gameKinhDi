# Brief ảnh bổ sung (bản nháp)

Bản nháp do Claude viết ngày 2026-10-17, sau khi rà ảnh nền thực tế ở từng node của 9 màn. **Chưa phải nguồn sự thật**: theo AGENTS.md mục 2, brief nằm trong `docs/man-*.md`. Khi duyệt, chép hàng "Brief vẽ" vào bảng "Brief vẽ" của file màn tương ứng, và hàng "Gán cảnh" vào bảng "Gán cảnh cho node".

Mọi brief dưới đây theo quy cách chung (đặc tả mục 5, AGENTS.md mục 8):
- PNG 320×180, không khử răng cưa, chỉ dùng 16 màu của bảng màu;
- `#8a0b0b` chỉ cho máu và Huyết tự;
- không vẽ người;
- không vẽ biến thể ánh sáng (engine phủ `flicker`, `dark`, `dawn`, `candle`);
- không chứa thông tin mà chữ của node chưa nói.

## Tóm tắt

| Ưu tiên | id | Màn | Node | Lý do |
| --- | --- | --- | --- | --- |
| A | `phong_404_1986_mat_troi` | 8 | M8-31 | Ảnh hiện tại phải để trống tường cửa sổ bếp và cấm vẽ mặt trời, trong khi chữ ở M8-31 nói mặt trời sáp vàng đang toả sáng ở đó |
| A | `cau_noi_nhin_ve_c4` | 6 | M6-30 → M6-33 | Người chơi quay mặt về C4 và đi lùi, nhưng `cau_noi_c4_c5` là góc nhìn sang C5 |
| B | `tiem_vang_ma_ngoai` | 9 | M9-06 | Bà Hoa đứng ở bậc thềm tiệm vàng mã đã đóng cửa; nền hiện là căn hộ 304 |
| B | `cau_thang_chieu_nghi` | 2, 3 | M2-09 (nhánh `di_xuong`), M3-15 | Chữ tả cầu thang và chiếu nghỉ; nền hiện là căn hộ 304 hoặc hành lang tầng 4 |
| B | `hanh_lang_lo_khoa` | 5 | M5-06 | Người chơi nhìn qua lỗ khoá ra hành lang; nền hiện là căn hộ 304 |

A: ảnh hiện tại mâu thuẫn với chữ, nên làm. B: lệch địa điểm, có thì tốt hơn, không có cũng chơi được.

---

## A1 · `phong_404_1986_mat_troi` (màn 8)

**Vì sao:** M8-31 là phần thưởng của cả màn. Chữ: "Ông mặt trời sáp vàng trên tường cửa sổ bếp bắt đầu toả sáng." / "Ánh nắng thật tràn qua cửa sổ." / "Con ma đen đứng yên trong tranh, chỉ còn là những nét sáp." Brief của `phong_404_1986` bắt buộc có khoảng trống lớn chưa vẽ trên tường cửa sổ bếp và cấm vẽ mặt trời, nên ở M8-31 người chơi đang thấy một bức tường trống.

**Hàng cho bảng "Brief vẽ" của `docs/man-8-binh-minh-khong-den.md`:**

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `phong_404_1986_mat_troi` | Dựng từ code của `phong_404_1986`, cùng góc nhìn; chỉ khác ở tường cửa sổ bếp. Dùng cho M8-31. | Trong khoảng trống trên tường cửa sổ bếp, một ông mặt trời vẽ bằng sáp vàng, nét trẻ con, tia nắng là những nét sáp ngắn; ô cửa sổ bếp không còn tối om mà sáng lên; con ma đen trên tường đầu giường giữ nguyên như bản gốc | Người thật, chữ đọc được, màu đỏ máu, mặt trời đỏ đang lặn, song sắt quanh con ma | không |

Ghi chú cho người vẽ: bảng màu không có vàng tươi; dùng `#d9cfa8` (vôi sáng) và `#b8a77a` (vôi vàng) cho sáp vàng, `#e8e6dc` (trắng đèn) cho ô cửa sổ sáng. Ô cửa sổ sáng là nội dung (mặt trời đã mọc), không phải biến thể ánh sáng; phần ánh bình minh vẫn do lớp `dawn` lo. Không vẽ song sắt vì chỉ một nhánh có (cờ `long_sat`).

**Hàng cho bảng "Gán cảnh cho node"** (thay hàng M8-31 hiện có):

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M8-31 | `phong_404_1986_mat_troi` | `dawn` | |

**`alt` đề xuất:** "Góc phòng năm 1986, trên tường cửa sổ bếp có một ông mặt trời bút sáp vàng mới vẽ."

---

## A2 · `cau_noi_nhin_ve_c4` (màn 6)

**Vì sao:** sinh lộ của màn là quay mặt về phía C4 rồi đi lùi. Từ M6-30 trở đi, chữ chỉ tả phía C4: "Ở cuối hành lang C4, một bóng người ướt sũng bước ra khỏi bóng tối." (M6-30), "Nó đã gần hơn…" (M6-31), "Nó đứng ở mép cầu, không bước qua được." (M6-33). Ảnh `cau_noi_c4_c5` là góc đứng ở C4 nhìn sang C5, tức ngược với hướng người chơi đang nhìn. Đường đi tiến (M6-20, M6-21) vẫn dùng `cau_noi_c4_c5`.

**Hàng cho bảng "Brief vẽ" của `docs/man-6-cau-noi.md`:**

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `cau_noi_nhin_ve_c4` | Đứng trên cầu nối, quay mặt về phía nhà C4, ban đêm. Cùng vật liệu với `cau_noi_c4_c5`. Dùng cho M6-30 đến M6-33. | Mặt cầu bê tông hẹp, ướt loang loáng, chạy về phía C4; lan can sắt hai bên, nguyên vẹn; cửa sắt đầu cầu C4 mở; sau cửa là hành lang C4, nửa sau chìm hẳn vào bóng tối (chỗ "nó" đứng); mảng trời xanh đêm phía trên | Người, bóng người kể cả trong vùng tối, dấu chân, lan can gãy, vệt sáng vàng của cửa C5 | không |

**Hàng cho bảng "Gán cảnh cho node":**

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M6-30 | `cau_noi_nhin_ve_c4` | `flicker` | Đi lùi, mặt hướng về C4; giữ đến M6-33 |

**`alt` đề xuất:** "Cầu nối bê tông ướt nhìn từ trên cầu về phía nhà C4, cửa sắt đầu cầu mở vào một hành lang tối om."

---

## B1 · `tiem_vang_ma_ngoai` (màn 9)

**Vì sao:** M9-06: "Tiệm vàng mã đóng cửa, nhưng bà Hoa đứng chờ sẵn ở bậc thềm." Hub M9-03 khai báo `can_ho_304`, nên node này đang hiện căn hộ của người chơi. `tiem_vang_ma` không hợp vì đó là cảnh bên trong tiệm, lúc tiệm mở.

**Hàng cho bảng "Brief vẽ" của `docs/man-9-nguoi-dan-ba-khong-mat.md`:**

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `tiem_vang_ma_ngoai` | Mặt tiền tiệm vàng mã ở tầng trệt nhà C4, ban đêm, nhìn từ ngoài vào. | Cửa xếp sắt kéo kín; bậc thềm xi măng trước cửa; tấm biển hiệu gỗ phía trên cửa | Người (chỗ bà Hoa đứng nằm ngoài khung hoặc trong vùng tối), chữ đọc được trên biển, đồ mã bày ra ngoài, hình nhân | không |

**Hàng cho bảng "Gán cảnh cho node":**

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M9-06 | `tiem_vang_ma_ngoai` | `normal` | Về hub M9-03 thì trở lại `can_ho_304` |

**`alt` đề xuất:** "Mặt tiền tiệm vàng mã ở tầng trệt ban đêm, cửa xếp sắt kéo kín và bậc thềm xi măng trước cửa."

---

## B2 · `cau_thang_chieu_nghi` (màn 2, dùng lại ở màn 3)

**Vì sao:**
- M2-09, nhánh có cờ `di_xuong`: "Bạn bước xuống cầu thang. Đến chiếu nghỉ tầng 2 thì hai chân khuỵu xuống." Nền hiện vẫn là căn hộ 304.
- M3-15: "Thằng Bin ngồi bó gối trên bậc cầu thang, tay mân mê một chiếc khăn tang." Nền hiện là hành lang tầng 4.
- Không dùng lại `ban_tho_chieu_nghi` được, vì ảnh đó có bàn thờ của chiếu nghỉ tầng 3–4, mà M2-09 và M3-15 không nhắc tới.

**Hàng cho bảng "Brief vẽ" của `docs/man-2-canh-linh-cuu.md`** (và nhắc tên ở mục ảnh dùng lại của màn 3):

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `cau_thang_chieu_nghi` | Cầu thang bê tông chung của nhà C4, đứng ở chiếu nghỉ nhìn xuống các bậc, ban đêm. Ảnh dùng lại được ở nhiều màn. | Bậc thang bê tông mòn; tay vịn sắt; mảng tường vôi bong tróc; chân cầu thang chìm vào bóng tối | Người, bàn thờ, bát hương, bài vị, chữ đọc được | không |

**Hàng cho bảng "Gán cảnh cho node":**

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M2-09 | `cau_thang_chieu_nghi` | `flicker` | Chỉ khi có cờ `di_xuong`; nếu nằm xuống giường thì giữ `can_ho_304` |
| M3-15 | `cau_thang_chieu_nghi` | `flicker` | Về hub M3-10 thì trở lại `hanh_lang_tang_4` |

Ví dụ YAML cho M2-09 (cảnh dạng danh sách, đặc tả mục 5):

```yaml
- id: m2_n09
  scene:
    - {if: {flag: di_xuong}, bg: cau_thang_chieu_nghi, light: flicker}
```

**`alt` đề xuất:** "Cầu thang bê tông chung nhìn xuống từ chiếu nghỉ ban đêm, tay vịn sắt và chân cầu thang chìm trong bóng tối."

---

## B3 · `hanh_lang_lo_khoa` (màn 5)

**Vì sao:** M5-06: "Hành lang tối. Trên cửa nhà nào cũng có chữ đỏ." / "Trước cửa 306, một bàn tay gầy cầm bút lông, chấm vào lọ mực nâu, viết thêm một dòng." Nền hiện vẫn là căn hộ 304. Ảnh mới chỉ cần hành lang và chữ đỏ trên các cửa. Bàn tay, bút lông và lọ mực là manh mối c3, nên để chữ kể (và không được vẽ tay người); nhờ vậy ảnh không mang `clue`.

**Hàng cho bảng "Brief vẽ" của `docs/man-5-noi-quy.md`:**

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `hanh_lang_lo_khoa` | Nhìn qua lỗ khoá cửa căn hộ 304 ra hành lang tầng 3. Dựng từ code của `hanh_lang_tang_2`. Khung hình là mảng đen, ô nhìn hình lỗ khoá ở giữa. | Hành lang tối với các cửa gỗ sơn xanh; trên mỗi cánh cửa nhìn thấy được có một mảng chữ đỏ máu không đọc được | Người, bàn tay, bút lông, lọ mực, chữ đọc được, mảng chữ màu nâu | không |

**Hàng cho bảng "Gán cảnh cho node"** (màn 5 hiện ghi "không cần ảnh mới"; nếu duyệt thì sửa câu đó):

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M5-06 | `hanh_lang_lo_khoa` | `normal` | Về hub M5-03 thì cần đặt lại `can_ho_304`: hub M5-03 hiện chưa khai báo `scene`, nên nên thêm `scene: {bg: can_ho_304, light: normal}` như hub M6-03 |

**`alt` đề xuất:** "Hành lang tối nhìn qua lỗ khoá, trên các cánh cửa có những mảng chữ đỏ."

---

## Ảnh đã có brief trong docs nhưng chưa vẽ

Năm ảnh này đang là placeholder; brief nằm sẵn trong file màn, không cần viết thêm.

| id | Brief ở | Ghi chú |
| --- | --- | --- |
| `phong_luu_benh` | `docs/man-4-tram-y-te.md` | Cả màn 4 dùng ảnh này |
| `cau_noi_c4_c5` | `docs/man-6-cau-noi.md` | |
| `bep_tap_the` | `docs/man-7-giu-lua.md` | Cả màn 7 dùng ảnh này |
| `phong_404_1986` | `docs/man-8-binh-minh-khong-den.md` | Cả màn 8 dùng ảnh này; A1 dựng từ code của nó |
| `bang_tin_cao_pho_7_day` | `docs/man-9-nguoi-dan-ba-khong-mat.md` | Dựng từ code của `bang_tin_cao_pho_7`; cảnh kết của cả game |
