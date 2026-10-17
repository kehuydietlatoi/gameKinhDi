# Màn 8 – Bình minh không đến

Sinh lộ: đây là giấc mơ của bé Na. Ở đây, thứ gì có trên tường thì có thật, và trên tường chỉ có một ông mặt trời đang lặn. Phải mượn được cây bút sáp vàng của Na mà không làm Na khóc, rồi vẽ ông mặt trời mọc lên bức tường phía đông, tức bức tường có cửa sổ bếp.

## Tổng quan

- **Bối cảnh:** đêm 28 tháng Bảy âm lịch. Người chơi ngủ thiếp đi trong căn hộ 304 và tỉnh dậy ở phòng 404, nhưng là phòng 404 năm 1986, trước vụ cháy, khi gia đình bé Na còn sống ở đó. Bốn bức tường kín tranh bút sáp của Na.
- **Trạng thái đầu:** `sanity` 5, `actions_left` 3, `role` none, `time` "23:59" (đứng yên đến cuối màn).
- **Mục tiêu dạy:** giải pháp nằm trong quy luật riêng của thế giới; xoá bỏ mối đe doạ không phải lúc nào cũng là cách; đối xử tử tế cũng là một lựa chọn sống còn.
- **`on_sanity_zero`:** không cần; mức mất tối đa là 4.
- **`solution` cấp màn:** `[k2, k4]`.

### Huyết tự (nguyên văn)

| Dòng | Nội dung | `violable` |
| --- | --- | --- |
| L1 | Sống sót đến khi mặt trời mọc. | false |
| L2 | Ở đây, mặt trời chỉ mọc ở phía đông. | false |
| L3 | Không được làm Na khóc. | true |
| L4 | Thứ gì có trên tường thì có thật. | false |

### Sinh lộ

Đồng hồ đứng ở 23:59 vì trên tường chỉ có một ông mặt trời đang lặn: bức tranh "buổi chiều" trên tường cửa ra vào. Theo L4, vẽ một ông mặt trời mọc thì mặt trời sẽ mọc; theo L2, phải vẽ ở phía đông. Vở tập vẽ của Na cho biết mặt trời lên ở cửa sổ bếp.

Con ma đen cũng có thật vì nó ở trên tường, nhưng đó là con ma Na vẽ để canh cho mình ngủ. Xoá nó, vẽ đè lên nó hay giật bút của Na đều làm Na khóc (L3). Hộp bút của Na đã hết màu; chỉ Na có cây bút vàng, và phải xin cho tử tế.

### Từ khoá đánh dấu

| id | Dòng | Cụm từ | Đúng |
| --- | --- | --- | --- |
| k1 | L1 | đến khi mặt trời mọc | không |
| k2 | L2 | phía đông | có |
| k3 | L3 | làm Na khóc | có |
| k4 | L4 | có trên tường thì có thật | có |
| k5 | L1 | Sống sót | không |
| k6 | L2 | Ở đây | không |

### Bóp méo (khi `sanity` ≤ 2)

| Dòng | Trừ khi đã đánh dấu | Bản méo hiển thị |
| --- | --- | --- |
| L2 | k2 | Ở đây, mặt trời chỉ mọc ở phía tây. |
| L4 | k4 | Thứ gì có trên tường thì phải xoá đi. |

## Yêu cầu với engine

1. **Hiệu ứng có điều kiện.** Một hiệu ứng của node có thể kèm `if`, ví dụ `{sanity: -1, if: {not_flag: long_sat}}` ở M8-30. Điều kiện được xét sau khi các hiệu ứng không điều kiện của cùng node đã áp dụng. Ghi vào `docs/spec-changes.md`.

Giờ trong game giữ nguyên "23:59" cho đến M8-31; màn này không dùng `time_add`.

## Nhân vật

| id | Tên | Mô tả | Ghi chú |
| --- | --- | --- | --- |
| `be_na` | Bé Na | 7 tuổi, buộc tóc hai bên, nắm chặt một cây bút sáp vàng | Cùng `id` với màn 1; trong giấc mơ, Na chưa chết và không đáng sợ |
| `con_ma_den` | Con ma đen | Hình vẽ sáp đen khổng lồ trên tường đầu giường | Không nói; chỉ xuất hiện qua `env` và `sound` |

