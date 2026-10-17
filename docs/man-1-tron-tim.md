# Màn 1 – Trốn tìm

Màn hướng dẫn. Sinh lộ: nhận làm người đi tìm, tuân thủ từng dòng Huyết tự và không bao giờ trốn cho tới khi gà gáy.

## Tổng quan

- **Bối cảnh:** phòng sinh hoạt chung tầng 1, khu tập thể C4, đêm rằm tháng Bảy âm lịch.
- **Trạng thái đầu:** `sanity` 5, `actions_left` 3, `role` none, `time` "23:59".
- **Mục tiêu dạy:** đọc kỹ luật, tuân thủ mọi dòng, làm quen cơ chế đánh dấu và Tỉnh táo.
- **`on_sanity_zero`:** không cần cho màn này; mức mất tối đa là 4 nên `sanity` thấp nhất là 1.

### Huyết tự (nguyên văn)

| Dòng | Nội dung |
| --- | --- |
| L1 | Tất cả những ai đang ở trong phòng này phải chơi trốn tìm. |
| L2 | Một người làm người đi tìm. Những người còn lại đi trốn. |
| L3 | Người đi tìm đếm đến một trăm rồi mới được mở mắt. |
| L4 | Kẻ nào bị quỷ tìm thấy sẽ chết. |
| L5 | Trò chơi kết thúc khi gà gáy. |

### Sinh lộ

L4 không nói quỷ là người đi tìm. Trong trò trốn tìm, chỉ người đi tìm là không bao giờ "bị tìm thấy", nên nhận vai đi tìm là lựa chọn an toàn bất kể quỷ là ai. Sự thật: cả sáu người còn lại đều là quỷ và đều sẽ đi tìm. Người chơi còn phải giữ L3 (không mở mắt khi đếm) và không được tự biến mình thành người trốn ở bất kỳ lúc nào.

### Từ khoá đánh dấu

| id | Dòng | Cụm từ | Đúng |
| --- | --- | --- | --- |
| k1 | L1 | Tất cả những ai đang ở trong phòng này | không |
| k2 | L2 | Một người làm người đi tìm | có |
| k3 | L3 | đếm đến một trăm rồi mới được mở mắt | có |
| k4 | L4 | bị quỷ tìm thấy | có |
| k5 | L4 | sẽ chết | không |
| k6 | L5 | khi gà gáy | không |

### Bóp méo (khi `sanity` ≤ 2)

| Dòng | Trừ khi đã đánh dấu | Bản méo hiển thị |
| --- | --- | --- |
| L3 | k3 | Người đi tìm được mở mắt khi có người gọi. |
| L4 | k4 | Kẻ nào đi tìm sẽ chết. |

## Sơ đồ luồng

&#91;embedded content: luồng màn 1 · 7 bước chính, 5 kết cục chết\]

Đường sống đi thẳng xuống cột trái; mỗi hộp đỏ bên phải là cái chết rẽ ra từ bước cùng hàng.

## Nhân vật

Cả sáu đều là nạn nhân vụ cháy nhà C4 năm 1986, và đều là quỷ. Mỗi người có một lời dụ đẩy người chơi về phía đi trốn.

| id | Tên | Ngoại hình | Lời dụ | Xuất hiện khi tìm |
| --- | --- | --- | --- | --- |
| `bac_tam` | Bác Tâm | \~70 tuổi, tổ trưởng tổ dân phố, áo đại cán | Đề xuất bốc thăm (gian lận) | Sân phơi tầng thượng (M1-54) |
| `co_hang` | Cô Hằng | \~40 tuổi, cầm sổ tem phiếu, ngón tay đen muội | "Cậu chân nhanh, đi trốn là hợp nhất" | Hành lang tầng 2 (M1-51) |
| `anh_khai` | Anh Khải | \~25 tuổi, áo bộ đội bạc màu, tay cháy sém | Giành vai đi tìm; sau đó đòi đổi lượt | Tủ gỗ gầm cầu thang (M1-53) |
| `be_na` | Bé Na | \~7 tuổi, ôm búp bê nhựa chảy một mắt | Rủ trốn cùng | Buồng nhà vệ sinh chung (M1-52) |
| `chi_dung` | Chị Dung | \~30 tuổi, bán nước chè đầu ngõ, xách ấm tích | Mời uống chè cho bình tĩnh | Hành lang tầng 2 (M1-51) |
| `ong_lam` | Ông Lâm | \~60 tuổi, câm, chỉ giao tiếp bằng tiếng gõ (kênh `sound`) | Gõ vào gầm bàn, ra hiệu chỗ trốn | Gầm bàn lúc mất điện (M1-60) |

