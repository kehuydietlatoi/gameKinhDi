# Màn 7 – Giữ lửa

Sinh lộ: Huyết tự ghi sáu cái tên, và trong bếp có đúng sáu người, nhưng người chơi không phải một trong sáu. Chị Hạnh đang nằm trạm y tế. Khi thứ ngoài ngõ gọi "Hạnh", người chơi đáp "dạ" để trở thành người có tên, rồi ở lại giữ lửa đến sáng.

## Tổng quan

- **Bối cảnh:** đêm 26 tháng Bảy âm lịch. Trạm biến áp cháy, cả khu mất điện từ chập tối. Mọi người kéo xuống bếp tập thể tầng 1, nơi có lò than chung xây gạch. Hai dãy bếp than tổ ong nhỏ kê sát tường, mỗi bếp có một tấm biển gỗ ghi tên chủ hộ.
- **Trạng thái đầu:** `sanity` 5, `actions_left` 2, `role` none, `time` "21:00".
- **Mục tiêu dạy:** đếm đủ chưa chắc đã đúng người; luật bảo vệ "người có tên", không bảo vệ "người trong bếp"; một cái tên có thể được nhận thay.
- **`on_sanity_zero`:** không cần; mức mất tối đa là 3.
- **`solution` cấp màn:** `[k1, k3, k4]`.

### Huyết tự (nguyên văn)

| Dòng | Nội dung | `violable` |
| --- | --- | --- |
| L1 | Đêm nay, sáu người sau đây phải giữ lửa trong bếp tập thể đến sáng: Sáu, Hoa, Thanh, Đức, Tuấn, Hạnh. | true |
| L2 | Lửa tắt thì không ai trong bếp thấy được bình minh. | false |
| L3 | Thứ ngoài ngõ sẽ gọi tên từng người. Người được gọi tên phải đáp "dạ". | true |
| L4 | Thứ ngoài ngõ không đụng tới người có tên trong danh sách. | false |

### Sinh lộ

Trong bếp có bà Sáu, bà Hoa, bác sĩ Thanh, ông Đức, anh Tuấn và người chơi: đủ sáu người, nhưng chị Hạnh không có mặt. Người chơi là người duy nhất không có tên, nên L4 không che chở. Ra khỏi bếp là chết.

Khi thứ ngoài ngõ gọi "Hạnh" mà không ai đáp, L3 bị vi phạm. Người chơi đáp "dạ" thì chính người chơi là người được gọi tên đó, và từ lúc ấy là người có tên trong danh sách. Sau đó, với tư cách một trong sáu người, người chơi vẫn phải ở trong bếp giữ lửa (L1), kể cả khi được gọi ra ngõ.

### Từ khoá đánh dấu

| id | Dòng | Cụm từ | Đúng |
| --- | --- | --- | --- |
| k1 | L1 | sáu người sau đây | có |
| k2 | L1 | giữ lửa trong bếp tập thể | không |
| k3 | L3 | Người được gọi tên phải đáp | có |
| k4 | L4 | người có tên trong danh sách | có |
| k5 | L2 | Lửa tắt | không |
| k6 | L3 | gọi tên từng người | không |

### Bóp méo (khi `sanity` ≤ 2)

| Dòng | Trừ khi đã đánh dấu | Bản méo hiển thị |
| --- | --- | --- |
| L3 | k3 | Thứ ngoài ngõ sẽ gọi tên từng người. Người được gọi tên không được đáp lời. |
| L4 | k4 | Thứ ngoài ngõ không đụng tới người ở trong bếp. |

## Yêu cầu với engine

Không cần bổ sung. Dùng ánh sáng `candle` (từ màn 5) cho ánh lửa lò.

## Nhân vật

Tất cả là người thật, trừ thứ ngoài ngõ. Chị Hạnh chỉ được nhắc tên.