## Manh mối

Ở hub M8-03, người chơi có 3 lượt trong 5 hành động.

| id | Hành động | Node | Phát hiện | Tỉnh táo |
| --- | --- | --- | --- | --- |
| c1 | Xem vở tập vẽ trên bàn học | M8-04 | "Sáng nào ông mặt trời cũng lên ở cửa sổ bếp nhà em." | 0 |
| c2 | Nhìn tranh trên tường cửa ra vào | M8-05 | Ông mặt trời đỏ đang lặn sau dãy nhà, chữ sáp "chiều"; đồng hồ trên tường ấy đứng ở 23:59 | 0 |
| c3 | Nhìn tranh con ma đen | M8-06 | Mỗi lần nhìn lại, nó gần mép tranh hơn | −1 |
| c4 | Nói chuyện với bé Na | M8-07 | Na vẽ con ma để nó canh cho mình ngủ; ai lấy bút vàng của Na là Na khóc | 0 |
| c5 | Mở hộp bút sáp trên bàn | M8-08 | Hộp chỉ còn một mẩu bút đen | 0 |

## Cảnh và ảnh nền

Màn 8 cần 1 ảnh mới.

### Brief vẽ

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `phong_404_1986` | Phòng một gian năm 1986, nhìn vào góc giữa tường cửa sổ bếp (bên trái) và tường đầu giường (bên phải). | Tường kín tranh bút sáp nét trẻ con (sông, thuyền giấy, nhà, cây); trên tường cửa sổ bếp có một khoảng trống lớn chưa vẽ; trên tường đầu giường có một hình con ma đen khổng lồ, nét sáp dày đè nhiều lớp; cửa sổ bếp tối om; bàn học nhỏ với hộp bút; đồng hồ treo tường | Người thật, chữ đọc được, mặt trời, màu đỏ máu | không |

### Gán cảnh cho node

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M8-01 | `phong_404_1986` | `flicker` | Giữ suốt màn |
| M8-31 | `phong_404_1986` | `dawn` | |
| E1 | `can_ho_304` | `dawn` | Tỉnh dậy ở nhà |
| D1, D2 | | | Mặc định nền đen |

## Kịch bản theo node

### Pha 0 – Phòng 404

#### M8-01 · Tỉnh dậy

- Hiệu ứng: time "23:59".
- `narration` Bạn nằm xuống giường ở căn hộ 304 và nhắm mắt.
- `narration` Khi mở mắt ra, bạn đang ngồi trên sàn một căn phòng lạ.
- `env · nhìn` Bốn bức tường kín tranh bút sáp nét trẻ con: dòng sông, thuyền giấy, những ngôi nhà.
- `env · nhìn` Trên tường đầu giường, một con ma đen to tướng vẽ bằng sáp.
- `env · ngửi` Mùi sáp màu và cơm nguội.
- `sound · trên tường · 1` Tích… — đồng hồ kêu một tiếng, nhưng kim không nhích.
- `npc · be_na` Anh 304 sang chơi à?
- Tiếp: M8-02

#### M8-02 · Huyết tự

- `env · nhìn` Chữ đỏ rỉ ra trên tường cạnh bàn học, chảy lem vào một bức tranh.
- `bloodtext` L1–L4.
- `highlight: true`: mở giao diện đánh dấu (k1–k6) sau khi các dòng hiện hết, cho phép bỏ qua.
- `npc · be_na` Ai viết bậy lên tường nhà em thế?
- `system` Bạn có 3 lượt hành động.
- Tiếp: M8-03

#### M8-03 · Hub phòng 404

`hub: true`, `hub_done: {actions_left_lte: 0}`, `hub_exit: M8-10`. Mỗi lựa chọn dùng một lần, tốn 1 lượt (`actions_left −1`), xong quay về M8-03.

1. Xem vở tập vẽ trên bàn học → M8-04
2. Nhìn tranh trên tường cửa ra vào → M8-05
3. Nhìn tranh con ma đen → M8-06
4. Nói chuyện với bé Na → M8-07
5. Mở hộp bút sáp trên bàn → M8-08

#### M8-04 · Vở tập vẽ