## Manh mối

Người chơi có 3 lượt trong 6 hành động ở hub M1-04. Không manh mối nào bắt buộc; chúng chỉ làm sinh lộ dễ đoán hơn và tô màu cho kết cục.

| id | Hành động | Node | Phát hiện | Tỉnh táo |
| --- | --- | --- | --- | --- |
| c1 | Xem bảng tin tổ dân phố | M1-05 | Cáo phó vụ cháy C4 rằm tháng Bảy 1986, sáu ảnh thờ là sáu người trong phòng | −1 |
| c2 | Nhìn cửa sổ kính | M1-06 | Trong kính chỉ có bóng của bạn; sáu ghế phía sau trống | −1 |
| c3 | Nhìn sàn dưới bóng đèn | M1-07 | Chỉ bạn có bóng đổ | 0 |
| c4 | Nói chuyện với cô Hằng | M1-08 | Hỏi phiếu gạo tháng Bảy như đang thời bao cấp | 0 |
| c5 | Nói chuyện với bé Na | M1-09 | Tóc có mùi khói; rủ trốn trong tủ gầm cầu thang (bật cờ `na_moi_tron`) | 0 |
| c6 | Nói chuyện với anh Khải | M1-10 | Hai tay cháy sém; giành vai đi tìm | 0 |

## Cảnh và ảnh nền

Màn 1 cần 8 ảnh nền; 6 ảnh địa điểm dùng lại được ở các màn sau trong cùng khu tập thể. Quy cách chung theo mục 5 của tab Đặc tả kịch bản.

### Brief vẽ

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `phong_sinh_hoat` | Nhìn thẳng vào bức tường vôi vàng ố của phòng sinh hoạt chung, ngang tầm mắt người ngồi. Đèn tuýp treo giữa trần. | Mảng tường trống ở giữa (chỗ Huyết tự hiện), đồng hồ quả lắc gỗ bên phải, góc bảng tin bên trái, sàn gạch hoa đỏ ở mép dưới | Ghế, người, bóng người | không |
| `bang_tin_cao_pho` | Cận cảnh bảng tin tổ dân phố bằng gỗ. Giấy báo họp tổ, lịch trực vệ sinh ghim lộn xộn. | Tờ cáo phó ố vàng ở góc dưới, sáu ảnh thờ nhỏ màu nâu xám; mặt chỉ cần đủ phân biệt già, trẻ, trẻ con | Chữ đọc được trên cáo phó | c1 |
| `bang_tin_cao_pho_7` | Giống `bang_tin_cao_pho`. | Thêm khung ảnh thứ bảy, còn trống, ngay cạnh sáu ảnh | Khuôn mặt trong khung thứ bảy | c1 |
| `cua_so_kinh` | Cận cảnh ô cửa sổ kính mờ hơi nước, nhìn từ trong phòng ra. | Bóng phản chiếu mờ của một người (người chơi, nhìn từ sau vai); phía sau trong kính là vòng ghế trống | Người nào khác trong phản chiếu | c2 |
| `hanh_lang_tang_2` | Nhìn dọc hành lang tầng 2. Cửa gỗ sơn xanh hai bên, bếp than tổ ong trước mỗi cửa. | Một bóng đèn vàng gần người xem; nửa sau hành lang chìm hẳn vào tối | Người, kể cả bóng mờ | không |
| `nha_ve_sinh_chung` | Bên trong nhà vệ sinh chung. Dãy buồng cửa gỗ, bồn rửa xi măng với vòi nước. | Buồng trong cùng đóng kín; nền ẩm, tường bong tróc | Người, khe cửa nhìn thấy bên trong | không |
| `gam_cau_thang` | Gầm cầu thang bê tông, nhìn chéo từ dưới lên. | Tủ gỗ cũ khép hờ, khe cửa tối đen | Mắt hay bất cứ thứ gì trong khe cửa | không |
| `san_phoi` | Sân phơi tầng thượng về đêm, trời xanh đêm. | Dây phơi chằng chịt chăn màn, bể nước xi măng đóng rêu ở góc, khuất sau một tấm chăn | Người, khói | không |

