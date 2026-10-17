# Màn 2 – Canh linh cữu

Gần như toàn bộ màn diễn ra khi nhắm mắt. Sinh lộ: nhận ra mình là người trong quan tài, giữ mắt nhắm suốt đêm, chỉ tin tiếng gà thứ ba từ xa, và chỉ mở mắt sau khi đã bước ra khỏi quan tài.

## Tổng quan

- **Bối cảnh:** mở đầu ở căn hộ 304 của người chơi (tầng 3, khu tập thể C4), đêm hôm sau màn 1. Phần chính diễn ra trong phòng sinh hoạt chung tầng 1, lúc này đã dựng thành nơi để linh cữu.
- **Trạng thái đầu:** `sanity` 5 (xem "Yêu cầu với engine", mục 1), `actions_left` 2, `role` none, `time` "22:00".
- **Mục tiêu dạy:** chơi chỉ bằng `sound`, `npc` và `env` ngửi/chạm; phép đếm; đọc nghĩa đen ("trong quan tài").
- **`on_sanity_zero`:** `m2_n90`. Mức mất tối đa là 6, nên có thể về 0.
- **`solution` cấp màn:** `[k2]`.

### Huyết tự (nguyên văn)

| Dòng | Nội dung | `violable` |
| --- | --- | --- |
| L1 | Đêm nay, bảy người hãy canh linh cữu trong phòng sinh hoạt chung. | false |
| L2 | Người trong quan tài tuyệt đối không được mở mắt. | true |
| L3 | Không ai được rời khỏi phòng trước khi gà gáy ba tiếng. | true |
| L4 | Khi gà gáy ba tiếng, người canh được về, người nằm được dậy. | false |

### Sinh lộ

L1 nói bảy người canh, và đúng bảy người đã điểm danh. Người chơi không phải người canh; người còn lại trong phòng là người trong quan tài. L2 không có thời hạn: chừng nào còn ở trong quan tài thì vẫn không được mở mắt, kể cả sau khi gà gáy. L4 chỉ cho phép người nằm "dậy", không cho phép mở mắt. Tiếng gà phát ra ngay trong phòng chỉ có một tiếng, nên chưa đủ "ba tiếng" của L3 và L4.

Đường sống: nằm yên trước mọi lời dụ, không ra khỏi phòng khi mới có một tiếng gà, đếm đủ ba tiếng gà từ xa, bước ra khỏi quan tài rồi mới mở mắt.

### Từ khoá đánh dấu

| id | Dòng | Cụm từ | Đúng |
| --- | --- | --- | --- |
| k1 | L1 | bảy người | có |
| k2 | L2 | Người trong quan tài | có |
| k3 | L2 | không được mở mắt | không |
| k4 | L3 | trước khi gà gáy ba tiếng | có |
| k5 | L4 | người canh được về | không |
| k6 | L4 | người nằm được dậy | có |

### Bóp méo (khi `sanity` ≤ 2)

| Dòng | Trừ khi đã đánh dấu | Bản méo hiển thị |
| --- | --- | --- |
| L2 | k2 | Người canh linh cữu tuyệt đối không được mở mắt. |
| L4 | k6 | Khi gà gáy, tất cả được mở mắt. |

## Yêu cầu với engine

Màn 2 cần các bổ sung sau. Ghi vào `docs/spec-changes.md` theo AGENTS.md mục 12.

1. **Tỉnh táo hồi về 5 khi bắt đầu mỗi màn.** Thay quy tắc "khi sang màn mới chỉ giữ lại `sanity`" ở mục 2 của đặc tả. Lý do: màn 1 có thể kết thúc với `sanity` 1; nếu giữ nguyên, người chơi vào màn 2 đã bị bóp méo và chỉ cần mất thêm 1 là chết, mà không có cách nào biết trước.
2. **Ẩn giờ trong game khi `eyes_closed` là true.** Người chơi đang nhắm mắt thì không nhìn được đồng hồ; màn này dựa vào việc đếm tiếng gà chứ không dựa vào giờ.
3. **Cho phép hai NPC khác `id` có cùng tên hiển thị.** `anh_phong` và `phong_gia` đều hiển thị "Anh Phong"; người chơi phân biệt qua lời mô tả giọng.
4. **`on_sanity_zero` trỏ tới một node thường** (`m2_n90`), không bắt buộc là ending.

## Nhân vật

