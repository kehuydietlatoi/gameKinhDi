# Màn 5 – Nội quy

Sinh lộ: trên tường có tám dòng, nhưng chỉ sáu dòng chữ đỏ là Huyết tự. Hai dòng mực nâu đen do thứ ngoài cửa viết thêm, và mỗi dòng nâu trái ngược đúng một dòng đỏ. Làm theo chữ đỏ, bỏ qua chữ nâu, và nhớ màu mực khi Tỉnh táo thấp làm mọi dòng cùng đỏ.

## Tổng quan

- **Bối cảnh:** đêm 22 tháng Bảy âm lịch, căn hộ 304. Người chơi vừa từ trạm y tế về.
- **Trạng thái đầu:** `sanity` 5, `actions_left` 2, `role` none, `time` "22:00".
- **Mục tiêu dạy:** chỉ chữ đỏ là Huyết tự; khi hai luật mâu thuẫn, nhìn mực; phải nhớ điều đã thấy khi Tỉnh táo còn cao.
- **`on_sanity_zero`:** không cần; mức mất tối đa là 4.
- **`solution` cấp màn:** `[F1, F2]`.

### Các dòng trên tường (theo thứ tự hiển thị)

| Thứ tự | id | Mực | Nội dung | `violable` |
| --- | --- | --- | --- | --- |
| 1 | L1 | đỏ | Từ mười một giờ đêm đến năm giờ sáng, không được mở cửa căn hộ. | true |
| 2 | F1 | nâu | Nếu nghe tiếng mẹ gọi, hãy mở cửa. | (dòng giả) |
| 3 | L2 | đỏ | Có người gõ cửa ba tiếng thì không được trả lời. | true |
| 4 | L3 | đỏ | Nước máy chảy ra màu đỏ thì không được dùng. | true |
| 5 | L4 | đỏ | Mất điện thì phải thắp nến; căn hộ không được tối hoàn toàn. | true |
| 6 | F2 | nâu | Mất điện thì phải ngồi yên trong bóng tối; không được thắp lửa. | (dòng giả) |
| 7 | L5 | đỏ | Trong căn hộ này chỉ có một mình bạn. | false |
| 8 | L6 | đỏ | Năm giờ sáng, cửa sẽ tự mở. | false |

### Sinh lộ

F1 trái với L1, F2 trái với L4. Chỉ chữ đỏ là Huyết tự, nên mẹ gọi cũng không mở cửa, và mất điện thì phải thắp nến. L5 cho biết giọng trẻ con dưới gầm giường không phải người. L6 cho biết cửa sẽ tự mở lúc năm giờ, nên lúc 4:59 không được tự mở dù có ai giục.

Khi `sanity` ≤ 2, hai dòng nâu hiển thị bằng mực đỏ. Người chơi phải nhớ dòng thứ hai và thứ sáu là dòng giả.

### Từ khoá đánh dấu

Chỉ chọn trong các dòng đỏ.

| id | Dòng | Cụm từ | Đúng |
| --- | --- | --- | --- |
| k1 | L1 | không được mở cửa căn hộ | không |
| k2 | L1 | đến năm giờ sáng | có |
| k3 | L2 | gõ cửa ba tiếng | không |
| k4 | L4 | phải thắp nến | có |
| k5 | L5 | chỉ có một mình bạn | có |
| k6 | L6 | cửa sẽ tự mở | không |

### Bóp méo (khi `sanity` ≤ 2)

| Dòng | Trừ khi đã đánh dấu | Bản méo hiển thị |
| --- | --- | --- |
| F1 | (không bảo vệ được) | Mực đổi sang đỏ, nội dung giữ nguyên |
| F2 | (không bảo vệ được) | Mực đổi sang đỏ, nội dung giữ nguyên |
| L1 | k2 | Từ mười một giờ đêm đến bốn giờ sáng, không được mở cửa căn hộ. |

## Yêu cầu với engine