### Gán cảnh cho node

Node không có trong bảng thì giữ cảnh trước đó. Khi `eyes_closed` (M1-40, M1-41, M1-61), màn hình tự đen.

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M1-01 | `phong_sinh_hoat` | `flicker` | Cảnh mở đầu |
| M1-04 | `phong_sinh_hoat` | `flicker` | Đặt lại mỗi lần về hub quan sát |
| M1-05 | `bang_tin_cao_pho` | `normal` | Node thêm clue c1 |
| M1-06 | `cua_so_kinh` | `normal` | Node thêm clue c2 |
| M1-30 | `phong_sinh_hoat` | `flicker` |  |
| M1-31 | theo `spot` |  | `tu_go` → `dark`; `wc` → `nha_ve_sinh_chung` + `flicker`; `san_phoi` → `san_phoi` + `normal` |
| M1-42 | `phong_sinh_hoat` | `flicker` |  |
| M1-50 | `phong_sinh_hoat` | `flicker` | Đặt lại mỗi lần về hub tìm kiếm |
| M1-51 | `hanh_lang_tang_2` | `flicker` |  |
| M1-52 | `nha_ve_sinh_chung` | `flicker` | Giữ cho M1-52b |
| M1-53 | `gam_cau_thang` | `flicker` | Giữ cho M1-53b |
| M1-54 | `san_phoi` | `normal` |  |
| M1-60 | giữ nguyên | `dark` | Mất điện; giữ cho M1-62 |
| M1-63 | `phong_sinh_hoat` | `dawn` |  |
| E1 | `bang_tin_cao_pho_7` | `dawn` | Ending; được dùng ảnh có clue c1 |
| D1–D5 |  |  | Mặc định nền đen |

## Kịch bản theo node

Mỗi dòng mở đầu bằng kênh theo dạng `kênh · tham số`. Với `sound`, tham số là `nguồn · vol`; với `npc`, là `id` và `tone` nếu không phải giọng thường.

### Pha 0 – Tỉnh dậy

#### M1-01 · Tỉnh dậy

- `narration` Bạn mở mắt. Lưng tựa vào một chiếc ghế gỗ, gáy mỏi nhừ như đã ngồi đó rất lâu.
- `env · nhìn` Phòng sinh hoạt chung tầng 1. Đèn tuýp chập chờn, tường vôi vàng ố, sàn gạch hoa đỏ. Bảy chiếc ghế xếp thành vòng tròn.
- `env · ngửi` Mùi hương trầm lẫn mùi khói khét.
- `sound · ngoài cửa sổ · 1` Vù… vù… — gió lùa qua những ô cửa chớp không cài then.
- `npc · bac_tam` Đủ cả rồi đấy.
- Tiếp: M1-02

#### M1-02 · Huyết tự

- `sound · bức tường đối diện · 2` Sột… soạt… sột… — như có ai cào móng tay lên lớp vôi.
- `env · nhìn` Những vệt đỏ sẫm rỉ ra từ trong tường, chảy thành chữ.
- `bloodtext` L1–L5.
- `system` Huyết tự luôn mở lại được bằng nút "Huyết tự". Hãy đánh dấu tối đa 3 cụm từ; cụm đã đánh dấu sẽ không bao giờ bị bóp méo.
- Mở giao diện đánh dấu (k1–k6), cho phép bỏ qua.
- Tiếp: M1-03

#### M1-03 · Cả phòng phản ứng

- `npc · co_hang` Lại là trò này…
- `npc · anh_khai` Trốn tìm thôi mà. Chơi xong là được về.
- `npc · be_na · thì thầm` Em sợ…
- `npc · chi_dung` Ai uống chè không? Uống cho ấm bụng.
- `sound · gầm bàn · 1` Cộc. Cộc. Cộc. — ông Lâm gõ ba lần, mắt nhìn bạn không chớp.
- `npc · bac_tam` Còn ít thời gian. Cậu muốn xem gì thì xem đi, rồi ta chọn người đi tìm.
- Tiếp: M1-04

### Pha 1 – Quan sát

#### M1-04 · Hub quan sát

`hub: true`. Mỗi lựa chọn dùng một lần, tốn 1 lượt (`actions_left −1`), xong quay về M1-04. Khi `actions_left` = 0 → M1-20.

