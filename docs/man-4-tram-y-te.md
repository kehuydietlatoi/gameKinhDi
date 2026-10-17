# Màn 4 – Trạm y tế

Sinh lộ: luật chỉ bảo đảm cho bác sĩ. Chỉ uống thuốc do bác sĩ đưa lúc chín giờ, không tin lời thì thầm của bệnh nhân hay y tá, không rời giường sau khi đèn tắt, và dùng chính lời của bác sĩ để vạch mặt kẻ giả làm bác sĩ.

## Tổng quan

- **Bối cảnh:** đêm 20 tháng Bảy âm lịch. Sau màn 3, người chơi sốt cao và ngất ở cầu thang. Người ta khiêng sang trạm y tế phường ở tầng 1 nhà C5, đối diện C4. Phòng lưu bệnh có 4 giường; ba giường kia được che bằng bình phong vải.
- **Trạng thái đầu:** `sanity` 5, `actions_left` 3, `role` none, `time` "20:00".
- **Mục tiêu dạy:** luật chỉ bảo đảm cho một nguồn; dùng lời của nguồn được bảo đảm để kiểm tra nguồn khác; đa nghi cũng là bẫy.
- **`on_sanity_zero`:** không cần; mức mất tối đa là 4.
- **`solution` cấp màn:** `[k3]`.

### Huyết tự (nguyên văn)

| Dòng | Nội dung | `violable` |
| --- | --- | --- |
| L1 | Bệnh nhân phải uống thuốc lúc chín giờ tối. | true |
| L2 | Bác sĩ luôn nói thật. | false |
| L3 | Sau khi đèn tắt, bệnh nhân không được rời giường. | true |
| L4 | Bệnh nhân nào không uống thuốc sẽ được đưa xuống tầng hầm. | false |

### Sinh lộ

L2 chỉ bảo đảm lời của bác sĩ, không bảo đảm gì cho y tá hay bệnh nhân. Viên thuốc hồng y tá đưa lúc 20:50 làm người chơi ngủ quên quá chín giờ, tức vi phạm L1. Thuốc của bác sĩ Thanh đắng và làm người chơi thấy những thứ không muốn thấy, nhưng bà nói "không độc với cậu", và bà luôn nói thật.

Sau khi đèn tắt, một người đàn ông mặc áo blouse xưng là bác sĩ Thanh và bảo người chơi dậy đi theo. Bác sĩ Thanh mà người chơi gặp lúc chín giờ là phụ nữ, và chính bà nói "Đêm nay chỉ có một bác sĩ trực là tôi". Vì bà luôn nói thật, người đàn ông kia không phải bác sĩ.

### Từ khoá đánh dấu

| id | Dòng | Cụm từ | Đúng |
| --- | --- | --- | --- |
| k1 | L1 | Bệnh nhân phải uống thuốc | không |
| k2 | L1 | lúc chín giờ tối | có |
| k3 | L2 | Bác sĩ luôn nói thật | có |
| k4 | L3 | không được rời giường | có |
| k5 | L4 | đưa xuống tầng hầm | không |
| k6 | L4 | Bệnh nhân nào không uống thuốc | không |

### Bóp méo (khi `sanity` ≤ 2)

| Dòng | Trừ khi đã đánh dấu | Bản méo hiển thị |
| --- | --- | --- |
| L2 | k3 | Y tá luôn nói thật. |
| L3 | k4 | Sau khi đèn tắt, bệnh nhân không được ở lại giường. |

## Yêu cầu với engine

Không cần bổ sung. Màn này chỉ dùng các cơ chế đã có từ màn 1–3.

## Nhân vật

| id | Tên hiển thị | Mô tả | Thật sự là |
| --- | --- | --- | --- |
| `bac_si_thanh` | Bác sĩ Thanh | Phụ nữ khoảng 40 tuổi, đi guốc gỗ, giọng mệt nhưng chắc | Người thật, luôn nói thật |
| `y_ta_hong` | Y tá Hồng | Khoảng 25 tuổi, cười nhiều, tay lạnh | Quỷ |
| `ong_cuong` | Ông Cường | Bệnh nhân giường 2 | Quỷ |
| `chi_hien` | Chị Hiền | Bệnh nhân giường 3 | Quỷ |
| `ba_tu` | Bà Tư | Bệnh nhân giường 4, nằm quay mặt vào tường | Quỷ |
| `nguoi_ao_blouse` | Người mặc áo blouse | Đàn ông, đi giày da, xưng là bác sĩ Thanh | Quỷ |