Ghi vào `docs/spec-changes.md` theo AGENTS.md mục 12.

1. **Dòng giả trong khối Huyết tự.** Một dòng `bloodtext` có thể khai báo `fake: true` và `ink: nau`. Dòng giả hiển thị chung khối với Huyết tự, không có `violable`, không được chọn làm từ khoá, và không được nằm trong `violates`.
2. **Thuộc tính `ink` cho từng dòng:** `do` (mặc định), `nau` (mực nâu đen, dòng giả), `kho` (máu khô, Huyết tự cũ; dùng ở màn 9). Mỗi kiểu mực phải phân biệt được **không chỉ bằng màu**, để người mù màu cũng chơi được. Ví dụ: `nau` dùng chữ thường không viền, nét đều; `kho` có gạch chân chấm và chữ hơi nghiêng. Màu của từng kiểu vẫn phải đạt tương phản ≥ 4.5:1.
3. **Bóp méo đổi mực.** Mục `distortions` cho phép `{line: F1, ink: do}`: khi `sanity` ≤ 2, dòng hiển thị bằng mực khác, nội dung giữ nguyên. Không có `unless_highlighted`.
4. **`solution` tham chiếu được dòng giả.** Trên màn hình chết, dòng giả trong `solution` hiển thị kèm gạch ngang.
5. **Ánh sáng `candle`:** lớp phủ ấm màu cam, viền tối dần. Nếu có lay động thì tối đa 2 lần đổi mỗi giây; với `prefers-reduced-motion` thì đứng yên.

## Nhân vật

| id | Tên hiển thị | Mô tả | Thật sự là |
| --- | --- | --- | --- |
| `ba_sau` | Bà Sáu | Phòng 305, chỉ nói chuyện qua vách | Người thật |
| `gia_ba_sau` | Bà Sáu | Giọng giống hệt bà Sáu, ở ngoài cửa | Quỷ |
| `giong_me` | Mẹ | Giọng mẹ người chơi | Quỷ |
| `giong_gam_giuong` | Một giọng trẻ con | Từ dưới gầm giường | Quỷ |

## Manh mối

Ở hub M5-03, người chơi có 2 lượt trong 4 hành động.

| id | Hành động | Node | Phát hiện | Tỉnh táo |
| --- | --- | --- | --- | --- |
| c1 | Gõ vách sang phòng 305 | M5-04 | Bà Sáu: nhà bà cũng có tám dòng, hai dòng nâu nét trơn như mực; đêm nay bà không gõ cửa nhà ai | 0 |
| c2 | Tìm nến và diêm | M5-05 | Hai cây nến, bao diêm còn ba que (bật cờ `co_nen`) | 0 |
| c3 | Nhìn qua lỗ khoá ra hành lang | M5-06 | Một bàn tay cầm bút lông chấm lọ mực nâu, viết thêm lên cửa 306 | −1 |
| c4 | Nhìn kỹ các dòng chữ | M5-07 | Sáu dòng đỏ còn ướt, chảy thành giọt; hai dòng nâu khô ráo, nét đều như bút lông | 0 |

## Cảnh và ảnh nền

Màn 5 cần 1 ảnh mới và dùng lại `can_ho_304`.

### Brief vẽ

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `hanh_lang_lo_khoa` | Nhìn qua lỗ khoá cửa căn hộ 304 ra hành lang tầng 3. Dựng từ code của `hanh_lang_tang_2`. Khung hình là mảng đen, ô nhìn hình lỗ khoá ở giữa. | Hành lang tối với các cửa gỗ sơn xanh; trên mỗi cánh cửa nhìn thấy được có một mảng chữ đỏ máu không đọc được | Người, bàn tay, bút lông, lọ mực, chữ đọc được, mảng chữ màu nâu | không |

Bàn tay, bút lông và lọ mực ở M5-06 là manh mối c3; để chữ kể, không vẽ (cũng vì không được vẽ người), nên ảnh không mang `clue`.