1. Xem bảng tin tổ dân phố → M1-05
2. Nhìn ra cửa sổ kính → M1-06
3. Nhìn xuống sàn dưới bóng đèn → M1-07
4. Nói chuyện với cô Hằng → M1-08
5. Nói chuyện với bé Na → M1-09
6. Nói chuyện với anh Khải → M1-10

#### M1-05 · Bảng tin

- `env · nhìn` Bảng tin dán giấy báo họp tổ, lịch trực vệ sinh. Góc dưới có một tờ cáo phó ố vàng.
- `env · nhìn` "Thành kính báo tin: vụ hoả hoạn nhà C4 đêm rằm tháng Bảy năm Bính Dần (1986)…" Bên dưới là sáu tấm ảnh thờ.
- `env · nhìn` Sáu khuôn mặt: bác Tâm, cô Hằng, anh Khải, bé Na, chị Dung, ông Lâm.
- `sound · sau lưng · 1` Kẽo kẹt. — một chiếc ghế gỗ khẽ dịch. Không ai nói gì.
- Hiệu ứng: clue c1, sanity −1.

#### M1-06 · Cửa sổ

- `env · nhìn` Kính cửa sổ mờ hơi nước. Mặt bạn phản chiếu trong đó, xanh xao.
- `env · nhìn` Phía sau bóng bạn trong kính là vòng ghế. Sáu chiếc ghế trống.
- `env · nhìn` Bạn quay lại. Sáu người vẫn ngồi đó, nhìn bạn.
- Hiệu ứng: clue c2, sanity −1.

#### M1-07 · Dưới bóng đèn

- `env · nhìn` Đèn tuýp giữa trần hắt ánh trắng xuống nền gạch hoa.
- `env · nhìn` Bóng bạn đổ dài dưới chân ghế. Dưới chân những người khác, nền gạch sạch trơn.
- `sound · trên trần · 1` Ù… ù… — tiếng chấn lưu đèn tuýp.
- Hiệu ứng: clue c3.

#### M1-08 · Cô Hằng

- `env · nhìn` Cô Hằng lật cuốn sổ tem phiếu, ngón tay đen nhẻm như dính muội.
- `npc · co_hang` Cậu lĩnh phiếu gạo tháng Bảy chưa? Mậu dịch bảo tuần sau mới có.
- `npc · co_hang` Cậu trẻ, chân nhanh. Đi trốn là hợp nhất đấy.
- Hiệu ứng: clue c4.

#### M1-09 · Bé Na

- `env · nhìn` Bé Na ôm con búp bê nhựa, một mắt búp bê chảy nhão như nhựa gặp lửa.
- `env · ngửi` Tóc con bé có mùi khói.
- `npc · be_na · thì thầm` Anh trốn với em nhé. Em biết chỗ không ai tìm thấy đâu… cái tủ gỗ dưới gầm cầu thang ấy.
- Hiệu ứng: clue c5, flag `na_moi_tron`.

#### M1-10 · Anh Khải

- `npc · anh_khai` Để tôi làm người đi tìm. Tôi thuộc khu này như lòng bàn tay.
- `env · nhìn` Anh ta xoa hai bàn tay vào nhau. Da tay sần sùi, cháy sém tới tận cổ tay.
- `npc · anh_khai` Cậu cứ đi trốn đi. Tôi tìm nhanh lắm.
- Hiệu ứng: clue c6.

### Pha 2 – Chọn vai

#### M1-20 · Chọn người đi tìm (lựa chọn quyết định)

- `sound · đồng hồ quả lắc · 2` Boong… — một tiếng chuông duy nhất, dù kim vẫn chỉ 23:59.
- `npc · bac_tam` Đến giờ rồi. Ai làm người đi tìm?
- `npc · anh_khai · hét` Tôi!
- `narration` (nếu clue c1) Sáu khuôn mặt trên tờ cáo phó đang nhìn bạn.

1. "Tôi sẽ đi tìm." → M1-21
2. "Để anh Khải đi tìm." → M1-30 · role hider
3. "Bốc thăm cho công bằng." → M1-22
4. (nếu flag `na_moi_tron`) Nắm tay bé Na: "Anh trốn với em." → M1-30 · role hider, spot `tu_go`
5. "Tôi không chơi." → D1

#### M1-21 · Nhận vai

