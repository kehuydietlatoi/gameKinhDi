# Màn 6 – Cầu nối

Sinh lộ: thứ trên cầu đi theo từ phía nhà C4. Đi tiến sang C5 là quay lưng về phía nó; quay lại nhìn khi đã ở trên cầu là vi phạm luật. Cách duy nhất: quay mặt về phía C4 *trước khi* bước lên cầu, rồi đi lùi suốt quãng cầu, không dừng.

## Tổng quan

- **Bối cảnh:** đêm 24 tháng Bảy âm lịch. Bà Sáu sốt cao, điện thoại trong khu bị cắt, cửa sắt tầng trệt đã khoá từ mười giờ. Bác sĩ Thanh ở phòng 312 nhà C5. Lối duy nhất sang C5 là cầu nối tầng 3 giữa hai nhà.
- **Trạng thái đầu:** `sanity` 5, `actions_left` 2, `role` none, `time` "23:00".
- **Mục tiêu dạy:** đọc phạm vi của luật ("trên cầu nối"); làm đúng điều luật cấm theo nghĩa đen; chịu cái giá của sinh lộ (phải nhìn thẳng vào nó).
- **`on_sanity_zero`:** không cần; mức mất tối đa là 3.
- **`solution` cấp màn:** `[k1, k3]`.

### Huyết tự (nguyên văn)

| Dòng | Nội dung | `violable` |
| --- | --- | --- |
| L1 | Đêm nay, phải sang được nhà C5 trước khi gà gáy. | true |
| L2 | Trên cầu nối, không được quay đầu lại. | true |
| L3 | Trên cầu nối, không được dừng bước. | true |
| L4 | Thứ ở trên cầu sẽ bắt kẻ nào quay lưng về phía nó. | false |

### Sinh lộ

"Nó" xuất hiện từ phía nhà C4 và đi theo người chơi. Đi tiến sang C5 thì lưng quay về phía nó, nên bị bắt (L4). Đang trên cầu mà quay lại nhìn thì vi phạm L2. Đứng lại thì vi phạm L3. L2 và L3 chỉ áp dụng "trên cầu nối", nên người chơi được quay người ở đầu cầu phía C4, rồi bước lùi lên cầu và lùi đến tận cửa C5.

### Từ khoá đánh dấu

| id | Dòng | Cụm từ | Đúng |
| --- | --- | --- | --- |
| k1 | L2 | Trên cầu nối | có |
| k2 | L2 | không được quay đầu lại | không |
| k3 | L4 | quay lưng về phía nó | có |
| k4 | L3 | không được dừng bước | có |
| k5 | L1 | trước khi gà gáy | không |
| k6 | L1 | nhà C5 | không |

### Bóp méo (khi `sanity` ≤ 2)

| Dòng | Trừ khi đã đánh dấu | Bản méo hiển thị |
| --- | --- | --- |
| L4 | k3 | Thứ ở trên cầu sẽ bắt kẻ nào nhìn thẳng vào nó. |
| L3 | k4 | Trên cầu nối, khi bị gọi tên thì phải dừng bước. |

## Yêu cầu với engine

Không cần bổ sung.

## Nhân vật

| id | Tên hiển thị | Mô tả | Thật sự là |
| --- | --- | --- | --- |
| `ba_sau` | Bà Sáu | Sốt cao, nằm ở phòng 305 | Người thật |
| `bac_si_thanh` | Bác sĩ Thanh | Ở phòng 312 nhà C5 | Người thật |
| `ke_tren_cau` | Một giọng quen | Người đàn ông trẻ ướt sũng, áo sơ mi trắng cháy sém một bên; mượn mặt và giọng người quen | Vong của người chạy qua cầu năm 1986 |

## Manh mối

Ở hub M6-03, người chơi có 2 lượt trong 4 hành động.

| id | Hành động | Node | Phát hiện | Tỉnh táo |
| --- | --- | --- | --- | --- |
| c1 | Hỏi bà Sáu chuyện cây cầu | M6-04 | Năm 1986 có người chạy qua cầu đi gọi cứu hoả, ngoái lại nhìn nhà cháy rồi ngã; từ đó cầu có "nó", nó đi từ phía nhà mình sang | 0 |
| c2 | Nhìn cầu nối từ đầu cầu C4 | M6-05 | Một hàng dấu chân ướt, mũi chân hướng về C5, bắt đầu từ ngay chỗ bạn đứng | −1 |
| c3 | Ra ban công nhìn sang C5 | M6-06 | Phòng 312 sáng đèn; cửa đầu cầu C5 mở sẵn; cầu dài chừng bốn mươi bước | 0 |
| c4 | Hỏi bà Sáu cách qua cầu | M6-07 | "Người xưa dặn: qua cầu đêm thì đừng để lưng cho nó." | 0 |