Bảy người canh là cư dân thật, đều là người sống. Hai giọng còn lại không phải người. Toàn bộ nhân vật chỉ xuất hiện qua giọng nói, vì người chơi nhắm mắt.

| id | Tên hiển thị | Giọng (mô tả qua chữ) | Vai trò | Trong màn |
| --- | --- | --- | --- | --- |
| `ba_sau` | Bà Sáu | Bà cụ, giọng run run; ở phòng 305 cạnh nhà người chơi | Chủ trì, điểm danh | Sống |
| `ong_quy` | Ông Quý | Giọng ồm, hay ho | Hô đuổi mèo | Sống |
| `co_lien` | Cô Liên | Rành rọt như cô giáo, hay đếm | Đếm người | Sống |
| `chi_mai` | Chị Mai | Giọng trẻ, hay khóc | Hoảng sợ, hỏi han | Chết ở M2-40 |
| `chu_tu` | Chú Tư | Trầm, ít nói | — | Chết ở M2-40 |
| `anh_phong` | Anh Phong | Thanh niên, nóng nảy | Chạy ra ngoài đuổi mèo | Chết ở M2-30 |
| `thang_bin` | Thằng Bin | Trẻ con khoảng mười tuổi | — | Sống |
| `giong_la` | Một giọng lạ | Bà cụ, khác hẳn giọng bà Sáu | Vuốt mắt người chơi | Không phải người |
| `phong_gia` | Anh Phong | Giọng anh Phong nhưng khàn đặc, kèm mùi nước giếng | Thay chỗ anh Phong từ M2-31 | Không phải người |

## Manh mối

Ở hub M2-03, người chơi có 2 lượt trong 4 hành động. Manh mối c5 nằm ở M2-12, không tốn lượt.

| id | Hành động | Node | Phát hiện | Tỉnh táo |
| --- | --- | --- | --- | --- |
| c1 | Đọc tờ giấy luồn qua khe cửa | M2-04 | Giấy mời dự lễ nhập quan tối nay; chữ cuối nhoè nước, chỉ đọc được "người phòng 30…" | 0 |
| c2 | Soi gương | M2-05 | Mặt trắng bệch như đánh phấn, môi có vệt son | −1 |
| c3 | Mở tủ quần áo | M2-06 | Bộ đồ vải trắng gấp sẵn, tên người chơi thêu ở cổ áo | 0 |
| c4 | Gõ vách sang phòng 305 | M2-07 | Bà Sáu nói đã đủ bảy người canh, còn người chơi "không phải đi đâu" | 0 |
| c5 | Sờ quanh người khi tỉnh dậy | M2-12 | Vách gỗ hai bên vai, vải phủ ngực, gạo sống và đồng xu trong miệng | 0 |

## Cảnh và ảnh nền

Màn 2 cần 3 ảnh mới. Phần lớn màn diễn ra khi nhắm mắt nên màn hình đen. Quy cách chung theo mục 5 của `docs/dac-ta-kich-ban.md`.

### Brief vẽ

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `can_ho_304` | Căn hộ một phòng của người chơi, nhìn từ giường về phía cửa ra vào. Ảnh này dùng lại ở nhiều màn. | Mảng tường vôi trống cạnh cửa (chỗ Huyết tự hiện); cửa gỗ có khe hở ở chân cửa; tủ gỗ hai cánh bên phải; gương nhỏ treo cạnh tủ; một bóng đèn sợi đốt trên trần; mép giường đơn ở góc dưới bên trái | Người; bất cứ hình gì trong gương (gương chỉ là một mảng sáng mờ); chữ đọc được | không |
| `phong_sinh_hoat_tang` | Cùng bức tường với `phong_sinh_hoat` (đồng hồ quả lắc bên phải), góc nhìn cao hơn để thấy sàn. Phòng đã dựng thành nơi để linh cữu. | Quan tài gỗ mở nắp, trống, đặt giữa sàn; bàn thờ thấp với bát hương và hai cây nến; khung di ảnh nhìn nghiêng, không thấy mặt; bảy chiếc ghế quanh quan tài, một chiếc đổ nghiêng; vệt nước loang dưới chiếc ghế đổ | Người; khuôn mặt trong di ảnh; mèo | không |
| `cau_thang_chieu_nghi` | Cầu thang bê tông chung của nhà C4, đứng ở chiếu nghỉ nhìn xuống các bậc, ban đêm. Ảnh dùng lại được ở nhiều màn. | Bậc thang bê tông mòn; tay vịn sắt; mảng tường vôi bong tróc; chân cầu thang chìm vào bóng tối | Người, bàn thờ, bát hương, bài vị, chữ đọc được | không |