### Gán cảnh cho node

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M5-01 | `can_ho_304` | `normal` | |
| M5-03 | `can_ho_304` | `normal` | Khai báo ở hub; đặt lại cảnh sau M5-06 |
| M5-06 | `hanh_lang_lo_khoa` | `normal` | Nhìn qua lỗ khoá |
| M5-30 | `can_ho_304` | `dark` | Mất điện |
| M5-31 | `can_ho_304` | `candle` | Giữ đến M5-40 |
| M5-41 | `can_ho_304` | `dawn` | |
| E1 | `can_ho_304` | `dawn` | |
| D1–D4 | | | Mặc định nền đen |

## Kịch bản theo node

### Pha 0 – Tám dòng

#### M5-01 · Về nhà

- Hiệu ứng: time "22:00".
- `narration` Bạn về đến căn hộ 304. Cài then cửa hai lần.
- `env · nhìn` Bóng đèn sợi đốt, giường đơn, tủ gỗ, chiếc gương nhỏ.
- `sound · bức tường cạnh cửa · 2` Sột… soạt… sột… soạt… — tiếng cào kéo dài hơn mọi lần.
- Tiếp: M5-02

#### M5-02 · Nội quy

- `env · nhìn` Chữ đỏ rỉ ra trên bức tường cạnh cửa. Lần này có tám dòng.
- `bloodtext` L1, F1, L2, L3, L4, F2, L5, L6 (F1 và F2 mực `nau`).
- `env · nhìn` Dòng thứ hai và dòng thứ sáu không đỏ. Chúng có màu nâu đen.
- `highlight: true`: mở giao diện đánh dấu (k1–k6) sau khi các dòng hiện hết, cho phép bỏ qua.
- `system` Bạn có 2 lượt hành động trước mười một giờ.
- Tiếp: M5-03

#### M5-03 · Hub căn hộ

`hub: true`, `hub_done: {actions_left_lte: 0}`, `hub_exit: M5-10`. Mỗi lựa chọn dùng một lần, tốn 1 lượt (`actions_left −1`), xong quay về M5-03.

1. Gõ vách sang phòng 305 → M5-04
2. Tìm nến và diêm → M5-05
3. Nhìn qua lỗ khoá ra hành lang → M5-06
4. Nhìn kỹ các dòng chữ trên tường → M5-07

#### M5-04 · Bà Sáu

- `sound · vách tường · 2` Cộc cộc.
- `npc · ba_sau` Cậu 304 à? Nhà bà cũng có tám dòng.
- `npc · ba_sau` Sáu dòng đỏ tươi. Còn hai dòng nâu, nét trơn như mực, chẳng giống máu tí nào.
- `npc · ba_sau` Đêm nay bà không gõ cửa nhà ai đâu đấy. Ai gõ thì cũng đừng thưa.
- Hiệu ứng: clue c1.
- Tiếp: M5-03

#### M5-05 · Nến

- `sound · ngăn kéo · 1` Cạch.
- `env · nhìn` Hai cây nến trắng và một bao diêm. Trong bao còn ba que.
- Hiệu ứng: clue c2, flag `co_nen`.
- Tiếp: M5-03

#### M5-06 · Lỗ khoá

- `env · nhìn` Hành lang tối. Trên cửa nhà nào cũng có chữ đỏ.
- `env · nhìn` Trước cửa 306, một bàn tay gầy cầm bút lông, chấm vào lọ mực nâu, viết thêm một dòng.
- `sound · hành lang · 1` Sột… — bàn tay dừng lại. Rồi từ từ quay về phía cửa nhà bạn.
- Hiệu ứng: clue c3, sanity −1.
- Tiếp: M5-03

#### M5-07 · Hai loại chữ

