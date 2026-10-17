# Màn 3 – Hình nhân thế mạng

Sinh lộ: đưa một hình nhân giấy vào phòng 404 thay người, viết lên nó tên một người đã khuất mà không ai đang sống mang tên ấy, và để nó tự bước qua ngưỡng cửa.

## Tổng quan

- **Bối cảnh:** tối hôm sau màn 2, ở tầng 4 khu tập thể C4. Phòng 404 bỏ hoang từ vụ cháy năm 1986, cửa dán giấy niêm phong. Tầng trệt có tiệm vàng mã của bà Hoa.
- **Trạng thái đầu:** `sanity` 5, `actions_left` 3, `role` none, `time` "20:00".
- **Mục tiêu dạy:** "người" trong luật không nhất thiết là người sống; một cái tên có thể thuộc về nhiều người; lựa chọn của người chơi có thể làm người khác chết (kết cục E2).
- **`on_sanity_zero`:** không cần; mức mất tối đa là 4 nên `sanity` thấp nhất là 1.
- **`solution` cấp màn:** `[k1, k3]`.
- **Khác với bản brainstorm:** bản brainstorm cho rằng viết tên mình lên hình nhân là an toàn. Bản này đổi lại: theo L4, người mang cái tên ở trong phòng 404 sẽ chết, nên tên trên hình nhân phải là của người đã khuất.

### Huyết tự (nguyên văn)

| Dòng | Nội dung | `violable` |
| --- | --- | --- |
| L1 | Đêm nay, trước khi đồng hồ điểm mười hai tiếng, phải có một người bước vào phòng 404. | true |
| L2 | Nếu không ai bước vào, cả tòa nhà sẽ chết. | false |
| L3 | Phòng 404 chỉ nhận người có tên. | false |
| L4 | Người có tên trong phòng 404 sẽ không thấy bình minh. | false |

### Sinh lộ

L1 nói "một người", không nói "người sống"; hình nhân giấy cũng là một "người". L3 đòi hình nhân phải có tên. L4 nói ai mang cái tên ở trong phòng sẽ không thấy bình minh, nên cái tên đó phải thuộc về người đã chết và không trùng với ai còn sống. Trong sáu tên trên bàn thờ chung, "Lâm" trùng tên thật của thằng Bin.

Người chơi cũng không được tự ôm hình nhân bước vào: khi đó chính người chơi, một người có tên, cũng ở trong phòng 404.

### Từ khoá đánh dấu

| id | Dòng | Cụm từ | Đúng |
| --- | --- | --- | --- |
| k1 | L1 | một người | có |
| k2 | L1 | mười hai tiếng | không |
| k3 | L3 | chỉ nhận người có tên | có |
| k4 | L4 | Người có tên trong phòng 404 | có |
| k5 | L4 | sẽ không thấy bình minh | không |
| k6 | L2 | cả tòa nhà sẽ chết | không |

### Bóp méo (khi `sanity` ≤ 2)

| Dòng | Trừ khi đã đánh dấu | Bản méo hiển thị |
| --- | --- | --- |
| L1 | k1 | Đêm nay, trước khi đồng hồ điểm mười hai tiếng, phải có một người sống bước vào phòng 404. |
| L3 | k3 | Phòng 404 chỉ nhận người còn sống. |

## Yêu cầu với engine

Ngoài các yêu cầu đã nêu ở màn 2, màn 3 cần thêm. Ghi vào `docs/spec-changes.md` theo AGENTS.md mục 12.

1. **Điều kiện `has_dossier`**: đúng khi người chơi đã mở khoá hồ sơ có `id` tương ứng ở màn trước (dùng ở M3-12).
2. **Một màn có nhiều kết cục sống** (E1 và E2). Màn hình hoàn thành màn ghi rõ người chơi đạt kết cục nào.
3. **Kết cục sống cũng có thể có `consequence_of`** (E2).
4. **NPC chỉ được nhắc tên, không xuất hiện:** sáu người đã khuất chỉ cần khai báo để `npc` ở M3-33 tham chiếu được. Dùng lại `id` của màn 1: `bac_tam`, `be_na`.
5. **Nhiều lựa chọn cùng chữ, điều kiện loại trừ nhau** (M3-31, M3-33, M3-40): tại mỗi thời điểm đúng một lựa chọn hiển thị. Validator nên cảnh báo khi một node có hai lựa chọn cùng chữ cùng hiển thị được.