### Gán cảnh cho node

Node không có trong bảng thì giữ cảnh trước đó. Khi `eyes_closed` (từ M2-10 đến trước M2-51), màn hình tự đen.

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M2-01 | `can_ho_304` | `normal` | |
| M2-09 | `cau_thang_chieu_nghi` | `flicker` | Chỉ khi có cờ `di_xuong`; nếu nằm xuống giường thì giữ `can_ho_304` |
| M2-10 | `phong_sinh_hoat_tang` | `flicker` | Bị che vì `eyes_closed`; khai báo để cảnh đúng khi mắt mở |
| M2-51 | `phong_sinh_hoat_tang` | `dawn` | |
| E1 | `phong_sinh_hoat_tang` | `dawn` | |
| D1–D4 | | | Mặc định nền đen |

## Kịch bản theo node

Ký hiệu giống màn 1: mỗi dòng mở đầu bằng `kênh · tham số`. Với `sound`, tham số là `nguồn · vol`; với `npc`, là `id` và giọng nếu không phải giọng thường.

### Pha 0 – Căn hộ 304

#### M2-01 · Đêm sau

- Hiệu ứng: time "22:00".
- `narration` Đêm hôm sau. Bạn ngồi một mình trong căn hộ 304, không dám tắt đèn.
- `env · nhìn` Bóng đèn sợi đốt vàng vọt. Giường đơn, tủ gỗ, chiếc gương nhỏ cạnh tủ.
- `sound · tầng dưới · 1` Lạch cạch… lạch cạch… — tiếng ai đó kê bàn ghế dưới tầng 1.
- `sound · bức tường cạnh cửa · 2` Sột… soạt… — như có ai cào móng tay lên lớp vôi.
- Tiếp: M2-02

#### M2-02 · Huyết tự

- `env · nhìn` Những vệt đỏ sẫm rỉ ra từ bức tường cạnh cửa, chảy thành chữ.
- `bloodtext` L1–L4.
- `highlight: true`: mở giao diện đánh dấu (k1–k6) sau khi các dòng hiện hết, cho phép bỏ qua.
- `system` Bạn có 2 lượt hành động trước khi đêm xuống hẳn.
- Tiếp: M2-03

#### M2-03 · Hub căn hộ

`hub: true`, `hub_done: {actions_left_lte: 0}`, `hub_exit: M2-08`. Mỗi lựa chọn dùng một lần, tốn 1 lượt (`actions_left −1`), xong quay về M2-03.

1. Đọc tờ giấy luồn qua khe cửa → M2-04
2. Soi gương → M2-05
3. Mở tủ quần áo → M2-06
4. Gõ vách sang phòng 305 → M2-07

#### M2-04 · Tờ giấy

- `env · nhìn` Một tờ giấy pơ-luya luồn qua khe cửa, mép giấy ướt.
- `env · nhìn` "Kính mời bà con dự lễ nhập quan tối nay tại phòng sinh hoạt chung. Người phòng 30…" Chữ cuối nhoè nước, không đọc được.
- `sound · ngoài cửa · 1` Lẹp xẹp… — tiếng dép lê đi xa dần ngoài hành lang.
- Hiệu ứng: clue c1.
- Tiếp: M2-03

#### M2-05 · Gương

- `env · nhìn` Mặt bạn trong gương trắng bệch như vừa đánh phấn.
- `env · nhìn` Trên môi có một vệt son đỏ. Bạn chưa từng tô son.
- `env · chạm` Bạn quệt tay lên môi. Vệt son trong gương vẫn còn nguyên.
- Hiệu ứng: clue c2, sanity −1.
- Tiếp: M2-03

#### M2-06 · Tủ quần áo

- `sound · cánh tủ · 1` Kẹt…
- `env · nhìn` Ngăn trên cùng có một bộ đồ vải trắng gấp vuông vức. Bạn chưa từng mua bộ đồ nào như thế.
- `env · nhìn` Ở cổ áo, tên bạn được thêu bằng chỉ đen.
- `env · ngửi` Mùi long não lẫn mùi vải mới.
- Hiệu ứng: clue c3.
- Tiếp: M2-03

#### M2-07 · Gõ vách