- `env · nhìn` Cuốn vở bìa xanh, trang nào cũng có tranh.
- `env · nhìn` Trang cuối, chữ viết nắn nót bằng bút chì: "Sáng nào ông mặt trời cũng lên ở cửa sổ bếp nhà em."
- Hiệu ứng: clue c1.
- Tiếp: M8-03

#### M8-05 · Buổi chiều

- `env · nhìn` Trên tường cửa ra vào, một ông mặt trời đỏ đang lặn xuống sau dãy nhà. Bên dưới có chữ sáp: "chiều".
- `env · nhìn` Chiếc đồng hồ treo ngay trên bức tranh, kim chỉ 23:59.
- Hiệu ứng: clue c2.
- Tiếp: M8-03

#### M8-06 · Con ma đen

- `env · nhìn` Con ma đen cao gần chạm trần, nét sáp đè lên nhau dày cộp.
- `env · nhìn` Bạn quay đi rồi nhìn lại. Nó đã đứng gần mép tranh hơn.
- `sound · tường đầu giường · 1` Sột… — tiếng sáp cọ lên vôi.
- Hiệu ứng: clue c3, sanity −1.
- Tiếp: M8-03

#### M8-07 · Bé Na

- `env · nhìn` Bé Na ngồi bó gối dưới chân tường, tay nắm chặt một cây bút sáp vàng.
- `npc · be_na` Em vẽ con ma để nó đứng canh cho em ngủ. Nhưng nó không chịu đứng yên.
- `npc · be_na` Bút vàng là bút của em. Ai lấy là em khóc đấy.
- Hiệu ứng: clue c4.
- Tiếp: M8-03

#### M8-08 · Hộp bút

- `env · nhìn` Hộp bút sáp mười hai màu, chỉ còn một mẩu bút đen ngắn ngủn.
- Hiệu ứng: clue c5.
- Tiếp: M8-03

### Pha 1 – Con ma bước ra

#### M8-10 · Một chân bước ra

- Hiệu ứng: sanity −1.
- `env · nhìn` Con ma đen đã thò một chân ra khỏi bức tranh.
- `sound · tường đầu giường · 2` Sột… soạt… — tiếng sáp cọ lên vôi, rồi lên sàn gạch.
- `npc · be_na · thì thầm` Nó lại đi rồi.

1. Lấy giẻ xoá tranh con ma → M8-11
2. Dùng mẩu bút đen vẽ thêm song sắt nhốt con ma → M8-12
3. Hỏi Na mượn bút vàng → M8-20
4. Giật cây bút vàng trong tay Na → D1

#### M8-11 · Xoá tranh

- `env · nhìn` Bạn chà giẻ lên nét sáp đen.
- `npc · be_na · hét` Đừng! Đấy là con ma của em!
- Tiếp: D1

#### M8-12 · Song sắt

- `env · nhìn` Bạn vẽ những vạch đen thẳng đứng quanh con ma. Song sắt hiện ra thật, lạnh và cứng.
- `env · nhìn` Con ma đứng lại sau song sắt.
- `sound · tường đầu giường · 1` Rắc. — một thanh sắt cong đi.
- Hiệu ứng: flag `long_sat`.
- Tiếp: M8-20

### Pha 2 – Cây bút vàng

#### M8-20 · Mượn bút

- `npc · be_na` Anh mượn làm gì?

1. "Để vẽ ông mặt trời, cho trời sáng." → M8-21
2. "Để vẽ đè lên con ma." → M8-22
3. "Đưa đây!" → D1

#### M8-21 · Na cho mượn

- `npc · be_na` Trời sáng thì em phải đi rồi…
- `env · nhìn` Na nhìn bạn rất lâu.
- `npc · be_na` Thôi được. Nhưng anh vẽ cho đẹp nhé.
- `env · chạm` Cây bút sáp vàng ấm trong tay bạn.
- Tiếp: M8-30

#### M8-22 · Na không cho

- `npc · be_na` Không! Con ma đứng canh cho em mà!
- `env · nhìn` Mắt Na ngân ngấn nước.

1. "Thôi, anh xin lỗi. Anh mượn để vẽ ông mặt trời." → M8-21
2. Giật lấy bút → D1

### Pha 3 – Vẽ

#### M8-30 · Chọn tường