## Nhân vật

Những người còn sống sau màn 2, cùng bà Hoa ở tầng trệt. Không ai trong họ là quỷ.

| id | Tên | Ngoại hình | Vai trò | Ghi chú |
| --- | --- | --- | --- | --- |
| `ba_sau` | Bà Sáu | ~75 tuổi, phòng 305, giữ sổ hộ khẩu tập thể | Chủ trì cuộc họp | |
| `ong_quy` | Ông Quý | ~70 tuổi, phòng 403, hút thuốc lào bằng điếu cày | Tình nguyện vào phòng 404 | Kể chuyện năm 1986 |
| `co_lien` | Cô Liên | ~45 tuổi, phòng 402, giáo viên | Tổ chức bốc thăm | |
| `thang_bin` | Thằng Bin | 10 tuổi, phòng 401 | Im lặng | Tên thật là Nguyễn Văn Lâm |
| `ba_hoa` | Bà Hoa | ~60 tuổi, chủ tiệm vàng mã tầng trệt | Đưa hình nhân, khuyên viết tên người cần được thế | Nói đúng phong tục, nhưng phong tục ấy dẫn tới chết |
| `bac_tam` | Bác Tâm | Đã khuất (màn 1) | Chỉ có một câu ở M3-33 | |
| `be_na` | Bé Na | Đã khuất (màn 1) | Chỉ có một câu ở M3-33 | |

Sáu người đã khuất trong vụ cháy năm 1986: Tâm, Hằng, Khải, Na, Dung, Lâm.

## Manh mối

Ở hub M3-10, người chơi có 3 lượt trong 6 hành động. Kết cục E1 cần ít nhất c6 (có hình nhân) và c1 (biết tên người đã khuất). Tránh được bẫy tên "Lâm" cần thêm c2 hoặc c4, hoặc may mắn.

| id | Hành động | Node | Phát hiện | Tỉnh táo |
| --- | --- | --- | --- | --- |
| c1 | Xem bàn thờ chung ở chiếu nghỉ | M3-12 | Sáu bài vị: Tâm, Hằng, Khải, Na, Dung, Lâm | 0 |
| c2 | Mượn sổ hộ khẩu tập thể của bà Sáu | M3-13 | Danh sách người đang sống ở tầng 3–4, có "Nguyễn Văn Lâm (Bin), 10 tuổi" | 0 |
| c3 | Nhìn qua khe cửa 404 | M3-14 | Tối om, mùi khói cũ, tiếng giấy sột soạt bên trong | −1 |
| c4 | Nói chuyện với thằng Bin | M3-15 | Tên thật của Bin là Lâm, đặt theo tên ông ngoại mất trong vụ cháy | 0 |
| c5 | Nói chuyện với ông Quý | M3-16 | Năm 1986 người ta viết tên người sống lên hình nhân; sáng ra đúng người ấy chết | −1 |
| c6 | Xuống tiệm vàng mã bà Hoa | M3-11 | Nhận một hình nhân giấy và bút lông (bật cờ `co_hinh_nhan`) | 0 |

## Cảnh và ảnh nền

Màn 3 cần 3 ảnh mới và dùng lại `can_ho_304`.

### Brief vẽ

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `hanh_lang_tang_4` | Nhìn dọc hành lang tầng 4 về phía cuối. Vật liệu giống `hanh_lang_tang_2` (cửa gỗ sơn xanh, bếp than tổ ong trước cửa). | Cánh cửa cuối hành lang dán chéo hai dải giấy niêm phong ố vàng; khung cửa ấy ám khói đen; số "404" sơn trắng trên cửa; một bóng đèn vàng giữa hành lang | Người; chữ đọc được trên giấy niêm phong | không |
| `tiem_vang_ma` | Bên trong một tiệm vàng mã nhỏ, nhìn từ cửa vào. | Nhà giấy, ngựa giấy, quần áo giấy treo kín trần; ba hình nhân giấy cao ngang ngực dựng sát tường, mặt là một vòng tròn trắng | Người; mắt, mũi, miệng trên mặt hình nhân | không |
| `ban_tho_chieu_nghi` | Chiếu nghỉ cầu thang bê tông, nhìn ngang. | Bàn thờ nhỏ kê sát tường; bát hương đầy chân nhang; sáu bài vị gỗ xếp thành một hàng; một tấm biển nhỏ phía trên | Người; chữ đọc được trên bài vị và tấm biển | c1 |

