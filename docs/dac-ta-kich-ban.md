# Đặc tả kịch bản

Quy ước chung để Claude Code dựng engine và nạp kịch bản. Mỗi màn là một file dữ liệu theo đúng cấu trúc dưới đây; engine không chứa nội dung màn nào.

## 1. Kênh hiển thị chữ (thay cho âm thanh)

Game không dùng file âm thanh. Mọi thứ người chơi "nghe" được viết thành một dòng chữ thuộc một kênh cố định, và engine hiển thị mỗi kênh một kiểu riêng.

| Kênh | Dùng cho | Trường | Hiển thị |
| --- | --- | --- | --- |
| `narration` | Lời dẫn, ngôi thứ hai ("bạn") | `text` | Chữ thường |
| `env` | Điều nhìn, ngửi, chạm thấy | `sense` (nhìn / ngửi / chạm), `text` | Chữ nghiêng, màu xám; tiền tố nhỏ theo `sense` |
| `sound` | Mọi tiếng động | `src` (vị trí nguồn), `vol` (1–3), `text` | Tiền tố `[Âm thanh · <src>]`; cỡ chữ theo `vol`; gõ chữ chậm hơn các kênh khác |
| `npc` | Lời thoại | `who` (id NPC), `tone` (`normal` thường / `whisper` thì thầm / `shout` hét), `text` | Tên NPC in đậm; `whisper` = chữ nhỏ, mờ; `shout` = chữ in hoa |
| `bloodtext` | Huyết tự | `lines[]` | Chữ đỏ `#ff5a52` (đạt ≥ 4.5:1 trên nền tối nhất của UI; không dùng `#8a0b0b`, màu đó chỉ dành cho ảnh), hiện từng chữ; luôn mở lại được |
| `system` | Thông báo cơ chế | `text` | Khung riêng, ví dụ "Tỉnh táo −1" |

Quy tắc viết kênh `sound`:

- Mỗi dòng gồm **tượng thanh + nguồn + vị trí**: "Cộc. Cộc. Cộc. — ba tiếng gõ vào song sắt, từ cuối hành lang." Không viết "bạn nghe thấy tiếng động lạ".
- `vol` 1 = phải để ý mới thấy, thường chứa manh mối; `vol` 2 = rõ ràng; `vol` 3 = dồn dập, đe doạ.
- Được chèn biến trạng thái vào chữ, ví dụ `{following}` cho số người đang đi theo.
- Khi người chơi nhắm mắt (cờ `eyes_closed`), engine ẩn mọi dòng `env` có `sense: nhìn`; chỉ còn `sound`, `npc`, `narration`, `env` ngửi/chạm.

## 2. Trạng thái game

Engine giữ các biến sau trong một màn; khi sang màn mới chỉ giữ lại `sanity` và hồ sơ đã mở khoá.

| Biến | Kiểu | Giá trị đầu | Ý nghĩa |
| --- | --- | --- | --- |
| `sanity` | số nguyên 0–5 | 5 | Tỉnh táo; ≤ 2 thì Huyết tự bị bóp méo, = 0 thì chuyển tới node `on_sanity_zero` của màn |
| `flags` | tập chuỗi | rỗng | Cờ sự kiện, ví dụ `na_moi_tron` |
| `clues` | tập chuỗi | rỗng | Manh mối đã thấy, ví dụ `c1` |
| `actions_left` | số nguyên | theo màn | Số lượt hành động còn lại trong pha quan sát |
| `role` | `none` / `seeker` / `hider` | `none` | Vai của người chơi |
| `npc.<id>` | `{alive, found, following}` | theo màn | Trạng thái từng NPC |
| `following` | số nguyên | 0 | Số NPC đang đi theo người chơi |
| `visited` | tập chuỗi | rỗng | Các địa điểm đã đến trong một hub |
| `time` | chuỗi "HH:MM" | theo màn | Giờ trong game, chỉ để hiển thị |
| `highlights` | danh sách id từ khoá | rỗng | Tối đa 3 cụm từ đã đánh dấu |
| `eyes_closed` | bool | false | Ẩn các dòng `env` thị giác |
| `spot` | chuỗi | rỗng | Chỗ trốn đã chọn (nhánh trốn) |

## 3. Cấu trúc node và định dạng file

Mỗi màn là một file YAML: phần đầu khai báo luật và trạng thái, phần `nodes` là đồ thị cảnh. Kịch bản viết trong các tab màn chơi dùng cùng ký hiệu, nên chuyển sang YAML theo đúng một-đối-một.