| id | Tên | Mô tả | Vai trò |
| --- | --- | --- | --- |
| `ba_sau` | Bà Sáu | Đã khỏi sốt | Đọc tên, che chở người chơi |
| `ba_hoa` | Bà Hoa | Chủ tiệm vàng mã | Hiểu chuyện tên tuổi |
| `bac_si_thanh` | Bác sĩ Thanh | Sang thăm bà Sáu rồi kẹt lại vì mất điện | Biết chị Hạnh đang ở đâu |
| `ong_duc` | Ông Đức | ~65 tuổi, phòng 201, thợ lò về hưu | Biết về lò than |
| `anh_tuan` | Anh Tuấn | ~30 tuổi, phòng 206, nóng nảy | Đòi đuổi "người thừa" ra ngoài |
| `thu_ngoai_ngo` | Thứ ngoài ngõ | Giọng đều đều, rè như loa phường | Gọi tên |

## Manh mối

Ở hub M7-03, người chơi có 2 lượt trong 4 hành động.

| id | Hành động | Node | Phát hiện | Tỉnh táo |
| --- | --- | --- | --- | --- |
| c1 | Đọc biển tên trên các bếp | M7-04 | Biển bếp nhà bạn bị cạo trắng; bếp số 7 ghi "Hạnh – 302" | −1 |
| c2 | Hỏi bác sĩ Thanh về chị Hạnh | M7-05 | Chị Hạnh đang truyền dịch ở trạm y tế, đêm nay không về | 0 |
| c3 | Hỏi ông Đức về lò than | M7-06 | Thùng than ở góc đủ đốt đến sáng | 0 |
| c4 | Đếm người trong bếp | M7-07 | Sáu người, sáu cái bóng trên tường; trong đó có bạn | 0 |

## Cảnh và ảnh nền

Màn 7 cần 1 ảnh mới.

### Brief vẽ

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `bep_tap_the` | Nhìn dọc gian bếp tập thể tầng 1. | Lò than lớn xây gạch ở giữa, miệng lò đỏ; hai dãy bếp than tổ ong kê sát hai bên tường, trên mỗi bếp có một tấm biển gỗ nhỏ; thùng than ở góc phải; cửa gỗ ra ngõ ở cuối gian, có khe hở; một mảng tường quét vôi trống phía trên lò (chỗ Huyết tự hiện) | Người, bóng người trên tường, chữ đọc được trên biển | không |

### Gán cảnh cho node

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M7-01 | `bep_tap_the` | `candle` | Ánh lửa lò; giữ suốt màn |
| M7-20 | `bep_tap_the` | `dark` | Lửa yếu |
| M7-21 | `bep_tap_the` | `candle` | |
| M7-40 | `bep_tap_the` | `dawn` | |
| E1 | `bep_tap_the` | `dawn` | |
| D1–D4 | | | Mặc định nền đen |

## Kịch bản theo node

### Pha 0 – Mất điện

#### M7-01 · Bếp tập thể

- Hiệu ứng: time "21:00".
- `narration` Cả khu mất điện từ chập tối. Mọi người kéo nhau xuống bếp tập thể cho ấm.
- `env · nhìn` Lò than chung giữa gian bếp đỏ rực. Hai dãy bếp tổ ong nguội lạnh kê sát tường.
- `sound · ngoài ngõ · 1` Vù… — gió lùa qua khe cửa gỗ.
- `npc · ba_sau` Ngồi gần lò vào. Đêm nay đừng ai về phòng.
- Tiếp: M7-02

#### M7-02 · Sáu cái tên

- `sound · tường trên lò · 2` Sột… soạt…
- `env · nhìn` Chữ đỏ rỉ ra trên mảng tường quét vôi phía trên lò than.
- `bloodtext` L1–L4.
- `highlight: true`: mở giao diện đánh dấu (k1–k6) sau khi các dòng hiện hết, cho phép bỏ qua.
- `npc · ba_sau` Sáu, Hoa, Thanh, Đức, Tuấn, Hạnh.
- `npc · anh_tuan` Đủ sáu người. May quá.
- `npc · ba_hoa` Hạnh nào? Hạnh phòng 302 à?
- `env · nhìn` Không ai trả lời.
- Tiếp: M7-03

#### M7-03 · Hub bếp

`hub: true`, `hub_done: {actions_left_lte: 0}`, `hub_exit: M7-10`. Mỗi lựa chọn dùng một lần, tốn 1 lượt (`actions_left −1`), xong quay về M7-03.

1. Đọc biển tên trên các bếp → M7-04
2. Hỏi bác sĩ Thanh về chị Hạnh → M7-05
3. Hỏi ông Đức về lò than → M7-06
4. Đếm người trong bếp → M7-07