- `env · nhìn` Anh Khải im bặt. Khoé miệng anh ta giật lên một cái rồi duỗi ra.
- `npc · anh_khai` Tuỳ cậu.
- `npc · bac_tam` Vậy cậu đi tìm. Cả nhà đi trốn.
- `sound · khắp phòng · 2` Kéttt… — sáu chiếc ghế cùng bị đẩy lùi một lúc.
- Hiệu ứng: role seeker.
- Tiếp: M1-40

#### M1-22 · Bốc thăm

- `env · nhìn` Bác Tâm rút từ túi áo đại cán bảy que diêm, nắm kín trong tay. "Ai rút que ngắn thì đi tìm."
- `env · nhìn` Bạn rút. Que dài. Lần lượt từng người rút. Que ngắn rơi vào tay anh Khải.
- `env · nhìn` Đến lúc đó bạn mới để ý: nắm tay bác Tâm vẫn chưa mở hết.
- Hiệu ứng: role hider.
- Tiếp: M1-30

### Pha 3a – Nhánh trốn (luôn dẫn tới D2)

#### M1-30 · Anh Khải đếm

- `sound · giữa phòng · 2` "Một… hai… ba…" — giọng anh Khải đếm, mỗi số trầm hơn một chút; đến "mười" thì không còn giống giọng người.
- `narration` Bạn phải trốn.

Nếu `spot` đã có (`tu_go`) thì bỏ qua lựa chọn, đi thẳng M1-31.

1. Tủ gỗ dưới gầm cầu thang → M1-31 · spot `tu_go`
2. Nhà vệ sinh chung cuối hành lang → M1-31 · spot `wc`
3. Sân phơi tầng thượng, giữa những hàng chăn → M1-31 · spot `san_phoi`

#### M1-31 · Chỗ trốn

Dòng mở đầu theo `spot`:

- `tu_go` → `env · ngửi` Trong tủ tối om, mùi long não và gỗ mục.
- `wc` → `env · ngửi` Mùi khai lẫn nước Javel. `sound · bồn rửa · 1` Tách… tách… — vòi nước nhỏ giọt.
- `san_phoi` → `env · chạm` Những tấm chăn bông ẩm sương quệt vào mặt.

Dòng chung:

- `sound · xa · 1` "…chín mươi chín… một trăm."
- `sound · cầu thang · 2` Lộp cộp. Lộp cộp. — bước chân lên cầu thang.
- `sound · cầu thang · 3` Lộp cộp lộp cộp lộp cộp — không phải một người. Rất nhiều người cùng đi tìm.
- Hiệu ứng: sanity −1.

1. Nín thở, giữ im lặng → D2
2. Lao ra chạy → D2

### Pha 3b – Nhánh đi tìm

#### M1-40 · Đếm (1–50)

- Hiệu ứng khi vào node: `eyes_closed` true.
- `system` Bạn đang nhắm mắt. Chỉ còn nghe được tiếng động và lời nói.
- `narration` Một… hai… ba…
- `sound · khắp phòng · 2` Loẹt quẹt… loẹt quẹt… — tiếng dép lê tản ra mọi phía.
- `narration` …ba mươi…
- `sound · cuối hành lang · 1` Kẹttt… — cửa sắt mở ra rồi không đóng lại.
- `narration` …năm mươi…
- `npc · be_na · thì thầm` Anh ơi, em ở ngay sau lưng anh này. Anh quay lại đi.
- Hiệu ứng: sanity −1.

1. Mở mắt, quay lại → D3 · `eyes_closed` false
2. Tiếp tục đếm → M1-41

#### M1-41 · Đếm (51–100)

- `narration` …năm mươi mốt… sáu mươi…
- `sound · sau gáy · 1` Phù… — một hơi thở lạnh phả vào gáy. Rồi một hơi nữa. Rồi nhiều hơi thở cùng lúc.
- `narration` …tám mươi lăm…
- `npc · bac_tam · hét` Cậu ơi! Có người ngã cầu thang! Mở mắt ra giúp một tay!
- Nếu sanity ≤ 2 và chưa đánh dấu k3: Huyết tự L3 hiện bản méo.

1. Mở mắt → D3 · `eyes_closed` false
2. Đếm tiếp đến một trăm → M1-42

#### M1-42 · Mở mắt