## Manh mối

Ở hub M4-03, người chơi có 3 lượt trong 5 hành động.

| id | Hành động | Node | Phát hiện | Tỉnh táo |
| --- | --- | --- | --- | --- |
| c1 | Đọc bảng phân công trực đêm | M4-04 | Đêm 20/7: một bác sĩ trực (Thanh), một y tá trực (Hồng) | 0 |
| c2 | Hỏi ông Cường giường bên | M4-05 | Ông thì thầm thuốc của bác sĩ là thuốc độc | −1 |
| c3 | Đọc thẻ bệnh nhân treo ở cuối giường bên | M4-06 | Ngày vào viện: 15/7/1986, đúng đêm cháy nhà C4 | −1 |
| c4 | Đọc bệnh án ở cuối giường mình | M4-07 | Chữ ký "BS Thanh": uống đủ liều lúc 21h, sau tắt đèn không rời giường | 0 |
| c5 | Hỏi y tá Hồng | M4-08 | Chị ta sẽ phát thuốc thay bác sĩ, "liều của em khác" | 0 |

## Cảnh và ảnh nền

Màn 4 cần 1 ảnh mới.

### Brief vẽ

| id | Góc nhìn và nội dung | Bắt buộc có | Cấm vẽ | `clue` |
| --- | --- | --- | --- | --- |
| `phong_luu_benh` | Phòng lưu bệnh trạm y tế, nhìn từ giường của người chơi về phía bức tường đối diện. | Mảng tường vôi trống ở giữa bức tường đối diện (chỗ Huyết tự hiện); ba bình phong vải trắng che ba giường sắt; quạt trần; tủ thuốc cửa kính; bảng phân công treo cạnh cửa; cửa ra hành lang khép hờ; đèn tuýp | Người, bóng người sau bình phong, chữ đọc được trên bảng | không |

### Gán cảnh cho node

| Node | `bg` | `light` | Ghi chú |
| --- | --- | --- | --- |
| M4-01 | `phong_luu_benh` | `normal` | |
| M4-20 | `phong_luu_benh` | `dark` | Đèn tắt; giữ đến M4-32 |
| M4-40 | `phong_luu_benh` | `dawn` | |
| E1 | `phong_luu_benh` | `dawn` | |
| D1–D3 | | | Mặc định nền đen |

## Kịch bản theo node

### Pha 0 – Tỉnh dậy

#### M4-01 · Phòng lưu bệnh

- Hiệu ứng: time "20:00".
- `narration` Bạn tỉnh dậy trên một chiếc giường sắt. Đầu nặng như đổ chì.
- `env · nhìn` Phòng lưu bệnh của trạm y tế phường. Ba chiếc giường còn lại khuất sau bình phong vải trắng.
- `env · ngửi` Mùi cồn, mùi thuốc đỏ.
- `sound · trên trần · 1` Vù… vù… — quạt trần quay chậm.
- `sound · cửa · 2` Cộp. Cộp. — tiếng guốc gỗ bước vào.
- `npc · bac_si_thanh` Tỉnh rồi à. Cậu ngất ở cầu thang nhà C4, người ta khiêng sang đây.
- `npc · bac_si_thanh` Chín giờ tôi quay lại phát thuốc. Nằm yên đấy.
- `sound · hành lang · 1` Cộp… cộp… — tiếng guốc gỗ xa dần.
- Tiếp: M4-02

#### M4-02 · Huyết tự