### Gán cảnh cho node

Node không có trong bảng thì giữ cảnh trước đó.

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M3-01 | `can_ho_304` | `normal` | |
| M3-03 | `hanh_lang_tang_4` | `flicker` | |
| M3-10 | `hanh_lang_tang_4` | `flicker` | Đặt lại mỗi lần về hub |
| M3-11 | `tiem_vang_ma` | `normal` | |
| M3-12 | `ban_tho_chieu_nghi` | `normal` | Node thêm clue c1 |
| M3-14 | `hanh_lang_tang_4` | `dark` | Ghé mắt vào khe cửa |
| M3-20 | `hanh_lang_tang_4` | `flicker` | Giữ cho M3-21 đến M3-33 |
| M3-21 | giữ nguyên | `dark` | Bên trong phòng 404 |
| M3-40 | `hanh_lang_tang_4` | `dawn` | |
| E1, E2 | `hanh_lang_tang_4` | `dawn` | |
| D1–D4 | | | Mặc định nền đen |

## Kịch bản theo node

### Pha 0 – Họp tầng 4

#### M3-01 · Tối hôm sau

- Hiệu ứng: time "20:00".
- `narration` Tối hôm sau. Khu tập thể vừa đưa tang ba người: anh Phong, chị Mai, chú Tư.
- `env · nhìn` Căn hộ 304. Bóng đèn sợi đốt vàng vọt.
- `sound · tầng trệt · 1` Lạch xạch… — tiếng cửa xếp của tiệm vàng mã bà Hoa kéo lên.
- `sound · bức tường cạnh cửa · 2` Sột… soạt…
- Tiếp: M3-02

#### M3-02 · Huyết tự

- `env · nhìn` Chữ đỏ lại rỉ ra từ bức tường cạnh cửa.
- `bloodtext` L1–L4.
- `highlight: true`: mở giao diện đánh dấu (k1–k6) sau khi các dòng hiện hết, cho phép bỏ qua.
- `sound · hành lang · 2` Cộc cộc cộc. — có người gõ cửa từng nhà.
- `npc · ba_sau` Cậu 304! Lên tầng 4 họp ngay. Nhà nào cũng có chữ máu cả rồi.
- Tiếp: M3-03

#### M3-03 · Trước cửa 404

- `env · nhìn` Hành lang tầng 4. Cuối hành lang là cánh cửa 404, dán chéo hai dải giấy niêm phong đã ố vàng.
- `npc · ba_sau` Chữ viết rồi. Đêm nay phải có một người vào trong đó.
- `npc · co_lien` Không ai bị ép cả. Nếu không ai tự nguyện thì bốc thăm.
- `sound · bên cạnh · 1` Khụ… khụ…
- `npc · ong_quy` Tôi già rồi. Để tôi vào.
- `env · nhìn` Thằng Bin đứng nép sau lưng bà Sáu, không nói gì.
- `npc · ba_sau` Còn gần bốn tiếng nữa mới đến mười hai giờ. Ai cần làm gì thì làm đi, rồi quay lại đây.
- `system` Bạn có 3 lượt hành động trước khi quyết định.
- Tiếp: M3-10

### Pha 1 – Chuẩn bị

#### M3-10 · Hub tầng 4

`hub: true`, `hub_done: {actions_left_lte: 0}`, `hub_exit: M3-20`. Mỗi lựa chọn dùng một lần, tốn 1 lượt (`actions_left −1`) và cộng 1 giờ (`time_add: 60`), xong quay về M3-10.

1. Xuống tiệm vàng mã bà Hoa → M3-11
2. Xem bàn thờ chung ở chiếu nghỉ → M3-12
3. Mượn sổ hộ khẩu tập thể của bà Sáu → M3-13
4. Nhìn qua khe cửa 404 → M3-14
5. Nói chuyện với thằng Bin → M3-15
6. Nói chuyện với ông Quý → M3-16