- `narration` …chín mươi chín… một trăm.
- Hiệu ứng: `eyes_closed` false, time "00:00".
- `env · nhìn` Phòng sinh hoạt trống trơn. Bảy chiếc ghế giờ đều xoay mặt về phía bạn.
- `sound · trên trần · 2` Ù… tạch… ù… — đèn tuýp chập chờn.
- `system` Khu tập thể có 4 nơi để tìm. Gà gáy khi bạn đã tìm khắp 4 nơi.
- Tiếp: M1-50

#### M1-50 · Hub tìm kiếm

`hub: true`. Mỗi nơi đi một lần, mỗi lần `time` +1 giờ. Khi đã đi đủ 4 nơi → M1-60.

Dòng hiện mỗi lần quay về hub:

- Nếu `following` = 0: `sound · sau lưng · 1` Sau lưng bạn không có ai. Bạn vẫn nghe thấy hai tiếng bước chân.
- Nếu `following` > 0: `sound · sau lưng · 1` Sau lưng bạn có {following} người. Bạn nghe thấy {following + 2} tiếng bước chân.

1. Hành lang tầng 2 → M1-51
2. Nhà vệ sinh chung cuối hành lang → M1-52
3. Gầm cầu thang → M1-53
4. Sân phơi tầng thượng → M1-54

#### M1-51 · Hành lang tầng 2

- `env · nhìn` Hành lang dài, hai bên là cửa gỗ sơn xanh. Trước mỗi nhà là một bếp than tổ ong nguội ngắt.
- `env · nhìn` Cô Hằng và chị Dung đứng giữa hành lang. Không hề trốn. Họ đang đợi.
- `npc · chi_dung` Tìm thấy bọn chị rồi à. Giỏi quá.
- `npc · co_hang` Giờ bọn cô đi theo cậu nhé.
- Hiệu ứng: found `co_hang`, found `chi_dung`.
- Tiếp: M1-50

#### M1-52 · Nhà vệ sinh chung

- `sound · buồng trong cùng · 2` Cộc. Cộc. — tiếng gõ từ phía trong cánh cửa buồng.
- `npc · be_na · thì thầm` Anh ơi, vào đây trốn với em đi. Nó đang tới đấy. Nhanh lên.
- `sound · hành lang · 2` Lộp cộp… lộp cộp… — bước chân đang tới gần cửa nhà vệ sinh.

1. Lách vào buồng, đóng cửa lại → D5
2. Mở cửa buồng: "Tìm thấy em rồi." → M1-52b

#### M1-52b · Tìm thấy bé Na

- `env · nhìn` Bé Na ngồi trên bệ, ôm búp bê. Mặt con bé tối sầm lại, rồi cười.
- `npc · be_na` Ừ. Anh tìm thấy em rồi.
- `sound · ngoài cửa · 1` Tiếng bước chân dừng lại. Không ai bước vào.
- Hiệu ứng: found `be_na`.
- Tiếp: M1-50

#### M1-53 · Gầm cầu thang

- `env · nhìn` Chiếc tủ gỗ dưới gầm cầu thang khép hờ. Một con mắt nhìn ra qua khe cửa.
- `npc · anh_khai` Tìm thấy tôi rồi. Cậu tìm giỏi thật.
- `npc · anh_khai` Giờ đổi lượt đi. Cậu trốn, tôi tìm. Công bằng mà.
- Nếu sanity ≤ 2 và chưa đánh dấu k4: Huyết tự L4 hiện bản méo.

1. "Được, đổi lượt." → D4
2. "Huyết tự chỉ cho một người đi tìm. Người đó là tôi." → M1-53b
3. Lặng lẽ quay đi → M1-53b

#### M1-53b · Anh Khải bước ra

- `env · nhìn` Anh Khải bước ra khỏi tủ.
- `env · ngửi` Mùi khét lan ra theo anh ta.
- `npc · anh_khai` Tiếc thật.
- Hiệu ứng: found `anh_khai`.
- Tiếp: M1-50

#### M1-54 · Sân phơi tầng thượng

- `env · nhìn` Sân phơi lộng gió, dây phơi chằng chịt chăn màn. Bể nước xi măng đóng rêu ở góc.
- `env · nhìn` Bác Tâm ngồi trên thành bể. Khói bay ra từ miệng bác, dù trên tay không có điếu thuốc nào.
- `npc · bac_tam` Cậu tìm được tôi rồi. Còn ông Lâm thì sao?
- `sound · trong bể nước · 1` Cộc. Cộc. Cộc. — tiếng gõ vọng lên từ dưới mặt nước.
- Hiệu ứng: found `bac_tam`.
- Tiếp: M1-50