- `sound · bức tường đối diện · 2` Sột… soạt…
- `env · nhìn` Những vệt đỏ sẫm rỉ ra giữa bức tường đối diện, chảy thành chữ.
- `bloodtext` L1–L4.
- `highlight: true`: mở giao diện đánh dấu (k1–k6) sau khi các dòng hiện hết, cho phép bỏ qua.
- `sound · sau bình phong · 1` Khục khục… — có người cười khẽ sau tấm bình phong.
- `system` Bạn có 3 lượt hành động trước chín giờ.
- Tiếp: M4-03

### Pha 1 – Trước giờ uống thuốc

#### M4-03 · Hub phòng lưu bệnh

`hub: true`, `hub_done: {actions_left_lte: 0}`, `hub_exit: M4-10`. Mỗi lựa chọn dùng một lần, tốn 1 lượt (`actions_left −1`), xong quay về M4-03.

1. Đọc bảng phân công trực đêm → M4-04
2. Hỏi ông Cường giường bên → M4-05
3. Đọc thẻ bệnh nhân treo ở cuối giường bên → M4-06
4. Đọc bệnh án ở cuối giường mình → M4-07
5. Hỏi y tá Hồng → M4-08

#### M4-04 · Bảng phân công

- `env · nhìn` Tấm bảng gỗ cạnh cửa, chữ phấn: "Đêm 20/7. Bác sĩ trực: Thanh. Y tá trực: Hồng."
- `env · nhìn` Không có tên ai khác.
- Hiệu ứng: clue c1.
- Tiếp: M4-03

#### M4-05 · Ông Cường

- `env · nhìn` Sau tấm bình phong thứ nhất, một ông cụ nằm kéo chăn tới cằm.
- `npc · ong_cuong · thì thầm` Đừng uống thuốc của mụ bác sĩ. Độc đấy.
- `npc · ong_cuong · thì thầm` Tôi thấy rồi. Người uống xong là bị đẩy xuống tầng hầm.
- `env · ngửi` Hơi thở ông có mùi khói.
- Hiệu ứng: clue c2, sanity −1.
- Tiếp: M4-03

#### M4-06 · Thẻ bệnh nhân

- `env · nhìn` Ở cuối giường bên treo một tấm thẻ bìa cứng đã ngả vàng.
- `env · nhìn` "Ngày vào viện: 15/7/1986. Chẩn đoán: bỏng."
- `sound · sau bình phong · 1` Sột soạt… — người trên giường trở mình, rất chậm.
- Hiệu ứng: clue c3, sanity −1.
- Tiếp: M4-03

#### M4-07 · Bệnh án

- `env · nhìn` Tập bệnh án kẹp ở cuối giường bạn, nét chữ gọn gàng:
- `env · nhìn` "Sốt cao, mê sảng. Uống đủ liều lúc 21h. Sau tắt đèn không rời giường. — BS Thanh."
- Hiệu ứng: clue c4.
- Tiếp: M4-03

#### M4-08 · Y tá Hồng

- `env · nhìn` Một cô y tá trẻ đang xếp lọ thuốc vào tủ kính. Cô ta quay lại, cười.
- `npc · y_ta_hong` Bác sĩ bận lắm. Tối nay chị phát thuốc thay.
- `npc · y_ta_hong` Liều của em khác mọi người. Uống sớm một chút cho ngấm.
- Hiệu ứng: clue c5.
- Tiếp: M4-03

### Pha 2 – Chín giờ

#### M4-10 · Y tá đến sớm

- Hiệu ứng: time "20:50", sanity −1.
- `sound · cửa · 1` Lạch cạch… — tiếng khay inox.
- `env · nhìn` Y tá Hồng đặt trước mặt bạn một viên thuốc màu hồng và chén nước.
- `npc · y_ta_hong` Liều của em đây. Bác sĩ dặn uống sớm.
- `env · chạm` Tay chị ta chạm vào tay bạn, lạnh như vừa nhúng nước đá.
- `npc · ong_cuong · thì thầm` Uống của cô ấy đi. Đừng đợi mụ kia.
- Nếu sanity ≤ 2: Huyết tự L2 (chưa đánh dấu k3) hiện bản méo.

1. Uống viên thuốc của y tá → M4-11
2. "Tôi đợi bác sĩ." → M4-12
3. Cầm lấy viên thuốc, giấu xuống gối → M4-12 · flag `giau_thuoc`