## Cảnh và ảnh nền

Màn 6 cần 2 ảnh mới. Phòng 305 dùng lại `can_ho_304` (hai căn cùng kiểu).

### Brief vẽ

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `cau_noi_c4_c5` | Đứng ở đầu cầu phía C4 nhìn sang nhà C5, ban đêm. | Mặt cầu bê tông hẹp, ướt loang loáng; lan can sắt hai bên, nguyên vẹn; cửa đầu cầu C5 hắt ánh vàng; mảng trời xanh đêm; một mảng tường nhà C5 với vài ô cửa sổ, chỉ một ô sáng | Người, bóng người, dấu chân, lan can gãy | không |
| `cau_noi_nhin_ve_c4` | Đứng trên cầu nối, quay mặt về phía nhà C4, ban đêm. Cùng vật liệu với `cau_noi_c4_c5`. Dùng cho M6-30 đến M6-33. | Mặt cầu bê tông hẹp, ướt loang loáng, chạy về phía C4; lan can sắt hai bên, nguyên vẹn; cửa sắt đầu cầu C4 mở; sau cửa là hành lang C4, nửa sau chìm hẳn vào bóng tối (chỗ "nó" đứng); mảng trời xanh đêm phía trên | Người, bóng người kể cả trong vùng tối, dấu chân, lan can gãy, vệt sáng vàng của cửa C5 | không |

### Gán cảnh cho node

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M6-01 | `can_ho_304` | `normal` | Phòng 305 |
| M6-05 | `cau_noi_c4_c5` | `normal` | |
| M6-06 | `cau_noi_c4_c5` | `normal` | |
| M6-07 | `can_ho_304` | `normal` | |
| M6-10 | `cau_noi_c4_c5` | `flicker` | Giữ cho M6-20, M6-21 (đi tiến) |
| M6-30 | `cau_noi_nhin_ve_c4` | `flicker` | Đi lùi, mặt hướng về C4; giữ đến M6-33 |
| M6-11 | `can_ho_304` | `dark` | |
| E1 | `cau_noi_c4_c5` | `normal` | |
| D1–D4 | | | Mặc định nền đen |

Lưu ý: hub M6-03 không khai báo `scene`, nên sau M6-05 hoặc M6-06 cảnh vẫn là cây cầu. Ở M6-03 nên khai báo lại `scene: {bg: can_ho_304, light: normal}`.

## Kịch bản theo node

### Pha 0 – Bà Sáu ốm

#### M6-01 · Phòng 305

- Hiệu ứng: time "23:00".
- `env · nhìn` Bà Sáu nằm co trên giường, trán đắp khăn ướt.
- `env · chạm` Tay bà nóng như than.
- `npc · ba_sau` Cậu sang C5 gọi giúp bà cô Thanh… Cửa dưới khoá rồi. Đi cầu nối tầng ba ấy.
- `sound · bức tường · 2` Sột… soạt…
- Tiếp: M6-02

#### M6-02 · Huyết tự

- `env · nhìn` Chữ đỏ rỉ ra trên bức tường phòng bà Sáu.
- `bloodtext` L1–L4.
- `highlight: true`: mở giao diện đánh dấu (k1–k6) sau khi các dòng hiện hết, cho phép bỏ qua.
- `system` Bạn có 2 lượt hành động trước khi phải đi.
- Tiếp: M6-03

#### M6-03 · Hub phòng 305

`hub: true`, `hub_done: {actions_left_lte: 0}`, `hub_exit: M6-10`, `scene: {bg: can_ho_304, light: normal}`. Mỗi lựa chọn dùng một lần, tốn 1 lượt (`actions_left −1`), xong quay về M6-03.

1. Hỏi bà Sáu chuyện cây cầu → M6-04
2. Ra nhìn cầu nối từ đầu cầu C4 → M6-05
3. Ra ban công nhìn sang C5 → M6-06
4. Hỏi bà Sáu cách qua cầu → M6-07