#### M3-11 · Tiệm vàng mã

- `env · nhìn` Tiệm chật kín đồ mã: nhà giấy, ngựa giấy, quần áo giấy treo kín trần. Mấy hình nhân giấy cao ngang ngực dựng sát tường, mặt chỉ là một vòng tròn trắng.
- `env · ngửi` Mùi hồ dán và giấy mới.
- `npc · ba_hoa` Lấy một con đi cháu. Hình nhân thế mạng, ngày xưa người ta vẫn làm thế.
- `npc · ba_hoa` Nhưng không có tên thì nó chẳng đi đâu được. Muốn nó thế cho ai thì viết tên người ấy lên ngực nó.
- `env · nhìn` Bà Hoa đưa bạn một hình nhân giấy và một cây bút lông.
- Hiệu ứng: clue c6, flag `co_hinh_nhan`.
- Tiếp: M3-10

#### M3-12 · Bàn thờ chung

- `env · nhìn` Ở chiếu nghỉ giữa tầng 3 và tầng 4 có một bàn thờ nhỏ, bát hương đầy chân nhang.
- `env · nhìn` Sáu bài vị gỗ xếp thành hàng: Tâm, Hằng, Khải, Na, Dung, Lâm.
- `env · nhìn` Tấm biển nhỏ phía trên: "Vong linh vụ cháy nhà C4, rằm tháng Bảy năm Bính Dần."
- `narration` (nếu has_dossier `hs_chay_c4_1986`) Những cái tên này bạn đã từng gặp. Trên một tờ cáo phó.
- `sound · bát hương · 1` Tách. — một chân nhang gãy rơi xuống.
- Hiệu ứng: clue c1.
- Tiếp: M3-10

#### M3-13 · Sổ hộ khẩu tập thể

- `env · nhìn` Bà Sáu đưa bạn cuốn sổ bìa xanh, gáy sờn.
- `env · nhìn` Danh sách người đang ở tầng 3 và tầng 4: Trần Thị Sáu. Lê Văn Quý. Phạm Thị Liên. Nguyễn Văn Lâm (Bin), 10 tuổi. Và tên bạn.
- `npc · ba_sau` Sổ mới ghi lại hôm qua đấy.
- Hiệu ứng: clue c2.
- Tiếp: M3-10

#### M3-14 · Khe cửa 404

- `env · nhìn` Bạn ghé mắt vào khe hở giữa hai dải niêm phong. Bên trong tối om.
- `env · ngửi` Mùi khói cũ, như than củi tắt đã lâu.
- `sound · sau cửa 404 · 1` Sột… soạt… sột… — tiếng giấy cọ trên nền xi măng, như có ai mặc áo giấy đi qua đi lại.
- Hiệu ứng: clue c3, sanity −1.
- Tiếp: M3-10

#### M3-15 · Thằng Bin

- `env · nhìn` Thằng Bin ngồi bó gối trên bậc cầu thang, tay mân mê một chiếc khăn tang.
- `npc · thang_bin · thì thầm` Mẹ cháu bảo Bin là tên ở nhà. Tên thật cháu là Lâm, đặt theo tên ông ngoại.
- `npc · thang_bin · thì thầm` Ông ngoại cháu mất trong vụ cháy hồi trước.
- Hiệu ứng: clue c4.
- Tiếp: M3-10

#### M3-16 · Ông Quý

- `sound · bên cạnh · 1` Sòng sọc… — ông Quý rít một hơi điếu cày.
- `npc · ong_quy` Năm tám sáu cũng có chữ máu thế này. Người ta mua hình nhân, viết tên người sống lên cho nó đi thế.
- `npc · ong_quy` Sáng hôm sau, đúng người có tên ấy nằm chết trên giường.
- Hiệu ứng: clue c5, sanity −1.
- Tiếp: M3-10

### Pha 2 – Quyết định

#### M3-20 · Mười một giờ rưỡi

- Hiệu ứng: time "23:30", sanity −1.
- `sound · sau cửa 404 · 2` Cộc. Cộc. Cộc. — có tiếng gõ từ phía bên trong cánh cửa.
- `npc · ba_sau` Đến giờ rồi. Ai vào?
- `npc · ong_quy` Tôi đã nói rồi. Để tôi.