#### M7-04 · Biển tên

- `env · nhìn` Mỗi bếp tổ ong có một tấm biển gỗ ghi tên chủ hộ.
- `env · nhìn` Bếp thứ bảy: "Hạnh – 302".
- `env · nhìn` Bếp nhà bạn ở cuối dãy. Tấm biển đã bị ai cạo trắng, không còn một nét chữ.
- Hiệu ứng: clue c1, sanity −1.
- Tiếp: M7-03

#### M7-05 · Chị Hạnh

- `npc · bac_si_thanh` Hạnh à? Chiều nay tôi vừa truyền dịch cho chị ấy ở trạm.
- `npc · bac_si_thanh` Đêm nay chị ấy không về được đâu.
- Hiệu ứng: clue c2.
- Tiếp: M7-03

#### M7-06 · Lò than

- `sound · lò · 1` Lách tách…
- `npc · ong_duc` Lò này tôi xây từ năm bảy chín, chưa tắt bao giờ.
- `npc · ong_duc` Thùng than ở góc kia đủ đốt đến sáng. Đừng ai mở cửa ngõ cho gió lùa là được.
- Hiệu ứng: clue c3.
- Tiếp: M7-03

#### M7-07 · Đếm người

- `narration` Bà Sáu. Bà Hoa. Bác sĩ Thanh. Ông Đức. Anh Tuấn. Và bạn.
- `narration` Sáu.
- `env · nhìn` Trên tường, ánh lò hắt lên sáu cái bóng.
- Hiệu ứng: clue c4.
- Tiếp: M7-03

### Pha 1 – Người thừa

#### M7-10 · Người không tên

- Hiệu ứng: time "23:00".
- `npc · anh_tuan` Khoan. Chị Hạnh không có ở đây. Thế cậu 304 là ai trong sáu người?
- `npc · anh_tuan` Chữ máu chỉ nói sáu người có tên. Người không tên thì ra ngoài, kẻo nó vào tìm.
- `sound · ngoài ngõ · 1` Rè… rè… — như tiếng loa phường đang dò sóng.

1. "Tôi ra ngoài." → D2
2. "Tôi ở lại." → M7-11
3. (nếu clue c2) "Chị Hạnh đang nằm trạm y tế. Tôi ở lại giữ lửa thay chị ấy." → M7-11

#### M7-11 · Ở lại

- `npc · ba_sau` Thôi, để cậu ấy ở lại. Ra ngoài giờ này thì chết.
- `npc · anh_tuan` Tuỳ bà.
- Tiếp: M7-20

### Pha 2 – Giữ lửa

#### M7-20 · Lửa yếu

- Hiệu ứng: time "01:00".
- `env · nhìn` Miệng lò chỉ còn đỏ lờ mờ.
- `npc · anh_tuan` Hết than rồi! Phải ra kho ngoài ngõ lấy thêm.

1. Ra kho ngoài ngõ lấy than → D2
2. (nếu clue c3) Xúc than trong thùng ở góc bỏ vào lò → M7-21
3. Đập một chiếc ghế gỗ, bỏ vào lò → M7-21 · sanity −1
4. Ngồi yên chờ người khác lo → D1

#### M7-21 · Lửa bùng

- `sound · lò · 2` Phừng.
- `env · nhìn` Lửa bùng lên, liếm lên tận miệng lò.
- `npc · ong_duc` Đấy. Lò này không tắt được đâu.
- Tiếp: M7-30

### Pha 3 – Gọi tên

#### M7-30 · Điểm danh

- Hiệu ứng: time "03:00", sanity −1.
- `sound · ngoài ngõ · 2` Rè… — tiếng loa im bặt. Rồi một giọng đều đều vang lên.
- `npc · thu_ngoai_ngo` Sáu.
- `npc · ba_sau` Dạ.
- `npc · thu_ngoai_ngo` Hoa.
- `npc · ba_hoa` Dạ.
- `npc · thu_ngoai_ngo` Thanh.
- `npc · bac_si_thanh` Dạ.
- `npc · thu_ngoai_ngo` Đức.
- `npc · ong_duc` Dạ.
- `npc · thu_ngoai_ngo` Tuấn.
- `npc · anh_tuan` Dạ…
- `npc · thu_ngoai_ngo` Hạnh.
- `sound · bếp · 1` Im lặng. Chỉ có tiếng lửa lách tách.
- `npc · thu_ngoai_ngo` Hạnh.
- Nếu sanity ≤ 2: Huyết tự L3 (chưa đánh dấu k3) và L4 (chưa đánh dấu k4) hiện bản méo.