#### M4-11 · Ngủ thiếp

- `narration` Viên thuốc ngọt lịm. Mí mắt bạn sụp xuống.
- `sound · rất xa · 1` Boong… boong… — đồng hồ ở đâu đó điểm chín tiếng. Bạn đếm không hết.
- `env · chạm` Giường bạn đang lăn đi.
- Tiếp: D1

#### M4-12 · Bác sĩ Thanh

- Hiệu ứng: time "21:00".
- `sound · cửa · 2` Cộp. Cộp. — tiếng guốc gỗ.
- `npc · bac_si_thanh` Chín giờ. Thuốc của cậu đây.
- `env · nhìn` Một viên thuốc nâu xỉn và chén nước.
- `npc · bac_si_thanh` Đắng lắm. Uống xong cậu sẽ thấy những thứ không muốn thấy.
- `npc · bac_si_thanh` (nếu flag `giau_thuoc`) Viên hồng dưới gối là ai đưa? Trạm này không có thuốc màu hồng.
- `npc · chi_hien · thì thầm` Độc đấy… Em thấy rồi, uống xong là xuống hầm.
- `npc · ba_tu · thì thầm` Đừng uống…

1. Uống thuốc → M4-13
2. Hỏi: "Thuốc này có độc không?" → M4-12b
3. Đợi bác sĩ quay đi, đổ thuốc xuống gầm giường → D2

#### M4-12b · Câu hỏi

- `npc · bac_si_thanh` Không độc với cậu.
- `env · nhìn` Bà nhìn bạn, không chớp mắt.
- `npc · ong_cuong · thì thầm` Bác sĩ nào chẳng nói thế.

1. Uống thuốc → M4-13
2. Đợi bác sĩ quay đi, đổ thuốc xuống gầm giường → D2

#### M4-13 · Những thứ không muốn thấy

- Hiệu ứng: sanity −1.
- `env · ngửi` Đắng ngắt, như nhai than.
- `narration` Rồi bạn nhìn thấy.
- `env · nhìn` Ba tấm bình phong trở nên mỏng như giấy pơ-luya. Sau mỗi tấm là một chiếc giường, và trên mỗi giường là một lớp tro mỏng nằm thành hình người.
- `npc · ong_cuong` Nó uống rồi.
- `npc · y_ta_hong · thì thầm` Tiếc quá.
- Tiếp: M4-20

### Pha 3 – Đèn tắt

#### M4-20 · Tắt đèn

- Hiệu ứng: time "22:00".
- `sound · công tắc · 2` Tách. — đèn tắt.
- `env · ngửi` Mùi khói. Mỗi lúc một đặc.
- `npc · chi_hien · hét` Cháy! Cháy dưới tầng hầm! Chạy đi!
- `sound · quanh giường · 2` Bịch bịch bịch — tiếng chân trần chạy ra cửa.
- Nếu sanity ≤ 2: Huyết tự L3 (chưa đánh dấu k4) hiện bản méo.

1. Rời giường, chạy theo → D3
2. Nằm yên → M4-21
3. Gọi to: "Bác sĩ ơi!" → M4-20b

#### M4-20b · Tiếng gọi

- `npc · bac_si_thanh` (từ cuối hành lang) Không có cháy. Nằm yên.
- `sound · hành lang · 1` Cộp… cộp…
- Tiếp: M4-21

#### M4-21 · Khói tan

- `env · ngửi` Mùi khói nhạt dần, rồi mất hẳn.
- `sound · ngoài cửa · 1` Khúc khích… — ba giọng cười khẽ, rồi im.
- Tiếp: M4-30

#### M4-30 · Người mặc áo blouse

- Hiệu ứng: time "01:00".
- `sound · hành lang · 2` Cộp… cộp… — không phải tiếng guốc gỗ. Tiếng giày da.
- `npc · nguoi_ao_blouse` Tôi là bác sĩ. Cậu phải dậy theo tôi sang phòng thủ thuật ngay.
- `env · chạm` Một bàn tay đàn ông, to và ấm, nắm lấy cổ tay bạn.