```yaml
level: m1
title: "Trốn tìm"
start: m1_n01
on_sanity_zero: m1_d6              # tuỳ chọn; node chuyển tới khi sanity = 0
init: {sanity: 5, actions_left: 3, time: "23:59"}
bloodtext:
  - {id: L1, text: "Tất cả những ai đang ở trong phòng này phải chơi trốn tìm."}
keywords:                          # cụm từ được phép đánh dấu
  - {id: k4, line: L4, text: "bị quỷ tìm thấy", correct: true}
distortions:                       # bản méo khi sanity <= 2
  - {line: L4, unless_highlighted: k4, text: "Kẻ nào đi tìm sẽ chết."}
npcs:
  - {id: anh_khai, name: "Anh Khải"}
nodes:
  - id: m1_n02
    type: scene                    # scene | ending
    lines:
      - {ch: sound, src: "bức tường đối diện", vol: 2, text: "Sột… soạt…"}
      - {ch: npc, who: be_na, tone: whisper, text: "Em sợ…"}
      - {ch: narration, text: "…", if: {clue: c1}}   # dòng có điều kiện
    effects: [{sanity: -1}, {flag: saw_bloodtext}]
    choices:
      - {text: "Tôi sẽ đi tìm.", goto: m1_n21, effects: [{role: seeker}]}
      - {text: "Nắm tay bé Na", goto: m1_n30, if: {flag: na_moi_tron}}
    next: m1_n03                   # dùng khi không có choices
  - id: m1_d4
    type: ending
    result: death                  # death | survive
    cause: "Đổi lượt"
    reveal: "Đổi lượt nghĩa là trở thành người trốn."
```

Quy ước:

- `id` node theo dạng `m<màn>_n<số>`; kết cục dùng `m<màn>_e<số>` (sống) và `m<màn>_d<số>` (chết). Trong tab kịch bản, M1-05 tương ứng `m1_n05`, D4 tương ứng `m1_d4`.
- `on_sanity_zero` là tuỳ chọn. Màn không khai báo mà `sanity` về 0 là lỗi.
- Điều kiện `if` hỗ trợ: `clue`, `flag`, `not_flag`, `role`, `sanity_lte`, `visited_count_gte`, `not_visited`, `not_highlighted`.
- Hiệu ứng `effects` hỗ trợ: `sanity` (cộng/trừ), `flag`, `clue`, `role`, `spot`, `found` (đánh dấu NPC đã bị tìm và tăng `following`), `actions_left`, `time`, `visit`, `eyes_closed`.
- Hub là node có `hub: true`: lựa chọn đã chọn sẽ bị ẩn, và engine tự chuyển tới `hub_exit` khi điều kiện `hub_done` đúng.

## 4. Cơ chế toàn cục

1. **Luật tối thượng:** vi phạm bất kỳ dòng Huyết tự nào đều dẫn tới một kết cục chết. Mỗi màn phải khai báo node chết cho từng dòng có thể bị vi phạm.
2. **Đọc lại Huyết tự:** nút "Huyết tự" luôn hiển thị. Khi `sanity` ≥ 3, hiện bản gốc. Khi `sanity` ≤ 2, dòng nào có `distortions` và chưa được đánh dấu thì hiện bản méo; bản méo không có dấu hiệu gì khác bản thật.
3. **Đánh dấu từ khoá:** mở sau khi node có `highlight: true` hiện hết các dòng (đặt ở node Huyết tự xuất hiện lần đầu). Người chơi chạm vào tối đa 3 cụm trong danh sách `keywords`; có thể bỏ qua. Cụm đã đánh dấu được gạch chân vĩnh viễn và không bao giờ bị bóp méo.
4. **Tỉnh táo:** thanh 5 nấc ở góc màn hình. Mỗi lần thay đổi, kênh `system` báo "Tỉnh táo −1". Khi về 0, engine chuyển tới `on_sanity_zero`.
5. **Màn hình chết:** hiện dòng cuối của kết cục, sau đó hiện lại Huyết tự với cụm sinh lộ được tô sáng và câu `reveal`. Có nút "Chơi lại".
6. **Chơi lại:** quay về node `start` với trạng thái `init` và `sanity` đầu màn. Các biến thể Huyết tự (nếu màn có) được xoay vòng theo số lần chết.
7. **Hoàn thành màn:** màn hình kết quả liệt kê từ khoá đã đánh dấu đúng/sai và hồ sơ được mở khoá, rồi về hub.

