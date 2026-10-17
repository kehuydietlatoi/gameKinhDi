# Màn 9 – Người đàn bà không mắt (màn cuối)

Sinh lộ: đôi mắt không nằm trên mặt người đàn bà, mà nằm trong cái hũ bà ôm trước ngực. Được nhìn mặt bà, không được nhìn vào hũ. Dòng chữ máu khô từ năm 1986 cũng là Huyết tự: phải khấn đủ bảy cái tên, và vong thứ bảy chính là người đàn bà ấy, bà Hai.

## Tổng quan

- **Bối cảnh:** đêm 30 tháng Bảy âm lịch, đêm cuối tháng cô hồn. Cầu thang và bàn thờ chung ở chiếu nghỉ nhà C4.
- **Trạng thái đầu:** `sanity` 5, `actions_left` 3, `role` none, `time` "22:00".
- **Mục tiêu dạy:** gom lại mọi bài học trước:
  - đọc đúng đối tượng của luật (mắt chứ không phải mặt);
  - phân biệt mực, gồm cả Huyết tự cũ đã ngả nâu;
  - đếm cho đủ;
  - khấn tên người đã khuất, không khấn tên người sống.
- **`final: true`:** đây là màn cuối của game.
- **`on_sanity_zero`:** không cần; mức mất tối đa là 3.
- **`solution` cấp màn:** `[k1, k3, k4]`.

### Các dòng trên tường (theo thứ tự hiển thị)

| Thứ tự | id | Mực | Nội dung | `violable` |
| --- | --- | --- | --- | --- |
| 1 | L1 | đỏ | Đêm nay là đêm cuối tháng cô hồn. Người đàn bà áo trắng sẽ đi qua từng tầng. | false |
| 2 | L2 | đỏ | Đừng nhìn vào mắt người đàn bà áo trắng. | true |
| 3 | L3 | đỏ | Trước khi gà gáy, bàn thờ chung phải có đủ hương cho mọi vong. | true |
| 4 | L4 | khô | Khi đủ bảy cái tên được khấn, lửa sẽ tắt. | false |
| 5 | F1 | nâu | Hũ của bà ấy phải được mở ra. | (dòng giả) |

### Sinh lộ

**Người đàn bà và cái hũ.** L2 cấm nhìn vào *mắt*, không cấm nhìn mặt. Mặt người đàn bà không có mắt; đôi mắt nằm trong hũ sành bà ôm. Bịt mắt thì ngã cầu thang tối; mở hũ (theo F1, dòng giả) thì nhìn thẳng vào mắt bà.

**Dòng máu khô.** L4 là Huyết tự viết từ đêm cháy năm 1986, máu đã khô và ngả nâu. Nó khác dòng giả F1: máu khô nứt nẻ và có vệt chảy, còn mực nâu thì nét trơn, khô ráo. Đây là biến thể đã hứa ở màn 5: một dòng không đỏ nhưng vẫn là thật.

**Bàn thờ.** Có sáu bài vị, nhưng L4 nói bảy cái tên. L3 đòi đủ hương cho *mọi* vong, nên cần bảy nén. Vong thứ bảy là bà Đỗ Thị Hai, tổ trưởng năm 1986. Bà chạy lên tầng 4 cứu người rồi không trở lại, bị đổ lỗi gây cháy, và bị gạch tên suốt bốn mươi năm. Người chơi khấn đủ sáu tên cùng tên bà Hai thì vòng lặp chấm dứt. Khấn tên mình thì người chơi trở thành vong thứ bảy, giống bài học ở màn 3.

L3 chỉ đòi "đủ hương", không nói mỗi vong một nén nguyên. Không có bó bảy nén của bà Hoa thì bẻ đôi một nén cũng đủ.

### Từ khoá đánh dấu