1. Dậy đi theo → D3
2. Hỏi: "Anh tên gì?" → M4-31
3. Rút tay lại, nằm yên → M4-32

#### M4-31 · Tên

- `npc · nguoi_ao_blouse` Bác sĩ Thanh. Tôi trực đêm nay.
- `narration` Bác sĩ Thanh bạn gặp lúc chín giờ là một người phụ nữ.
- `narration` (nếu clue c1) Bảng phân công chỉ ghi một bác sĩ trực.

1. Dậy đi theo → D3
2. Rút tay lại, nằm yên → M4-32

#### M4-32 · Một bác sĩ

- `sound · cạnh giường · 1` Bàn tay kia buông ra. Tiếng giày da đứng im rất lâu.
- `sound · cuối hành lang · 2` Cộp. Cộp.
- `npc · bac_si_thanh` Đêm nay chỉ có một bác sĩ trực là tôi. Cậu nằm yên đến sáng.
- `sound · cửa · 1` Tiếng giày da lùi ra cửa, rồi tắt.
- Tiếp: M4-40

#### M4-40 · Sáng

- Hiệu ứng: time "05:30".
- `env · nhìn` Trời hửng sáng. Ba tấm bình phong đã được gấp lại. Ba chiếc giường sau đó trống trơn, đệm phủ một lớp bụi xám.
- `npc · bac_si_thanh` Hết sốt rồi. Cậu về được.
- `npc · bac_si_thanh` Ba giường kia bỏ trống từ năm tám sáu. Không ai dám xếp bệnh nhân vào.
- Tiếp: E1

## Kết cục

| id | Kích hoạt từ | Dòng cuối | Luật | `solution` | Hé lộ |
| --- | --- | --- | --- | --- | --- |
| E1 · Sống sót | M4-40 | `env · nhìn` Trên khung cửa phòng lưu bệnh có một tấm biển đồng xỉn màu: "Tưởng niệm các nạn nhân vụ cháy nhà C4 được cấp cứu tại đây." | — | [k2, k3] | Huyết tự chỉ bảo đảm cho bác sĩ. Bác sĩ Thanh nói thật: thuốc không độc với bạn, và đêm nay chỉ có một bác sĩ trực. |
| D1 · Ngủ quên giờ thuốc | M4-11 | `env · chạm` Giường lăn qua ngưỡng cửa, rồi dốc xuống. Không khí lạnh dần. | `violates: [L1]`, `consequence_of: [L4]` | [k2, k3] | Viên thuốc hồng làm bạn ngủ quên giờ uống thuốc. Huyết tự không bảo đảm gì cho y tá. |
| D2 · Đổ thuốc | M4-12, M4-12b | `sound · rất xa · 2` Ken két… — bánh xe giường lăn xuống một con dốc, dù trạm y tế chỉ có một tầng. | `violates: [L1]`, `consequence_of: [L4]` | [k3] | Bác sĩ luôn nói thật: thuốc không độc với bạn. Người thì thầm không phải bác sĩ. |
| D3 · Rời giường | M4-20, M4-30, M4-31 | `env · chạm` Bàn chân bạn chạm nền gạch. Dưới gầm giường có rất nhiều bàn tay đang chờ. | `violates: [L3]` | [k4] | Đèn đã tắt. Không có cháy, và người mặc áo blouse không phải bác sĩ: bác sĩ Thanh đã nói đêm nay chỉ có một bác sĩ trực. |

## Kiểm tra nhanh

- Mức mất tối đa là 4 (c2, c3, M4-10, M4-13).
- Bản méo L2 ở M4-10 chỉ xuất hiện khi đã chọn cả c2 lẫn c3. Bản méo L3 ở M4-20 cũng cần cả c2 và c3.
- Test cần có: đường sống qua M4-31 và qua M4-32 trực tiếp; đường sống qua M4-20b; D1; D2 từ M4-12 và M4-12b; D3 từ M4-20, M4-30, M4-31; dòng có điều kiện `giau_thuoc` ở M4-12; hai bản méo.