1. Đáp: "Dạ." → M7-31
2. Im lặng → D3
3. Đáp: "Chị Hạnh không có ở đây. Tôi là người ở phòng 304." → D4

#### M7-31 · Đủ

- `npc · thu_ngoai_ngo` Đủ.
- `sound · ngoài ngõ · 1` Rè… rồi tắt hẳn.
- `env · nhìn` Anh Tuấn nhìn bạn trân trối.
- `npc · ba_hoa · thì thầm` Từ giờ đến sáng, cậu là Hạnh.
- Tiếp: M7-32

#### M7-32 · Gọi ra ngõ

- Hiệu ứng: time "04:30".
- `sound · ngoài ngõ · 2` Rè…
- `npc · thu_ngoai_ngo` Hạnh. Ra ngõ lấy than.

1. "Dạ." rồi ngồi yên bên lò → M7-40
2. "Dạ." rồi ra ngõ → D1
3. Im lặng → D3

#### M7-40 · Sáng

- Hiệu ứng: time "05:45".
- `sound · rất xa · 2` Ò… ó… o…
- `env · nhìn` Lò than vẫn đỏ. Ánh xám lọt qua khe cửa ngõ.
- `npc · bac_si_thanh` Sáng rồi.
- Tiếp: E1

## Kết cục

| id | Kích hoạt từ | Dòng cuối | Luật | `solution` | Hé lộ |
| --- | --- | --- | --- | --- | --- |
| E1 · Giữ được lửa | M7-40 | `env · nhìn` Trên tấm biển bị cạo trắng ở bếp nhà bạn, ai đó đã viết bằng than một chữ: Hạnh. | — | [k1, k3, k4] | Huyết tự có sáu cái tên, trong bếp có sáu người, nhưng bạn không phải một trong sáu. Đáp "dạ" khi tên Hạnh được gọi, bạn trở thành người có tên trong danh sách. |
| D1 · Bỏ lửa | M7-20, M7-32 | `env · nhìn` Lò than tắt. Trong bóng tối, tiếng loa rè vang lên ngay giữa gian bếp. | `violates: [L1]`, `consequence_of: [L2]` | [L1] | Sáu người có tên phải giữ lửa trong bếp đến sáng. Đã nhận tên Hạnh thì bạn cũng phải ở lại. |
| D2 · Ra ngoài khi không có tên | M7-10, M7-20 | `sound · ngoài ngõ · 2` Bạn bước ra ngõ. Giọng loa rè gọi một cái tên: tên của bạn. | `consequence_of: [L4]` | [k4] | L4 chỉ che chở người có tên trong danh sách. Bạn không có tên. |
| D3 · Không ai đáp | M7-30, M7-32 | `npc · thu_ngoai_ngo` Thiếu một. | `violates: [L3]` | [k3] | Người được gọi tên phải đáp "dạ". Tên Hạnh được gọi mà không ai đáp. |
| D4 · Xưng tên mình | M7-30 | `env · chạm` Gió lạnh lùa qua khe cửa, chỉ quấn quanh một mình bạn. | `violates: [L3]`, `consequence_of: [L4]` | [k1, k4] | Bạn không đáp "dạ" khi tên Hạnh được gọi, lại tự nhận mình là người không có tên trong danh sách. |

## Kiểm tra nhanh

- Mức mất tối đa là 3 (c1, đập ghế, M7-30). Bản méo ở M7-30 chỉ tới được khi đã chọn c1 và đập ghế.
- Đường sống không cần manh mối nào: ở lại, đập ghế, đáp "dạ" hai lần, ngồi yên.
- Test cần có: đường sống qua cả hai lựa chọn giữ lửa ở M7-20; D1 từ M7-20 và M7-32; D2 từ M7-10 và M7-20; D3 từ M7-30 và M7-32; D4; hai bản méo ở M7-30.