1. "Tôi sẽ vào." → M3-21
2. Để ông Quý vào → M3-22 · flag `chet_quy`
3. "Bốc thăm đi." → M3-23 · flag `chet_lien`
4. (nếu flag `co_hinh_nhan`) Dùng hình nhân giấy → M3-30
5. "Không ai vào cả." → M3-24

#### M3-21 · Bước vào phòng 404

- `narration` Bạn xé dải niêm phong, đẩy cửa bước vào.
- `sound · sau lưng · 2` Cạch. — cửa đóng lại.
- `env · ngửi` Mùi khói đặc quánh.
- Tiếp: D2

#### M3-22 · Ông Quý

- `npc · ong_quy` Ở lại mạnh khoẻ nhé.
- `sound · cửa 404 · 2` Kẹttt… cạch.
- `narration` Hành lang im lặng đến sáng.
- Tiếp: M3-40

#### M3-23 · Bốc thăm

- `env · nhìn` Cô Liên bẻ năm que tăm, một que ngắn hơn, nắm kín trong tay.
- `env · nhìn` Từng người rút. Que của bạn dài. Que cuối cùng còn lại trong tay cô Liên là que ngắn.
- `npc · co_lien` Thế là tôi.
- `sound · cửa 404 · 2` Kẹttt… cạch.
- Tiếp: M3-40

#### M3-24 · Không ai vào

- `sound · nhà ai đó · 2` Boong… — tiếng thứ nhất của mười hai tiếng chuông.
- `npc · ba_sau · thì thầm` Trời ơi…
- Tiếp: D1

#### M3-30 · Viết tên

- `env · nhìn` Bạn dựng hình nhân giấy trước cửa 404. Cái mặt tròn trắng hướng về phía cánh cửa.
- `npc · ba_sau` Cậu định cho nó thế ai?
- `system` Chọn tên viết lên ngực hình nhân.

1. Tên của bạn → M3-31 · flag `ten_minh`
2. "Quý" → M3-31 · flag `chet_quy`
3. (nếu clue c1) "Tâm" → M3-31 · flag `ten_dung`, flag `ten_tam`
4. (nếu clue c1) "Na" → M3-31 · flag `ten_dung`, flag `ten_na`
5. (nếu clue c1) "Lâm" → M3-31 · flag `chet_bin`
6. Không viết gì → M3-31 · flag `khong_ten`

#### M3-31 · Đưa vào

- `env · nhìn` (nếu not_flag `khong_ten`) Nét mực đen còn ướt trên ngực hình nhân.
- `env · nhìn` (nếu flag `khong_ten`) Ngực hình nhân vẫn trắng trơn.

1. Ôm hình nhân bước vào phòng → M3-21
2. (nếu flag `khong_ten`) Đặt hình nhân ở ngưỡng cửa rồi buông tay → M3-32
3. (nếu not_flag `khong_ten`) Đặt hình nhân ở ngưỡng cửa rồi buông tay → M3-33

#### M3-32 · Hình nhân đứng yên

- `env · nhìn` Hình nhân đứng im ở ngưỡng cửa. Không nhích lên được một phân.
- `sound · sau cửa 404 · 2` Cộc. Cộc. Cộc.
- `sound · nhà ai đó · 2` Boong… — tiếng thứ nhất của mười hai tiếng chuông.
- Tiếp: D4

#### M3-33 · Hình nhân bước vào

- Hiệu ứng: sanity −1.
- `sound · ngưỡng cửa · 2` Sột… soạt… — tiếng giấy cọ nền xi măng. Hình nhân tự bước vào trong.
- `sound · cửa 404 · 2` Cạch. — cánh cửa tự khép.
- `npc · bac_tam · thì thầm` (nếu flag `ten_tam`) Cảm ơn cháu.
- `npc · be_na · thì thầm` (nếu flag `ten_na`) Em cảm ơn anh.

1. (nếu not_flag `ten_minh`) Chờ đến sáng → M3-40
2. (nếu flag `ten_minh`) Chờ đến sáng → D3

### Pha 3 – Bình minh

#### M3-40 · Bình minh