#### M6-04 · Chuyện cây cầu

- `npc · ba_sau` Đêm cháy năm tám sáu, có thằng bé chạy qua cầu sang C5 gọi cứu hoả.
- `npc · ba_sau` Chạy được nửa cầu thì nó ngoái lại nhìn nhà mình đang cháy. Rồi ngã.
- `npc · ba_sau` Từ đấy cầu có nó. Nó đi từ phía nhà mình sang.
- Hiệu ứng: clue c1.
- Tiếp: M6-03

#### M6-05 · Đầu cầu

- `env · nhìn` Cầu nối hẹp, lan can sắt hai bên, mặt bê tông ướt loang loáng.
- `env · nhìn` Trên mặt cầu có một hàng dấu chân ướt. Mũi chân hướng về phía C5. Hàng dấu chân bắt đầu ngay chỗ bạn đang đứng.
- `sound · sau lưng · 1` Tách… — một giọt nước rơi trong hành lang C4.
- Hiệu ứng: clue c2, sanity −1.
- Tiếp: M6-03

#### M6-06 · Ban công

- `env · nhìn` Bên kia khoảng trống, phòng 312 nhà C5 còn sáng đèn.
- `env · nhìn` Cửa đầu cầu phía C5 mở sẵn, hắt ra một vệt sáng vàng.
- `narration` Cây cầu dài chừng bốn mươi bước.
- Hiệu ứng: clue c3.
- Tiếp: M6-03

#### M6-07 · Lời dặn

- `npc · ba_sau` Người xưa dặn: qua cầu đêm thì đừng để lưng cho nó.
- `npc · ba_sau` Mà cũng đừng ngoái lại. Ngoái lại là nó biết mặt.
- Hiệu ứng: clue c4.
- Tiếp: M6-03

### Pha 1 – Qua cầu

#### M6-10 · Đầu cầu

- Hiệu ứng: time "23:45".
- `env · nhìn` Cửa sắt đầu cầu C4 mở. Bên kia là vệt sáng vàng của cửa C5.
- `sound · hành lang C4 · 1` Tách… tách… — tiếng nước nhỏ giọt sau lưng bạn.
- `narration` Bạn đứng ở ngưỡng cầu, mặt hướng về phía C5.

1. Bước lên cầu, đi thẳng sang C5 → M6-20
2. Quay người lại nhìn về phía C4, rồi bước lùi lên cầu → M6-30
3. Không đi nữa, quay về với bà Sáu → M6-11

#### M6-11 · Ở lại

- `npc · ba_sau` Không đi à…
- `sound · đồng hồ · 1` Tích tắc… tích tắc…
- `sound · rất xa · 2` Ò… ó… o…
- Tiếp: D1

#### M6-20 · Đi tiến

- Hiệu ứng: sanity −1.
- `narration` Bạn bước lên cầu.
- `sound · sau lưng · 2` Tách. — một tiếng nước rơi, đúng nhịp bước chân bạn.
- `sound · sau lưng · 2` Tách. Tách. — mỗi bước bạn đi, phía sau lại có một bước.
- `env · chạm` Gáy bạn lạnh dần.

1. Quay đầu nhìn lại → D2
2. Đứng lại nghe ngóng → D3
3. Đi tiếp → M6-21
4. Chạy thật nhanh → M6-21

#### M6-21 · Bàn tay ướt

- `sound · sát sau lưng · 3` Tách tách tách — tiếng nước dồn dập, gần như sát gót.
- `env · chạm` Mấy ngón tay ướt đặt lên vai bạn.
- Tiếp: D4

#### M6-30 · Đi lùi

- Hiệu ứng: sanity −1.
- `narration` Bạn quay mặt về phía hành lang C4, rồi lùi một bước lên cầu.
- `env · nhìn` Ở cuối hành lang C4, một bóng người ướt sũng bước ra khỏi bóng tối.
- `sound · đầu cầu C4 · 2` Tách. — nó bước một bước, đúng lúc bạn bước.
- `system` Bạn không được dừng bước.

1. Lùi tiếp, giữ nhịp → M6-31
2. Đứng lại nhìn cho rõ → D3
3. Quay người lại, chạy cho nhanh → D2