- `env · nhìn` Sáu dòng đỏ vẫn còn ướt, chảy thành từng giọt dài.
- `env · nhìn` Hai dòng nâu khô ráo, nét đều tăm tắp như viết bằng bút lông.
- `env · ngửi` Chữ đỏ tanh mùi sắt. Chữ nâu thơm mùi mực tàu.
- Hiệu ứng: clue c4.
- Tiếp: M5-03

### Pha 1 – Đêm

#### M5-10 · Ba tiếng gõ

- Hiệu ứng: time "23:30".
- `sound · cửa · 2` Cộc. Cộc. Cộc.
- `npc · gia_ba_sau` Cậu 304 ơi, bà Sáu đây. Cho bà mượn bao diêm.
- `narration` (nếu clue c1) Bà Sáu vừa nói đêm nay bà không gõ cửa nhà ai.

1. Trả lời: "Bà đợi cháu tí." → D1
2. Mở cửa → D2
3. Im lặng → M5-11

#### M5-11 · Bỏ đi

- `sound · cửa · 2` Cộc. Cộc. Cộc.
- `npc · gia_ba_sau · thì thầm` Cậu có nhà mà.
- `sound · hành lang · 1` Lẹp xẹp… — tiếng dép lê xa dần.
- Tiếp: M5-12

#### M5-12 · Vòi nước

- Hiệu ứng: time "00:00".
- `sound · bồn rửa · 1` Ồ ồ… — vòi nước tự mở.
- `env · nhìn` Nước chảy ra đỏ sẫm, sánh, đọng thành vũng trong bồn.
- `env · ngửi` Tanh mùi sắt.
- `narration` Cổ họng bạn khô rát. Cơn sốt chưa dứt hẳn.

1. Vốc nước rửa mặt → D3
2. Khoá vòi, không chạm vào nước → M5-20
3. Uống một ngụm → D3

#### M5-20 · Tiếng mẹ

- Hiệu ứng: time "00:30", sanity −1.
- `sound · ngoài cửa · 1` Lạch xạch… — tiếng một chùm chìa khoá.
- `npc · giong_me` Con ơi. Mẹ đây. Mẹ quên chìa khoá.
- `npc · giong_me` Mở cửa cho mẹ. Ngoài này lạnh lắm.

1. Mở cửa → D2
2. Đáp: "Mẹ ơi…", nhưng không mở cửa → M5-21 · sanity −1
3. Bịt tai, ngồi im → M5-21

#### M5-21 · Mẹ đi

- `npc · giong_me` Con không thương mẹ nữa à…
- `sound · cầu thang · 1` Hu hu… — tiếng khóc xa dần xuống cầu thang.
- Tiếp: M5-30

#### M5-30 · Mất điện

- Hiệu ứng: time "01:30".
- `sound · khắp tòa nhà · 3` Phụt. — mọi bóng đèn tắt cùng lúc.
- `npc · giong_gam_giuong · thì thầm` Anh ơi… đừng thắp lửa. Nó thấy ánh lửa là nó vào.
- Nếu sanity ≤ 2: dòng F1, F2 hiện mực đỏ; Huyết tự L1 (chưa đánh dấu k2) hiện bản méo.

1. (nếu flag `co_nen`) Thắp nến → M5-31
2. (nếu not_flag `co_nen`) Lần mò ngăn kéo tìm nến, rồi thắp lên → M5-31
3. Ngồi yên trong bóng tối → D4
4. Ra hành lang xin lửa → D2

#### M5-31 · Ánh nến

- `env · nhìn` Ngọn nến lay lắt. Bóng tủ gỗ đổ dài lên trần.
- `sound · gầm giường · 1` Sột soạt.
- `npc · giong_gam_giuong` Anh thổi nến đi mà. Em sợ lắm.

1. Thổi nến → D4
2. Cúi nhìn xuống gầm giường → M5-32 · sanity −1
3. Nhìn thẳng vào ngọn nến, không đáp → M5-40

#### M5-32 · Gầm giường