### Pha 4 – Trước giờ gà gáy

#### M1-60 · Mất điện

- Hiệu ứng: time "04:00".
- `sound · khắp toà nhà · 3` Phụt. — mọi bóng đèn tắt cùng lúc.
- `env · nhìn` Tối đen.
- `sound · sau lưng · 2` Những tiếng bước chân sau lưng bạn dừng lại. Rồi bắt đầu tản ra.
- `npc · bac_tam · thì thầm` Còn một người chưa tìm thấy đâu, cậu ạ.
- `sound · gầm bàn bên cạnh · 2` Cộc. Cộc. Cộc. — ông Lâm gõ vào gầm chiếc bàn ngay cạnh bạn, như mời bạn chui vào.

1. Chui xuống gầm bàn → D5
2. Đứng yên, nhắm mắt chờ → M1-61
3. Gọi to: "Ông Lâm! Tìm thấy ông rồi!" → M1-62 · sanity −1

#### M1-61 · Đứng yên

- Hiệu ứng: `eyes_closed` true.
- `sound · xung quanh · 3` Lộp cộp lộp cộp — bước chân vây quanh bạn, mỗi lúc một sát.
- `npc · co_hang · thì thầm` Cậu không đi tìm nữa à?
- `narration` Bạn đứng yên. Bạn không trốn.
- Tiếp: M1-63

#### M1-62 · Gọi tên

- `sound · gầm bàn · 2` Cộc… — tiếng gõ dừng lại giữa chừng.
- `env · chạm` Một bàn tay khô, nóng như than nắm lấy cổ tay bạn, rồi buông ra.
- `npc · be_na` Hì hì. Anh tìm đủ rồi.
- Hiệu ứng: found `ong_lam`.
- Tiếp: M1-63

#### M1-63 · Gà gáy

- Hiệu ứng: `eyes_closed` false.
- `sound · rất xa · 2` Ò… ó… o… — tiếng gà gáy, dù cả khu tập thể chẳng nhà nào nuôi gà.
- `env · nhìn` Đèn bật sáng. Bạn đứng một mình giữa phòng sinh hoạt chung.
- Tiếp: E1

## Kết cục

Một kết cục sống và năm kết cục chết. Màn hình chết hiện dòng cuối, rồi Huyết tự với cụm sinh lộ (k4 "bị quỷ tìm thấy") được tô sáng, kèm câu hé lộ.

| id | Kích hoạt từ | Dòng cuối | Hé lộ |
| --- | --- | --- | --- |
| E1 · Sống sót | M1-63 | `env · nhìn` Trên bảng tin, tờ cáo phó có thêm một khung ảnh thứ bảy, còn trống. | Cả sáu người đều là quỷ. Người đi tìm là người duy nhất không thể "bị tìm thấy". Nếu có clue c1: mở khoá hồ sơ "Vụ cháy nhà C4, 1986". |
| D1 · Từ chối chơi | M1-20 | `bloodtext` Dòng L1 đỏ rực lên. `sound · khắp phòng · 3` Kéttt — sáu người đứng dậy cùng lúc. | Vi phạm L1: tất cả phải chơi. |
| D2 · Bị tìm thấy | M1-31 | `npc · tất cả · thì thầm` Tìm thấy rồi. (sáu giọng cùng lúc, sát bên tai) | Mọi người khác đều là quỷ, và tất cả cùng đi tìm. Người trốn không có đường sống. |
| D3 · Mở mắt khi đếm | M1-40, M1-41 | `env · nhìn` Sáu khuôn mặt cháy sém kề sát mặt bạn. | Vi phạm L3. |
| D4 · Đổi lượt | M1-53 | `sound · gầm cầu thang · 2` "Một… hai… ba…" — giọng anh Khải bắt đầu đếm. | Đổi lượt nghĩa là trở thành người trốn, tức là chờ bị quỷ tìm thấy. |
| D5 · Trốn giữa chừng | M1-52, M1-60 | `npc · tất cả · thì thầm` Tìm thấy rồi. | Người đi tìm đã tự biến mình thành người trốn. |