## 5. Lớp hình ảnh

Mỗi địa điểm có một ảnh nền pixel; ánh sáng do engine phủ lên, không cần vẽ thêm. Chữ vẫn là nơi chứa gameplay, còn hình chỉ tạo không khí.

### Trường `scene` trong node

```yaml
- id: m1_n04
  scene: {bg: phong_sinh_hoat, light: flicker}
- id: m1_n60
  scene: {light: dark}            # chỉ đổi ánh sáng, giữ bg cũ
- id: m1_n31
  scene:                          # dạng danh sách: lấy mục đầu tiên có if đúng
    - {if: {spot: tu_go}, light: dark}
    - {if: {spot: wc}, bg: nha_ve_sinh_chung, light: flicker}
    - {bg: san_phoi, light: normal}
```

- Node không có `scene` thì giữ nguyên cảnh trước đó. Node có `scene` chỉ ghi đè các trường được nêu.
- Điều kiện `spot` được thêm vào danh sách điều kiện `if` của mục 3.
- Ending chết mặc định nền đen; ending có thể khai báo `scene` riêng.
- State thêm biến `scene: {bg, light}`, giá trị đầu lấy từ node `start`.

### Trạng thái ánh sáng

| `light` | Cách engine hiển thị |
| --- | --- |
| `normal` | Ảnh gốc |
| `flicker` | Lớp phủ đen, độ mờ dao động 30–60%, tối đa 2 lần đổi mỗi giây; với `prefers-reduced-motion` thì đứng yên ở 40% |
| `dark` | Màn hình đen, không vẽ ảnh nền |
| `dawn` | Lớp phủ xanh xám nhạt, độ mờ 25% |

Khi `eyes_closed` là true, màn hình luôn đen, bất kể `scene`.

### Quy cách ảnh

- PNG, **320×180 px**, không khử răng cưa. Phóng to theo bội số nguyên với `image-rendering: pixelated`.
- Chỉ dùng 16 màu của bảng màu chung bên dưới. Màu đỏ máu `#8a0b0b` chỉ dành cho máu và Huyết tự.
- Đặt file tại `public/bg/<id>.png`. Mỗi ảnh khai báo trong `content/assets.yaml`: `{id, file, alt, clue?, placeholder?}`.
- Khi chưa có ảnh thật, đặt `placeholder: true`; engine vẽ nền gradient tối kèm tên `id`.

| Màu | Hex | Dùng cho |
| --- | --- | --- |
| Đen sâu | `#0b0b0d` | Bóng tối, viền |
| Bóng tối | `#1c1b22` | Góc khuất |
| Xám tối | `#2e2c35` | Tường trong tối |
| Xám tường | `#4a4651` | Tường bóng râm |
| Vôi cũ | `#7a7266` | Tường ố |
| Vôi vàng | `#b8a77a` | Tường vôi |
| Vôi sáng | `#d9cfa8` | Tường dưới đèn |
| Xanh cửa | `#3f5a4c` | Cửa gỗ sơn xanh |
| Xanh cửa nhạt | `#5f7d6b` | Cửa dưới đèn |
| Gạch sẫm | `#6b2f26` | Gạch hoa trong tối |
| Gạch hoa | `#9a4a3a` | Gạch hoa |
| Gỗ nâu | `#4b3a2a` | Tủ, khung ảnh, đồng hồ |
| Đèn tuýp | `#c9c3b0` | Vùng sáng |
| Trắng đèn | `#e8e6dc` | Bóng đèn, điểm sáng |
| Xanh đêm | `#2b3b4a` | Trời đêm, sân phơi |
| Đỏ máu | `#8a0b0b` | Chỉ cho máu và Huyết tự |

### Quy tắc nội dung hình

1. **Không vẽ người.** Chọn góc nhìn sao cho chỗ NPC đứng nằm ngoài khung hoặc chìm trong vùng tối.
2. Ảnh không được chứa thông tin mà kịch bản không có. Một chi tiết hình là manh mối thì ảnh đó phải khai báo `clue`.
3. Ảnh có `clue` chỉ được dùng ở node có hiệu ứng thêm đúng clue đó, hoặc ở ending. Validator kiểm tra điều này.
4. `alt` mô tả ảnh trong một câu, không nhắc chi tiết manh mối mà dòng chữ của node chưa nói.