| id | Dòng | Cụm từ | Đúng |
| --- | --- | --- | --- |
| k1 | L2 | vào mắt | có |
| k2 | L2 | người đàn bà áo trắng | không |
| k3 | L3 | đủ hương cho mọi vong | có |
| k4 | L4 | đủ bảy cái tên | có |
| k5 | L4 | lửa sẽ tắt | không |
| k6 | L1 | đêm cuối tháng cô hồn | không |

### Bóp méo (khi `sanity` ≤ 2)

| Dòng | Trừ khi đã đánh dấu | Bản méo hiển thị |
| --- | --- | --- |
| L2 | k1 | Đừng nhìn vào mặt người đàn bà áo trắng. |
| L4 | k4 | Khi đủ sáu cái tên được khấn, lửa sẽ tắt. |
| F1 | (không bảo vệ được) | Mực đổi sang `kho`, nội dung giữ nguyên |

## Yêu cầu với engine

Ghi vào `docs/spec-changes.md` theo AGENTS.md mục 12.

1. **Màn cuối.** Màn khai báo `final: true`. Khi đạt E1, engine hiện màn kết thúc game thay vì về hub. Khi đạt E2, engine hiện "kết thúc mở" và cho phép chơi lại màn 9 để tìm E1.
2. **Mực `kho`** (đã định nghĩa ở yêu cầu màn 5). Dòng `ink: kho` là Huyết tự thật, có `violable` và được chọn làm từ khoá như dòng đỏ.
3. **`clue` của ảnh tính theo màn.** Trong `content/assets.yaml`, ghi `clue: m3:c1` thay vì `clue: c1`. Quy tắc AGENTS.md mục 8.5 chỉ áp dụng trong màn sở hữu clue đó. Ở màn khác, ảnh được dùng tự do nếu chữ của node đã mô tả chi tiết trong ảnh. Màn 9 dùng lại `ban_tho_chieu_nghi` (clue `m3:c1`).

## Nhân vật

| id | Tên hiển thị | Mô tả | Ghi chú |
| --- | --- | --- | --- |
| `ba_sau` | Bà Sáu | Giữ sổ hộ khẩu cũ năm 1986 | Người thật |
| `ba_hoa` | Bà Hoa | Chủ tiệm vàng mã | Người thật |
| `bac_si_thanh` | Bác sĩ Thanh | | Người thật, luôn nói thật (như màn 4) |
| `ba_hai` | Người đàn bà áo trắng | Bà cụ áo trắng, mặt không có mắt, ôm một hũ sành trước ngực; đi dép lê | Vong bà Đỗ Thị Hai. Chính là "Một giọng lạ" vuốt mắt người chơi ở màn 2 |

## Manh mối

Ở hub M9-03, người chơi có 3 lượt. Lựa chọn thứ năm chỉ hiện khi đã mở hồ sơ ở màn 1.

| id | Hành động | Node | Phát hiện | Tỉnh táo |
| --- | --- | --- | --- | --- |
| c1 | Hỏi bà Sáu về đêm cháy năm 1986 | M9-04 | Tổ trưởng bà Hai chạy lên tầng 4 rồi không xuống; bị đổ lỗi gây cháy, không ai lập bài vị (bật cờ `biet_ten_hai`) | 0 |
| c2 | Xem sổ hộ khẩu năm 1986 của bà Sáu | M9-05 | Dòng "Đỗ Thị Hai – tổ trưởng" bị gạch đen, ghi "mất tích" (bật cờ `biet_ten_hai`) | −1 |
| c3 | Xuống tiệm bà Hoa mua hương | M9-06 | Bó hương bảy nén bà Hoa để sẵn (bật cờ `co_bay_nen`) | 0 |
| c4 | Nhìn kỹ dòng thứ tư và thứ năm | M9-07 | Dòng thứ tư là máu khô nứt nẻ; dòng thứ năm là mực trơn; bác sĩ Thanh xác nhận | 0 |
| c5 | (nếu has_dossier `hs_chay_c4_1986`) Đọc lại hồ sơ vụ cháy | M9-08 | Biên bản cứu hoả ghi tìm thấy bảy người trên tầng 4, nhưng danh sách nạn nhân chỉ có sáu | 0 |