- Hiệu ứng (nếu not_flag `long_sat`): sanity −1.
- `sound · sau lưng · 2` (nếu not_flag `long_sat`) Sột… soạt… — tiếng sáp cọ trên sàn, ngay sau lưng bạn.
- `sound · tường đầu giường · 1` (nếu flag `long_sat`) Rắc… rắc… — song sắt đang cong dần.
- `narration` Bạn đứng giữa phòng, cây bút vàng trong tay.
- Nếu sanity ≤ 2: Huyết tự L2 (chưa đánh dấu k2) và L4 (chưa đánh dấu k4) hiện bản méo.

1. Vẽ mặt trời lên tường cửa sổ bếp → M8-31
2. Vẽ mặt trời lên tường cửa ra vào, cạnh ông mặt trời đỏ → M8-32
3. Vẽ mặt trời lên tường bàn học → M8-32
4. Vẽ mặt trời đè lên con ma → D1

#### M8-32 · Mặt trời lặn

- Hiệu ứng: sanity −1.
- `env · nhìn` Ông mặt trời vàng vừa vẽ xong từ từ chìm xuống mép tranh, như mặt trời lặn.
- `sound · rất gần · 3` Sột soạt sột soạt — con ma đã ra khỏi tường.

1. Vẽ lên tường cửa sổ bếp → M8-31
2. Vẽ lại một ông mặt trời to hơn ở chỗ cũ → D2

#### M8-31 · Bình minh

- Hiệu ứng: time "05:30".
- `env · nhìn` Ông mặt trời sáp vàng trên tường cửa sổ bếp bắt đầu toả sáng.
- `env · nhìn` Ánh nắng thật tràn qua cửa sổ.
- `sound · trên tường · 2` Tích tắc tích tắc… — kim đồng hồ quay vùn vụt.
- `env · nhìn` Con ma đen đứng yên trong tranh, chỉ còn là những nét sáp.
- `npc · be_na` Sáng rồi. Em đi đây.
- `npc · be_na` Anh nhớ thắp hương cho em nhé.
- Tiếp: E1

## Kết cục

| id | Kích hoạt từ | Dòng cuối | Luật | `solution` | Hé lộ |
| --- | --- | --- | --- | --- | --- |
| E1 · Mặt trời mọc | M8-31 | `narration` Bạn tỉnh dậy trong căn hộ 304. Trên mu bàn tay còn dính một vệt sáp vàng. | — | [k2, k4] | Đêm không hết vì trên tường chỉ có mặt trời lặn. Thứ gì có trên tường thì có thật, nên vẽ mặt trời mọc ở phía đông, tức tường cửa sổ bếp, thì trời sáng. Cây bút phải được Na cho mượn. |
| D1 · Na khóc | M8-10, M8-11, M8-20, M8-22, M8-30 | `sound · khắp phòng · 3` Na khóc. Tiếng khóc to dần, và mọi bức tranh trên tường bắt đầu chảy nhoè như sáp gặp lửa. | `violates: [L3]` | [k3] | Con ma là của Na, cây bút cũng là của Na. Không được làm Na khóc. |
| D2 · Con ma tới | M8-32 | `env · chạm` Nét sáp đen lan ra khỏi tường, phủ lên chân bạn, rồi lên ngực. | `consequence_of: [L4]` | [k2] | Mặt trời chỉ mọc ở phía đông, và phía đông là tường cửa sổ bếp. Vẽ ở chỗ khác chỉ thêm một mặt trời lặn. |

## Kiểm tra nhanh

- Mức mất tối đa là 4 (c3, M8-10, M8-30 khi không có `long_sat`, M8-32).
- Bản méo ở M8-30 tới được khi đã chọn c3 và không vẽ song sắt.
- Đường sống ngắn nhất không cần manh mối nào: hỏi mượn bút, nói để vẽ mặt trời, vẽ lên tường cửa sổ bếp. Không có c1 thì người chơi phải đoán; vẽ sai một lần vẫn còn cơ hội sửa.
- Test cần có: đường sống có và không có `long_sat`; đường sống qua M8-22 rồi xin lỗi; đường sống qua M8-32 rồi sửa; D1 từ cả năm node; D2; hai bản méo ở M8-30.