- `sound · vách tường · 2` Cộc cộc. — bạn gõ sang phòng 305.
- `npc · ba_sau` Ai đấy? Cậu 304 à?
- `npc · ba_sau` Tối nay cả tầng xuống canh linh cữu. Đủ bảy người rồi.
- `npc · ba_sau` Còn cậu thì… cậu không phải đi đâu. Cậu cứ nằm nghỉ đi.
- Hiệu ứng: clue c4.
- Tiếp: M2-03

#### M2-08 · Buồn ngủ

- Hiệu ứng: time "23:59".
- `env · nhìn` Đồng hồ treo tường chỉ 23:59. Mí mắt bạn nặng như đeo chì.

1. Xuống phòng sinh hoạt chung → M2-09 · flag `di_xuong`
2. Nằm xuống giường → M2-09

#### M2-09 · Thiếp đi

- `narration` (nếu flag `di_xuong`) Bạn bước xuống cầu thang. Đến chiếu nghỉ tầng 2 thì hai chân khuỵu xuống.
- `narration` (nếu not_flag `di_xuong`) Bạn nằm xuống. Chăn lạnh như vừa giặt xong chưa phơi.
- `narration` Mọi thứ tối dần.
- Tiếp: M2-10

### Pha 1 – Tỉnh dậy trong bóng tối

#### M2-10 · Tỉnh dậy

- Hiệu ứng khi vào node: `eyes_closed` true, time "00:00".
- `system` Bạn chưa mở mắt.
- `narration` Bạn tỉnh dậy. Mí mắt khép, nặng trĩu.
- `env · chạm` Lưng bạn nằm trên một tấm gỗ phẳng và cứng.
- `env · ngửi` Mùi hương trầm, mùi nến, mùi vải mới.
- `sound · xung quanh · 1` Xì xào… xì xào… — nhiều người đang nói nhỏ quanh bạn.

1. Mở mắt → D1 · `eyes_closed` false
2. Nằm yên lắng nghe → M2-11
3. Đưa tay sờ quanh người → M2-12

#### M2-12 · Sờ quanh người

- `env · chạm` Hai bên vai chạm vào vách gỗ. Bạn không xoay người được.
- `env · chạm` Một tấm vải mỏng phủ từ ngực xuống chân.
- `env · chạm` Trong miệng bạn có mấy hạt gạo sống và một đồng xu lạnh ngắt.
- `npc · chi_mai · thì thầm` Tay… tay nó vừa động đậy…
- `npc · ba_sau` Gió lùa thôi con. Đừng nhìn.
- Hiệu ứng: clue c5.
- Tiếp: M2-11

#### M2-11 · Điểm danh

- `npc · ba_sau` Điểm danh cho đủ người canh. Bà Sáu đây.
- `sound · bên trái · 1` Khụ… khụ…
- `npc · ong_quy` Quý.
- `npc · co_lien` Liên, có.
- `npc · chi_mai` Mai… có ạ.
- `npc · chu_tu` Tư.
- `npc · anh_phong` Phong đây. Nhanh lên cho xong.
- `npc · thang_bin` Bin ạ.
- `npc · ba_sau` Bảy. Đủ bảy người canh.
- `sound · bàn thờ · 1` Lép bép… — tiếng nến cháy. Ngoài ra im lặng.
- `npc · ba_sau · thì thầm` Còn ai nữa không?

1. Im lặng → M2-20
2. Lên tiếng: "Còn tôi." → M2-13 · flag `len_tieng`, sanity −1

#### M2-13 · Người nằm lên tiếng

- `npc · chi_mai · hét` Nó nói! Người chết nói!
- `sound · xung quanh · 3` Rầm. — ghế đổ. Tiếng nhiều người cùng lùi lại.
- `npc · ba_sau` Ngồi xuống hết! Đứa nào ra khỏi phòng là chết, chữ máu viết rồi!
- `npc · co_lien · thì thầm` Đừng ai nhìn vào mặt nó.
- Tiếp: M2-20

### Pha 2 – Đêm canh

#### M2-20 · Bàn tay vuốt mắt

- Hiệu ứng: time "01:30", sanity −1.
- `sound · sát quan tài · 1` Lẹp xẹp… lẹp xẹp… — tiếng dép lê dừng lại ngay cạnh đầu bạn.
- `npc · giong_la · thì thầm` Mắt chưa khép hẳn. Để bà vuốt cho.
- `env · chạm` Mấy ngón tay lạnh và khô đặt lên mí mắt bạn, vuốt nhẹ xuống.
- `env · chạm` Rồi chúng dừng lại. Và bắt đầu kéo ngược lên.
- `npc · chi_mai · thì thầm` (nếu flag `len_tieng`) Bà… bà là ai thế?