## Cảnh và ảnh nền

Màn 9 cần 2 ảnh mới. Dùng lại `can_ho_304`, `hanh_lang_tang_2` (hành lang tầng 3 cùng kiểu với tầng 2) và `ban_tho_chieu_nghi`.

### Brief vẽ

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `bang_tin_cao_pho_7_day` | Dựng từ code của `bang_tin_cao_pho_7`, cùng góc nhìn và ánh sáng. | Khung ảnh thứ bảy có ảnh: một bà cụ tóc búi, đôi mắt là hai chấm nhỏ hiền | Chữ đọc được, màu đỏ máu | không |
| `tiem_vang_ma_ngoai` | Mặt tiền tiệm vàng mã ở tầng trệt nhà C4, ban đêm, nhìn từ ngoài vào. | Cửa xếp sắt kéo kín; bậc thềm xi măng trước cửa; tấm biển hiệu gỗ phía trên cửa | Người (chỗ bà Hoa đứng nằm ngoài khung hoặc trong vùng tối), chữ đọc được trên biển, đồ mã bày ra ngoài, hình nhân | không |

### Gán cảnh cho node

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M9-01 | `can_ho_304` | `normal` | |
| M9-03 | `can_ho_304` | `normal` | Khai báo ở hub |
| M9-06 | `tiem_vang_ma_ngoai` | `normal` | Về hub M9-03 thì trở lại `can_ho_304` |
| M9-10 | `hanh_lang_tang_2` | `flicker` | Hành lang tầng 3; giữ đến M9-14 |
| M9-20 | `ban_tho_chieu_nghi` | `candle` | Giữ đến M9-23 |
| M9-21, M9-22 | `ban_tho_chieu_nghi` | `dawn` | |
| E1 | `bang_tin_cao_pho_7_day` | `dawn` | Ending |
| E2 | `ban_tho_chieu_nghi` | `dawn` | |
| D1–D4 | | | Mặc định nền đen |

## Kịch bản theo node

### Pha 0 – Đêm cuối

#### M9-01 · Đêm cuối tháng cô hồn

- Hiệu ứng: time "22:00".
- `narration` Đêm cuối cùng của tháng cô hồn.
- `sound · khắp tòa nhà · 2` Cạch. Cạch. Cạch. — nhà nào cũng cài then cửa.
- `sound · bức tường cạnh cửa · 2` Sột… soạt…
- Tiếp: M9-02

#### M9-02 · Chữ cũ

- `env · nhìn` Chữ đỏ rỉ ra trên bức tường cạnh cửa. Rồi lớp vôi bong ra từng mảng, để lộ những dòng chữ cũ bên dưới.
- `bloodtext` L1, L2, L3, L4 (mực `kho`), F1 (mực `nau`).
- `env · nhìn` Ba dòng đầu đỏ tươi, còn ướt. Dòng thứ tư nâu sẫm, nứt nẻ, như đã khô từ rất lâu. Dòng thứ năm nâu đen, nét trơn.
- `highlight: true`: mở giao diện đánh dấu (k1–k6) sau khi các dòng hiện hết, cho phép bỏ qua.
- `system` Bạn có 3 lượt hành động.
- Tiếp: M9-03

#### M9-03 · Hub tầng 3

`hub: true`, `hub_done: {actions_left_lte: 0}`, `hub_exit: M9-10`, `scene: {bg: can_ho_304, light: normal}`. Mỗi lựa chọn dùng một lần, tốn 1 lượt (`actions_left −1`), xong quay về M9-03.

1. Hỏi bà Sáu về đêm cháy năm 1986 → M9-04
2. Xem sổ hộ khẩu năm 1986 của bà Sáu → M9-05
3. Xuống tiệm bà Hoa mua hương → M9-06
4. Nhìn kỹ dòng thứ tư và thứ năm → M9-07
5. (nếu has_dossier `hs_chay_c4_1986`) Đọc lại hồ sơ vụ cháy → M9-08

