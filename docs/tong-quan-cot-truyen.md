# Tổng quan cốt truyện

Tài liệu tra cứu chung cho cả chín màn. Khi tài liệu này khác file của một màn, file của màn là đúng.

## Cốt truyện xuyên suốt (có tiết lộ)

Đêm rằm tháng Bảy năm 1986, tầng 4 nhà C4 bốc cháy. Sáu người chết: Tâm, Hằng, Khải, Na, Dung, Lâm. Họ được lập bài vị trên bàn thờ chung ở chiếu nghỉ.

Người thứ bảy là bà Đỗ Thị Hai, tổ trưởng. Đêm ấy bà nấu cỗ rằm trên tầng 4, bị đổ lỗi gây cháy, rồi chạy lên cứu người và không trở lại. Không tìm thấy xác, người ta gạch tên bà khỏi sổ, không ai lập bài vị. Từ đó, cứ đến tháng cô hồn, toà nhà lại đòi đủ bảy.

Người chơi sống ở căn hộ 304. Từ màn 1, tờ cáo phó đã có thêm một khung ảnh thứ bảy còn trống; ở màn 2, di ảnh trên bàn thờ là mặt người chơi. Khung ảnh ấy đang chờ người chơi. Ở kết cục tốt của màn 9, người chơi khấn tên bà Hai, và khung thứ bảy có chủ.

## Lịch các đêm

| Màn | Đêm (âm lịch) | Địa điểm | Loại sinh lộ | Tier | Kết cục (sống / chết) | File |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 15/7 | Phòng sinh hoạt chung, cả toà C4 | A. Đảo vai | 1 | 1 / 5 | `man-1-tron-tim.md` |
| 2 | 16/7 | Căn hộ 304, phòng sinh hoạt chung (linh cữu) | B. Nhận diện bản thân + D. Phép đếm | 2 | 1 / 4 | `man-2-canh-linh-cuu.md` |
| 3 | 17/7 | Tầng 4, phòng 404, tiệm vàng mã | C. Định nghĩa "người" | 2 | 2 / 4 | `man-3-hinh-nhan-the-mang.md` |
| 4 | 20/7 | Trạm y tế phường (tầng 1 nhà C5) | F. Phạm vi tin cậy | 2 | 1 / 3 | `man-4-tram-y-te.md` |
| 5 | 22/7 | Căn hộ 304 | I. Dấu hiệu trình bày | 3 | 1 / 4 | `man-5-noi-quy.md` |
| 6 | 24/7 | Cầu nối tầng 3 giữa C4 và C5 | E. Nghĩa đen | 2 | 1 / 4 | `man-6-cau-noi.md` |
| 7 | 26/7 | Bếp tập thể tầng 1 | D. Phép đếm + C. Định nghĩa "người" | 3 | 1 / 4 | `man-7-giu-lua.md` |
| 8 | 28/7 | Phòng 404 năm 1986 (giấc mơ của bé Na) | H. Logic thế giới | 2 | 1 / 2 | `man-8-binh-minh-khong-den.md` |
| 9 | 30/7 | Hành lang tầng 3, bàn thờ chung | G. Sai đối tượng + I + D | 4 | 2 / 4 | `man-9-nguoi-dan-ba-khong-mat.md` |

## Nhân vật xuyên màn

| id | Tên | Xuất hiện ở màn | Ghi chú |
| --- | --- | --- | --- |
| `ba_sau` | Bà Sáu, phòng 305 | 2, 3, 5, 6, 7, 9 | Luôn là người thật. Sống qua mọi kết cục |
| `ba_hoa` | Bà Hoa, tiệm vàng mã | 3, 7, 9 | Người thật |
| `bac_si_thanh` | Bác sĩ Thanh, phòng 312 nhà C5 | 4, 6, 7, 9 | Người thật. Ở màn 4, Huyết tự bảo đảm bà luôn nói thật; các màn sau giữ đúng tính cách đó |
| `be_na` | Bé Na | 1 (quỷ), 3 (vong), 8 (trong mơ) | |
| `bac_tam` | Bác Tâm | 1 (quỷ), 3 (vong) | |
| `ba_hai` | Bà Đỗ Thị Hai | 2 (là "Một giọng lạ"), 9 | Người đàn bà áo trắng |
| `ong_quy`, `co_lien`, `thang_bin` | | 2, 3 | **Không xuất hiện sau màn 3**, vì kết cục E2 của màn 3 có thể đã làm một trong ba người chết |

## Trạng thái mang qua màn

- `sanity` hồi về 5 khi bắt đầu mỗi màn (yêu cầu ở màn 2).
- Hồ sơ đã mở khoá được giữ lại. Hiện chỉ có một hồ sơ, `hs_chay_c4_1986`, mở ở màn 1 và dùng ở màn 3 và màn 9.
- Kết cục của các màn không ảnh hưởng nội dung màn sau, ngoài hồ sơ.

## Danh sách ảnh toàn game

Tổng cộng 18 ảnh.

| id | Màn đầu tiên | Dùng lại ở màn | `clue` |
| --- | --- | --- | --- |
| `phong_sinh_hoat` | 1 | | |
| `bang_tin_cao_pho` | 1 | | `m1:c1` |
| `bang_tin_cao_pho_7` | 1 | | `m1:c1` |
| `cua_so_kinh` | 1 | | `m1:c2` |
| `hanh_lang_tang_2` | 1 | 9 (làm hành lang tầng 3) | |
| `nha_ve_sinh_chung` | 1 | | |
| `gam_cau_thang` | 1 | | |
| `san_phoi` | 1 | | |
| `can_ho_304` | 2 | 3, 5, 6 (cả phòng 305), 8, 9 | |
| `phong_sinh_hoat_tang` | 2 | | |
| `hanh_lang_tang_4` | 3 | | |
| `tiem_vang_ma` | 3 | | |
| `ban_tho_chieu_nghi` | 3 | 9 | `m3:c1` |
| `phong_luu_benh` | 4 | | |
| `cau_noi_c4_c5` | 6 | | |
| `bep_tap_the` | 7 | | |
| `phong_404_1986` | 8 | | |
| `bang_tin_cao_pho_7_day` | 9 | | |

Màn 5 không có ảnh mới.

## Yêu cầu engine theo màn

Chi tiết nằm trong mục "Yêu cầu với engine" của từng file.

| Màn | Yêu cầu |
| --- | --- |
| 2 | `sanity` hồi về 5 mỗi màn; ẩn giờ khi `eyes_closed`; hai NPC cùng tên hiển thị; `on_sanity_zero` trỏ tới node thường |
| 3 | Điều kiện `has_dossier`; nhiều kết cục sống; kết cục sống có `consequence_of`; NPC chỉ được nhắc tên; lựa chọn cùng chữ với điều kiện loại trừ nhau |
| 4 | Không có |
| 5 | Dòng giả (`fake: true`); thuộc tính `ink` (`do`, `nau`, `kho`), phân biệt được không chỉ bằng màu; bóp méo đổi mực; `solution` tham chiếu dòng giả; ánh sáng `candle` |
| 6 | Không có |
| 7 | Không có (dùng `candle`) |
| 8 | Hiệu ứng có điều kiện |
| 9 | `final: true`; mực `kho` là Huyết tự thật; `clue` của ảnh tính theo màn |

Thứ tự triển khai hợp lý: làm hết yêu cầu engine của màn 2–9 trong một đợt, rồi chuyển nội dung từng màn sang YAML.