- Hiệu ứng: time "05:30".
- `env · nhìn` Trời hửng sáng. Hành lang tầng 4 ngả màu xám nhạt.
- `npc · thang_bin` (nếu flag `ten_dung`) Anh ơi, sáng rồi. Mọi người vẫn đủ cả.
- `env · nhìn` (nếu flag `chet_quy`) Cửa phòng 403 khép hờ. Điếu cày của ông Quý nằm lăn lóc trước cửa 404.
- `env · nhìn` (nếu flag `chet_lien`) Trước cửa 404 có một đôi dép nhựa của cô Liên, xếp ngay ngắn.
- `env · nhìn` (nếu flag `chet_bin`) Bà Sáu ngồi bệt trước cửa phòng 401, khóc không thành tiếng.

1. (nếu flag `ten_dung`) Tiếp → E1
2. (nếu not_flag `ten_dung`) Tiếp → E2

## Kết cục

Hai kết cục sống và bốn kết cục chết.

| id | Kích hoạt từ | Dòng cuối | Luật | `solution` | Hé lộ |
| --- | --- | --- | --- | --- | --- |
| E1 · Không ai chết | M3-40 | `env · nhìn` Trên ngưỡng cửa 404 còn sót một mẩu giấy trắng, dính một vệt mực đen. | — | [k1, k3, k4] | "Một người" không nhất thiết là người sống. Hình nhân mang tên một người đã khuất, không ai đang sống trùng tên, và tự bước vào. |
| E2 · Có người chết thay | M3-40 | `narration` Tòa nhà vẫn đứng nguyên. Chỉ thiếu đi một người. | `consequence_of: [L4]` | [k1, k4] | Bạn sống, nhưng có người chết thay. L1 không đòi một người sống; L4 giết bất cứ ai mang cái tên ở trong phòng. |
| D1 · Không ai vào | M3-24 | `sound · khắp tòa nhà · 3` Boong… — tiếng chuông thứ mười hai. Rồi tiếng lửa reo từ tầng trệt. | `violates: [L1]`, `consequence_of: [L2]` | [L1] | Không ai bước vào phòng 404 trước khi đồng hồ điểm mười hai tiếng. |
| D2 · Tự bước vào | M3-21 | `env · chạm` Trong bóng tối, những bàn tay giấy khô xào xạc chạm vào mặt bạn. | `consequence_of: [L4]` | [k4] | Bạn là người có tên, và bạn đang ở trong phòng 404. |
| D3 · Tên của mình | M3-33 | `sound · sau cửa 404 · 2` Từ trong phòng, có tiếng ai đó gọi tên bạn, bằng chính giọng của bạn. | `consequence_of: [L4]` | [k4] | Tên bạn đang ở trong phòng 404. Hình nhân không thế mạng cho người mang tên; nó dẫn L4 tới đúng người đó. |
| D4 · Hình nhân không tên | M3-32 | `sound · khắp tòa nhà · 3` Boong… — tiếng chuông thứ mười hai. Rồi tiếng lửa reo từ tầng trệt. | `violates: [L1]`, `consequence_of: [L2]` | [k3] | Phòng 404 chỉ nhận người có tên. Hình nhân không tên không bước vào được, nên đêm nay không có ai vào. |

## Kiểm tra nhanh

- Đường E1 ngắn nhất: c6 + c1 + một hành động bất kỳ → M3-20 → dùng hình nhân → "Tâm" hoặc "Na" → đặt ở ngưỡng cửa → M3-40 → E1.
- E2 tới được theo bốn cách: để ông Quý vào; bốc thăm; viết "Quý"; viết "Lâm" (thằng Bin chết). Mỗi cách bật đúng một cờ `chet_*`.
- Mức mất tối đa là 4 (c3, c5, M3-20, M3-33), nên `sanity` không về 0. Bản méo L1 và L3 xuất hiện ở M3-20 nếu người chơi đã chọn cả c3 lẫn c5 và chưa đánh dấu k1 hoặc k3.
- Test cần có: E1 với "Tâm" và với "Na"; E2 với từng cờ `chet_quy`, `chet_lien`, `chet_bin`; D1; D2 từ M3-20 và từ M3-31; D3; D4; bản méo L1 và L3.