1. Nhắm chặt mắt hết sức → M2-21
2. Để yên, không phản ứng → D1 · `eyes_closed` false
3. Hét lên: "Buông ra!" → M2-21

#### M2-21 · Bàn tay rút đi

- `env · chạm` Mấy ngón tay rời khỏi mí mắt bạn.
- `sound · sát quan tài · 1` Lẹp xẹp… — tiếng dép lê xa dần. Không có tiếng cửa.
- `npc · ba_sau` Vừa nãy ai đứng cạnh quan tài thế?
- `npc · co_lien` Không ai cả, bà ạ. Cả bảy người vẫn ngồi đây.
- Tiếp: M2-30

#### M2-30 · Mèo đen

- Hiệu ứng: time "03:00", sanity −1.
- `sound · bậu cửa sổ · 1` Meo…
- `env · chạm` Phịch. — một thứ mềm và nặng rơi xuống ngực bạn. Bốn bàn chân, móng bấu qua lớp vải.
- `npc · ong_quy · hét` Mèo nhảy qua xác! Đuổi nó đi!
- `npc · anh_phong · hét` Để tôi!
- `sound · cửa phòng · 2` Kéttt… — cửa sắt mở. Tiếng chân chạy xa dần ngoài hành lang.
- `sound · hành lang · 2` Một tiếng thét ngắn. Rồi im.
- `npc · co_lien · thì thầm` Anh Phong ra khỏi phòng rồi… Chưa có tiếng gà nào mà…
- `narration` Một luồng lạnh chạy dọc sống lưng. Cơ thể bạn muốn bật ngồi dậy.

1. Nằm yên → M2-31
2. Ngồi dậy (vẫn nhắm mắt) → M2-32 · flag `ngoi_day`, sanity −1

#### M2-32 · Ngồi dậy

- `npc · chi_mai · hét` Xác ngồi dậy! Quỷ nhập tràng!
- `sound · cửa phòng · 2` Kéttt… — cửa sắt mở rồi đóng.
- `npc · phong_gia` Nằm xuống.
- `env · chạm` Một bàn tay ấn lên ngực bạn, lạnh như nước giếng.
- `env · ngửi` Mùi rêu ẩm.
- `npc · phong_gia · thì thầm` Hay mở mắt ra nhìn tôi một cái?

1. Nằm xuống → M2-31
2. Mở mắt → D1 · `eyes_closed` false

#### M2-31 · Anh Phong trở về

- `sound · cửa phòng · 2` (nếu not_flag `ngoi_day`) Kéttt… — cửa sắt mở. Tiếng bước chân trở vào, chậm và nặng.
- `npc · phong_gia` Đuổi được con mèo rồi.
- `env · ngửi` Mùi nước giếng và rêu ẩm lan khắp phòng.
- `npc · co_lien · thì thầm` Một, hai, ba, bốn, năm, sáu, bảy… Vẫn đủ bảy.
- Tiếp: M2-40

#### M2-40 · Tiếng gà trong phòng

- Hiệu ứng: time "04:30", sanity −1.
- `sound · ngay trong phòng · 2` Ò… ó… o… — một tiếng gà duy nhất, gần đến mức như phát ra từ cạnh quan tài.
- `npc · phong_gia · hét` Gà gáy rồi! Xong rồi, về thôi!
- `npc · chi_mai` Về được rồi à?
- `sound · cửa phòng · 2` Kéttt… — hai đôi dép chạy ra cửa.
- `sound · hành lang · 3` Hai tiếng thét nối nhau. Rồi im bặt.
- `npc · ba_sau · thì thầm` Mai ơi… chú Tư ơi…
- `npc · phong_gia · thì thầm` Cậu cũng dậy đi. Mở mắt ra mà xem trời sáng chưa.
- Nếu sanity ≤ 2: Huyết tự L2 (chưa đánh dấu k2) và L4 (chưa đánh dấu k6) hiện bản méo.

1. Mở mắt → D1 · `eyes_closed` false
2. Ngồi dậy, lần ra cửa (vẫn nhắm mắt) → D2
3. Nằm yên, đếm tiếng gà → M2-50

#### M2-50 · Ba tiếng gà