#### M9-04 · Bà Sáu kể

- `npc · ba_sau` Đêm ấy tổ trưởng là bà Hai. Bà ấy nấu cỗ rằm trên tầng bốn.
- `npc · ba_sau` Cháy xong, người ta bảo tại bếp nhà bà ấy.
- `npc · ba_sau` Bà Hai chạy lên tầng bốn lần cuối, rồi không thấy xuống. Tìm không ra xác. Người ta gạch tên bà khỏi sổ, chẳng ai lập bài vị.
- Hiệu ứng: clue c1, flag `biet_ten_hai`.
- Tiếp: M9-03

#### M9-05 · Sổ hộ khẩu cũ

- `env · nhìn` Cuốn sổ bìa nâu, giấy giòn như lá khô.
- `env · nhìn` Trang tầng 4 có sáu dòng gạch đỏ, cạnh mỗi dòng ghi "mất 15/7/1986".
- `env · nhìn` Dòng thứ bảy bị gạch bằng mực đen, đè nhiều lần: "Đỗ Thị Hai – tổ trưởng". Bên cạnh ghi: "mất tích".
- Hiệu ứng: clue c2, flag `biet_ten_hai`, sanity −1.
- Tiếp: M9-03

#### M9-06 · Bó hương

- `env · nhìn` Tiệm vàng mã đóng cửa, nhưng bà Hoa đứng chờ sẵn ở bậc thềm.
- `npc · ba_hoa` Bó này bảy nén. Bà để dành từ năm tám sáu.
- `npc · ba_hoa` Mỗi vong một nén. Đếm cho đủ, thiếu là có vong đói.
- Hiệu ứng: clue c3, flag `co_bay_nen`.
- Tiếp: M9-03

#### M9-07 · Hai loại nâu

- `env · nhìn` Dòng thứ tư nâu sẫm, mặt chữ nứt thành vảy, phía dưới có những vệt chảy dài đã khô cứng.
- `env · nhìn` Dòng thứ năm nâu đen, nét đều và trơn, không có một vệt chảy nào.
- `npc · bac_si_thanh` Máu khô lâu năm thì ngả nâu và nứt. Mực thì không chảy thành vệt như thế.
- Hiệu ứng: clue c4.
- Tiếp: M9-03

#### M9-08 · Hồ sơ

- `env · nhìn` Hồ sơ vụ cháy nhà C4 ghi sáu nạn nhân.
- `env · nhìn` Nhưng biên bản của đội cứu hoả kẹp ở trang cuối ghi: "Tìm thấy bảy người trên tầng 4."
- Hiệu ứng: clue c5.
- Tiếp: M9-03

### Pha 1 – Người đàn bà áo trắng

#### M9-10 · Bà ấy lên

- Hiệu ứng: time "23:30", sanity −1.
- `sound · cầu thang · 2` Lẹp xẹp… lẹp xẹp… — đúng tiếng dép lê bạn đã nghe cạnh quan tài đêm nào.
- `npc · ba_sau` Bà ấy lên đến tầng ba rồi!
- `npc · ba_hoa` Bịt mắt lại hết! Đừng nhìn!
- `env · nhìn` Bà Hoa xé vạt áo thành từng dải, chia cho mọi người.

1. Bịt mắt → M9-11 · `eyes_closed` true
2. Không bịt mắt, nhìn về phía cầu thang → M9-12

#### M9-11 · Bịt mắt

- `sound · cầu thang · 3` Uỵch! — có người vấp ngã.
- `npc · bac_si_thanh · hét` Bà Sáu ngã!
- `narration` Cầu thang xuống bàn thờ chung ở ngay trước mặt bạn. Bạn không nhìn thấy gì.
- `npc · ba_hai · thì thầm` (sát tai) Cháu bịt mắt làm gì. Mặt bà có gì đâu mà sợ.