#### M6-31 · Giữa cầu

- Hiệu ứng: sanity −1.
- `env · nhìn` Nó đã gần hơn. Tóc bết nước, áo sơ mi trắng cháy sém một bên.
- `env · nhìn` Mặt nó đổi. Giờ là mặt mẹ bạn.
- `npc · ke_tren_cau` (giọng mẹ) Con ơi, nhìn đường kìa. Sau lưng con lan can gãy đấy. Quay lại mà nhìn.
- Nếu sanity ≤ 2: Huyết tự L3 (chưa đánh dấu k4) và L4 (chưa đánh dấu k3) hiện bản méo.

1. Quay lại nhìn đường → D2
2. Dừng lại cho chắc → D3
3. Lùi tiếp, một tay lần theo lan can → M6-32

#### M6-32 · Gần tới

- `env · chạm` Lan can sắt dưới tay bạn lạnh và nguyên vẹn.
- `sound · sau lưng, phía C5 · 2` Cộp. Cộp. — tiếng guốc gỗ.
- `npc · bac_si_thanh` Ai đấy? Đứng lại cho tôi soi đèn!

1. Dừng lại, đáp lời → D3
2. Quay lại cho bà ấy thấy mặt → D2
3. Vừa lùi vừa đáp: "Cháu bên C4, bà Sáu ốm!" → M6-33

#### M6-33 · Ngưỡng cửa

- `env · chạm` Lưng bạn chạm vào khung cửa C5. Bạn lùi qua ngưỡng cửa.
- `sound · đầu cầu C5 · 1` Tách. — tiếng nước dừng lại ngay mép cầu.
- `env · nhìn` Nó đứng ở mép cầu, không bước qua được. Mặt nó trở lại là mặt một chàng trai trẻ, ướt sũng.
- `npc · bac_si_thanh` Cậu đi lùi sang đây à?
- Tiếp: E1

## Kết cục

| id | Kích hoạt từ | Dòng cuối | Luật | `solution` | Hé lộ |
| --- | --- | --- | --- | --- | --- |
| E1 · Sang được C5 | M6-33 | `env · nhìn` Trên mặt cầu có hai hàng dấu chân ướt: một hàng của bạn, lùi; một hàng của nó, tiến. Cả hai dừng ở cùng một chỗ. | — | [k1, k3] | L2 chỉ cấm quay đầu khi đã ở trên cầu. Quay mặt về phía C4 trước khi bước lên, rồi đi lùi: bạn không quay lưng về phía nó, cũng không phải quay đầu. |
| D1 · Không đi | M6-11 | `env · chạm` Bàn tay bà Sáu trong tay bạn lạnh dần. Rồi tay bạn cũng lạnh. | `violates: [L1]` | [L1] | Phải sang được C5 trước khi gà gáy. |
| D2 · Quay đầu | M6-20, M6-30, M6-31, M6-32 | `env · nhìn` Bạn quay lại. Nó ở sát mặt bạn, và nó cũng đang ngoái nhìn về phía sau. | `violates: [L2]` | [k1] | Trên cầu nối, không được quay đầu lại. Phải quay người trước khi bước lên cầu. |
| D3 · Dừng bước | M6-20, M6-30, M6-31, M6-32 | `sound · trên gáy · 2` Tách. — một giọt nước rơi lên gáy bạn. Rồi một bàn tay ướt. | `violates: [L3]` | [k4] | Trên cầu nối, không được dừng bước, kể cả khi có người gọi. |
| D4 · Quay lưng | M6-21 | `env · chạm` Mấy ngón tay ướt siết lấy vai, kéo bạn ngược về phía C4. | `consequence_of: [L4]` | [k3] | Nó đi từ phía C4. Đi tiến sang C5 là quay lưng về phía nó. |

## Kiểm tra nhanh

- Mức mất tối đa là 3 (c2, M6-30, M6-31). Bản méo ở M6-31 chỉ tới được khi đã chọn c2.
- Ở M6-32, đáp lời là được phép; L3 chỉ cấm dừng bước, L2 chỉ cấm quay đầu.
- Test cần có: đường sống; D1; D2 từ cả bốn node; D3 từ cả bốn node; D4 qua cả hai lựa chọn của M6-20; hai bản méo ở M6-31; cảnh của hub M6-03 trở lại `can_ho_304` sau M6-05.