- `env · nhìn` Dưới gầm giường trống trơn. Chỉ có một đôi dép nhựa trẻ con, ướt sũng.
- `npc · giong_gam_giuong · thì thầm` (giờ ở ngay sau lưng bạn) Em ở đây cơ mà.
- Tiếp: M5-40

### Pha 2 – Gần sáng

#### M5-40 · Bốn giờ năm mươi chín

- Hiệu ứng: time "04:59".
- `env · nhìn` Dưới ánh nến, đồng hồ treo tường chỉ bốn giờ năm mươi chín.
- `sound · ngoài cửa · 1` Lẹp xẹp…
- `npc · gia_ba_sau` Năm giờ rồi cậu ơi. Ra giúp bà một tay.
- Nếu sanity ≤ 2: dòng F1, F2 hiện mực đỏ; Huyết tự L1 (chưa đánh dấu k2) hiện bản méo.

1. Mở cửa → D2
2. Chờ → M5-41

#### M5-41 · Cửa tự mở

- Hiệu ứng: time "05:00".
- `sound · ổ khoá · 2` Cạch. — then cửa tự bật ra.
- `env · nhìn` Cánh cửa hé mở. Ánh sáng xám nhạt của hành lang lọt vào.
- Tiếp: E1

## Kết cục

| id | Kích hoạt từ | Dòng cuối | Luật | `solution` | Hé lộ |
| --- | --- | --- | --- | --- | --- |
| E1 · Sống sót | M5-41 | `env · nhìn` Trên bức tường cạnh cửa chỉ còn sáu dòng chữ đỏ. Hai dòng nâu đã biến mất, như chưa từng được viết. | — | [F1, F2] | Chỉ chữ đỏ là Huyết tự. Mỗi dòng nâu trái với một dòng đỏ, và đều do thứ ngoài cửa viết thêm. |
| D1 · Trả lời tiếng gõ | M5-10 | `sound · tủ quần áo · 2` Cộc. Cộc. Cộc. — lần này tiếng gõ vang lên từ bên trong tủ quần áo. | `violates: [L2]` | [L2] | Có người gõ cửa ba tiếng. Bà Sáu thật đêm nay không gõ cửa nhà ai. |
| D2 · Mở cửa | M5-10, M5-20, M5-30, M5-40 | `env · nhìn` Cánh cửa mở ra. Hành lang không có ai. Ngay ngưỡng cửa có một lọ mực nâu và một cây bút lông còn ướt. | `violates: [L1]` | [k2, F1] | Cấm mở cửa đến năm giờ sáng. Dòng bảo mở cửa khi mẹ gọi là mực nâu, không phải Huyết tự. |
| D3 · Dùng nước đỏ | M5-12 | `env · chạm` Nước đỏ không chảy xuống. Nó bò ngược lên cổ tay bạn. | `violates: [L3]` | [L3] | Nước máy chảy ra màu đỏ thì không được dùng. |
| D4 · Bóng tối | M5-30, M5-31 | `sound · bên gối · 1` Trong bóng tối, có tiếng thở thứ hai ngay cạnh tai bạn. | `violates: [L4]` | [k4, F2] | Huyết tự bắt thắp nến. Dòng cấm thắp lửa là mực nâu. Theo L5, trong căn hộ chỉ có một mình bạn, nên giọng dưới gầm giường không phải người. |

## Kiểm tra nhanh

- Mức mất tối đa là 4 (c3, M5-20, đáp lời mẹ, nhìn gầm giường).
- Bản méo ở M5-30 cần ba lần mất trước đó (c3, M5-20, đáp lời mẹ). Bản méo ở M5-40 tới được khi mất từ 3 trở lên.
- Test cần có: đường sống có và không có `co_nen`; D1; D2 từ cả bốn node; D3 với hai lựa chọn; D4 từ M5-30 và M5-31; mực đỏ của F1, F2 khi `sanity` ≤ 2; bản méo L1 khi chưa đánh dấu k2.