1. Giữ khăn, lần xuống cầu thang → D2
2. Tháo khăn, nhìn vào mặt bà → M9-12 · `eyes_closed` false

#### M9-12 · Khuôn mặt

- Hiệu ứng: sanity −1.
- `env · nhìn` Người đàn bà áo trắng đứng ở đầu cầu thang. Mặt bà không có mắt, chỉ có hai vùng da nhẵn.
- `env · nhìn` Hai tay bà ôm một cái hũ sành trước ngực. Nắp hũ hé mở.
- `sound · trong hũ · 1` Lạo xạo… — như có những thứ tròn tròn lăn bên trong.
- `npc · ba_hai` Mở hũ ra cho bà. Bà muốn nhìn thấy.
- Nếu sanity ≤ 2: Huyết tự L2 (chưa đánh dấu k1) hiện bản méo; dòng F1 hiện mực `kho`.

1. Mở nắp hũ → D1
2. Hỏi: "Bà là ai?" → M9-13
3. Lách qua bà, chạy xuống bàn thờ chung → M9-20

#### M9-13 · Không ai nhớ

- `npc · ba_hai` Không ai còn nhớ tên bà nữa.
- `npc · ba_hai` Bốn mươi năm nay, bà đi tìm người nhớ.
- `narration` (nếu flag `biet_ten_hai`) Bạn nhớ dòng tên bị gạch đen trong cuốn sổ cũ.

1. (nếu flag `biet_ten_hai`) "Bà là bà Hai." → M9-14
2. Lách qua bà, chạy xuống bàn thờ chung → M9-20
3. Mở nắp hũ cho bà → D1

#### M9-14 · Bà Hai

- `npc · ba_hai` Ừ.
- `sound · trong hũ · 1` Cạch. — nắp hũ khép lại.
- `npc · ba_hai` Xuống thắp cho bà một nén.
- Tiếp: M9-20

### Pha 2 – Bàn thờ chung

#### M9-20 · Sáu bài vị

- Hiệu ứng: time "04:30".
- `env · nhìn` Bàn thờ ở chiếu nghỉ. Sáu bài vị gỗ: Tâm, Hằng, Khải, Na, Dung, Lâm.
- `env · nhìn` (nếu not_flag `co_bay_nen`) Ống hương trên bàn thờ còn đúng sáu nén.
- `env · nhìn` (nếu flag `co_bay_nen`) Bạn cầm bó hương bảy nén của bà Hoa.
- `sound · sau lưng · 1` Lẹp xẹp… — tiếng dép lê dừng lại ngay sau lưng bạn.
- Nếu sanity ≤ 2: Huyết tự L4 (chưa đánh dấu k4) hiện bản méo.

1. Thắp sáu nén, khấn sáu tên trên bài vị → D3
2. (nếu not_flag `co_bay_nen`) Bẻ đôi một nén cho đủ bảy → M9-23 · flag `co_bay_nen`
3. (nếu flag `co_bay_nen`) Thắp bảy nén → M9-23

#### M9-23 · Khấn

- `env · nhìn` Bảy đốm lửa đỏ trong bát hương.
- `narration` Bạn chắp tay.

1. Khấn sáu tên trên bài vị → M9-21
2. (nếu flag `biet_ten_hai`) Khấn sáu tên, và tên bà Đỗ Thị Hai → M9-22
3. Khấn sáu tên, và tên của chính bạn → D4

#### M9-21 · Sáu tên

- Hiệu ứng: time "05:30".
- `env · nhìn` Bảy nén hương cháy đều.
- `sound · rất xa · 2` Ò… ó… o…
- `npc · ba_hai` Vẫn chưa ai gọi tên bà.
- `sound · cầu thang · 1` Lẹp xẹp… lẹp xẹp… — tiếng dép lê đi ngược lên tầng bốn.
- Tiếp: E2

#### M9-22 · Bảy tên