- Hiệu ứng: time "05:30".
- `sound · rất xa · 1` Ò… ó… o…
- `narration` Một.
- `sound · rất xa · 1` Ò… ó… o…
- `narration` Hai.
- `sound · rất xa · 2` Ò… ó… o…
- `narration` Ba.
- `npc · ba_sau` Ba tiếng rồi. Về thôi các con.
- `sound · cửa phòng · 2` Lẹp xẹp… — tiếng dép lê tản ra cửa. Không có tiếng thét nào.
- `env · ngửi` Mùi rêu nhạt dần rồi mất hẳn.
- `narration` Phòng im lặng.

1. Mở mắt, rồi bước ra khỏi quan tài → D3 · `eyes_closed` false
2. Bước ra khỏi quan tài, rồi mới mở mắt → M2-51

#### M2-51 · Bước ra

- Hiệu ứng: `eyes_closed` false.
- `env · chạm` Bàn chân trần chạm nền gạch hoa lạnh buốt.
- `narration` Bạn đứng bên ngoài quan tài.
- `env · nhìn` Phòng sinh hoạt chung. Một chiếc quan tài gỗ mở nắp đặt giữa sàn, trống trơn.
- `env · nhìn` Trên bàn thờ, di ảnh là khuôn mặt bạn.
- Tiếp: E1

#### M2-90 · Hoảng loạn (`on_sanity_zero`)

- Hiệu ứng: `eyes_closed` false.
- `narration` Bạn không chịu nổi bóng tối nữa.
- `narration` Mắt bạn tự mở ra.
- Tiếp: D4

## Kết cục

Một kết cục sống và bốn kết cục chết. Màn hình chết tô các cụm trong cột `solution`.

| id | Kích hoạt từ | Dòng cuối | Luật | `solution` | Hé lộ |
| --- | --- | --- | --- | --- | --- |
| E1 · Sống sót | M2-51 | `env · nhìn` Bảy chiếc ghế quanh quan tài. Một chiếc đổ nghiêng, vệt nước loang dưới chân ghế. | — | [k2, k6] | Bảy người canh đã đủ; bạn là người trong quan tài. L2 ràng buộc bạn chừng nào còn ở trong quan tài, kể cả sau tiếng gà. L4 chỉ cho phép dậy. |
| D1 · Mở mắt giữa đêm | M2-10, M2-20, M2-32, M2-40 | `env · nhìn` Ngay trên mặt bạn là một khuôn mặt đàn bà, hai hốc mắt trống, đang mỉm cười. | `violates: [L2]` | [k2] | Bảy người canh đã đủ. Người còn lại trong phòng là bạn, và bạn đang nằm trong quan tài. |
| D2 · Rời phòng sớm | M2-40 | `sound · hành lang · 3` Lẹp xẹp lẹp xẹp — tiếng dép lê đuổi sát sau lưng. Rồi: Ò… ó… o…, ngay bên tai bạn. | `violates: [L3]` | [k4] | Mới có một tiếng gà, và nó phát ra từ trong phòng. |
| D3 · Mở mắt khi còn trong quan tài | M2-50 | `env · nhìn` Trần nhà, và vành gỗ quan tài bao quanh tầm mắt. Nắp quan tài đang từ từ khép lại. | `violates: [L2]` | [k2, k6] | Gà đã gáy đủ ba tiếng, nhưng bạn vẫn ở trong quan tài. L4 cho phép dậy, không cho phép mở mắt. |
| D4 · Hoảng loạn | M2-90 | `env · nhìn` Ánh nến. Những khuôn mặt cúi nhìn xuống bạn. Một khuôn mặt ướt sũng. | `violates: [L2]` | [k2] | Tỉnh táo về 0 khi bạn vẫn ở trong quan tài. |

## Kiểm tra nhanh

- Đường sống tối thiểu mất 3 Tỉnh táo (M2-20, M2-30, M2-40), kết thúc ở 2. Vì vậy từ M2-40 trở đi, bản méo luôn xuất hiện nếu người chơi chưa đánh dấu k2 hoặc k6.
- Mức mất tối đa là 6 (c2, lựa chọn lên tiếng ở M2-11, M2-20, M2-30, lựa chọn ngồi dậy ở M2-30, M2-40), nên M2-90 tới được.
- Test cần có: đường sống; D1 từ cả bốn node; D2; D3; D4 (đi đủ mọi lựa chọn mất Tỉnh táo); bản méo L2 và L4 ở M2-40.