- `narration` Tâm. Hằng. Khải. Na. Dung. Lâm. Và Đỗ Thị Hai.
- `sound · sau lưng · 1` Cạch. — nắp hũ đậy lại.
- `env · nhìn` Bảy sợi khói bện vào nhau thành một dải, bay thẳng lên trần.
- `npc · ba_hai` Có người nhớ rồi.
- `env · ngửi` Mùi khét cũ, mùi khói bốn mươi năm, tan dần rồi mất hẳn.
- `sound · rất xa · 2` Ò… ó… o… Ò… ó… o… Ò… ó… o…
- Hiệu ứng: time "05:30".
- Tiếp: E1

## Kết cục

| id | Kích hoạt từ | Dòng cuối | Luật | `solution` | Hé lộ |
| --- | --- | --- | --- | --- | --- |
| E1 · Lửa đã tắt | M9-22 | `env · nhìn` Trên bảng tin tầng một, tờ cáo phó ố vàng giờ có đủ bảy khung ảnh. Khung thứ bảy là một bà cụ, đôi mắt hiền. | — | [k1, k3, k4] | Đôi mắt nằm trong hũ, không nằm trên mặt bà. Dòng máu khô năm 1986 là Huyết tự thật: phải đủ bảy tên. Vong thứ bảy là bà Hai, tổ trưởng chết khi lên cứu người, bị gạch tên suốt bốn mươi năm. |
| E2 · Bình minh, chưa hết | M9-21 | `narration` Tháng Bảy năm sau, bà ấy sẽ lại đến. | — | [k4] | Bạn đã đủ hương cho mọi vong, nhưng mới khấn sáu cái tên. Dòng máu khô đòi bảy. |
| D1 · Nhìn vào hũ | M9-12, M9-13 | `env · nhìn` Trong hũ, hàng chục con mắt cùng lúc ngước lên nhìn bạn. | `violates: [L2]` | [k1, F1] | Đôi mắt của bà nằm trong hũ. Dòng bảo mở hũ là mực nâu, không phải Huyết tự. |
| D2 · Ngã cầu thang | M9-11 | `env · chạm` Bậc thang hụt dưới chân. Bạn rơi vào bóng tối, và không ai đỡ. | — | [k1] | Luật chỉ cấm nhìn vào mắt bà, không cấm nhìn mặt. Bịt mắt trên cầu thang tối là tự đẩy mình xuống. |
| D3 · Thiếu hương | M9-20 | `env · chạm` Sáu nén hương tắt cùng lúc. Một bàn tay khô, lạnh đặt lên vai bạn: "Phần của bà đâu?" | `violates: [L3]` | [k3, k4] | Bàn thờ có sáu bài vị, nhưng dòng máu khô nói bảy cái tên. Mọi vong là bảy vong. |
| D4 · Khấn tên mình | M9-23 | `env · nhìn` Khung ảnh thứ bảy trên tờ cáo phó không còn trống. Đó là ảnh của bạn. | `consequence_of: [L4]` | [k4] | Khấn tên người sống là đưa người ấy vào hàng vong. Vong thứ bảy phải là người đã khuất. |

## Kiểm tra nhanh

- Mức mất tối đa là 3 (c2, M9-10, M9-12). Bản méo ở M9-12 và M9-20 chỉ tới được khi đã chọn c2 và đi qua M9-12.
- E1 cần cờ `biet_ten_hai` (từ c1 hoặc c2). Không có `co_bay_nen` vẫn tới E1 được bằng cách bẻ đôi một nén.
- Test cần có:
  - E1 có và không có `co_bay_nen`;
  - E1 đi qua M9-11 rồi tháo khăn;
  - E1 đi qua M9-14;
  - E2;
  - D1 từ M9-12 và M9-13; D2; D3; D4;
  - lựa chọn c5 chỉ hiện khi có hồ sơ `hs_chay_c4_1986`;
  - bản méo L2, L4 và mực `kho` của F1;
  - E1 hiện màn kết thúc game, E2 hiện kết thúc mở.
