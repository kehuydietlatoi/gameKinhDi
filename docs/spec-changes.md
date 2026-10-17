# Bổ sung đặc tả

Mỗi mục ghi: ngày, màn/node cần nó, nội dung bổ sung, ví dụ YAML. Các mục G1–G22 được duyệt ngày 2026-10-17 khi lập kế hoạch màn 1.

## Sửa trực tiếp `docs/` (được duyệt một lần, 2026-10-17)

| File | Chỗ sửa | Lý do |
| --- | --- | --- |
| `docs/man-1-tron-tim.md` | Lựa chọn "Mở mắt…" ở M1-40 và M1-41 thêm hiệu ứng `eyes_closed` false | Nếu không, dòng `env · nhìn` duy nhất của D3 bị ẩn vì người chơi vẫn đang nhắm mắt |
| `docs/man-1-tron-tim.md` | Brief `bang_tin_cao_pho_7`: bỏ cụm "ánh sáng sớm hơn" | Trái AGENTS 8.7 (không vẽ biến thể ánh sáng); ánh sáng do lớp `dawn` lo |
| `docs/dac-ta-kich-ban.md` | Mục 1: `tone` dùng `normal` / `whisper` / `shout` | Bảng kênh và ví dụ YAML lệch nhau |
| `docs/dac-ta-kich-ban.md` | Mục 1: chữ `bloodtext` màu `#ff5a52` | `#8a0b0b` trên `#0b0b0d` chỉ đạt 2.00:1; `#ff5a52` đạt 6.40:1 (5.56:1 trên `#1c1b22`) |
| `docs/dac-ta-kich-ban.md` | Mục 3: `on_sanity_zero` tuỳ chọn, ví dụ đổi id thành `m1_d6` | Id cũ `m1_d_sanity` sai quy ước; màn 1 không cần trường này |
| `docs/dac-ta-kich-ban.md` | Mục 4.3: giao diện đánh dấu mở ở node `highlight: true` | Thống nhất với kịch bản M1-02 (xem G14) |
| `AGENTS.md` | Mục 8.2 và 9: `#8a0b0b` chỉ cho ảnh, chữ Huyết tự dùng `#ff5a52` | Như trên |

## G1 · Hub nhớ lựa chọn đã chọn

- **Ngày:** 2026-10-17
- **Cần cho:** M1-04, M1-50
- **Bổ sung:** khi người chơi chọn một lựa chọn trong hub, engine tự thêm `goto` của lựa chọn đó vào `visited`. Lựa chọn có `goto` đã nằm trong `visited` bị ẩn. Điều kiện `visited_count_gte` chỉ đếm những phần tử của `visited` là `goto` của các lựa chọn thuộc hub hiện tại; nhờ vậy lượt quan sát ở M1-04 không bị tính vào M1-50. `not_visited` nhận id node. Hiệu ứng `visit` vẫn dùng được để ghi tay một id vào `visited`.

```yaml
- id: m1_n50
  type: scene
  hub: true
  hub_done: {visited_count_gte: 4}   # chỉ đếm m1_n51..m1_n54
  hub_exit: m1_n60
```

## G2 · Điều kiện kiểu số

- **Ngày:** 2026-10-17
- **Cần cho:** M1-04 (`actions_left` = 0), M1-50 (dòng theo `following`)
- **Bổ sung:** thêm điều kiện `actions_left_lte`, `following_lte`, `following_gte` (số nguyên), cùng kiểu với `sanity_lte`.

```yaml
hub_done: {actions_left_lte: 0}
lines:
  - {ch: sound, src: "sau lưng", vol: 1, if: {following_lte: 0}, text: "…"}
  - {ch: sound, src: "sau lưng", vol: 1, if: {following_gte: 1}, text: "…"}
```

## G3 · Quay về hub ghi tường minh

- **Ngày:** 2026-10-17
- **Cần cho:** M1-05 … M1-10 (kịch bản chỉ ghi "xong quay về M1-04" ở mô tả hub)
- **Bổ sung:** không thêm cơ chế. Node con của hub ghi `next` trỏ về hub.

```yaml
- id: m1_n05
  type: scene
  next: m1_n04
```

## G4 · Vào hub và thoát hub

- **Ngày:** 2026-10-17
- **Cần cho:** M1-04 → M1-20, M1-50 → M1-60
- **Bổ sung:** khi vào node hub, engine làm theo thứ tự ở G13 (áp `scene`, hiệu ứng, rồi hiện `lines`). Sau đó, nếu `hub_done` đúng, mọi lựa chọn được thay bằng một nút "Tiếp" duy nhất dẫn tới `hub_exit`; chữ "Tiếp" là chuỗi UI trong `src/ui/strings.ts`. Vì `scene` của hub luôn được áp, node sau `hub_exit` không kế thừa ảnh có clue của node con (ví dụ M1-20 không giữ `bang_tin_cao_pho`). Node hub bắt buộc có `hub_done`, `hub_exit` và `choices`; không có `next`.

```yaml
- id: m1_n04
  type: scene
  hub: true
  hub_done: {actions_left_lte: 0}
  hub_exit: m1_n20
  scene: {bg: phong_sinh_hoat, light: flicker}
  choices:
    - {text: "Xem bảng tin tổ dân phố", goto: m1_n05, effects: [{actions_left: -1}]}
```

## G5 · Dòng của hub hiện ở mọi lần vào

- **Ngày:** 2026-10-17
- **Cần cho:** M1-50
- **Bổ sung:** `lines` của hub hiện ở mọi lần vào, kể cả lần đầu. Dòng `following` = 0 chỉ có thể xuất hiện ở lần vào đầu tiên (từ M1-42), vì mọi nơi quay về được đều tăng `following`.

## G6 · Thời gian cộng dồn; `actions_left` là cộng/trừ

- **Ngày:** 2026-10-17
- **Cần cho:** M1-50 ("mỗi lần `time` +1 giờ"), M1-04 (`actions_left −1`)
- **Bổ sung:** hiệu ứng mới `time_add` (số phút, cộng vào `time`, quay vòng qua 24:00). Hiệu ứng `time` vẫn đặt giá trị tuyệt đối. Hiệu ứng `actions_left` là cộng/trừ, giống `sanity`.

```yaml
choices:
  - {text: "Hành lang tầng 2", goto: m1_n51, effects: [{time_add: 60}]}
```

## G7 · Biểu thức trong chuỗi

- **Ngày:** 2026-10-17
- **Cần cho:** M1-50 (`{following + 2}`)
- **Bổ sung:** trong `text` chỉ cho hai dạng `{var}` và `{var + n}` / `{var - n}` (n nguyên dương). Biến được dùng: `following`, `sanity`, `actions_left`. Dạng khác là lỗi validate.

```yaml
text: "Sau lưng bạn có {following} người. Bạn nghe thấy {following + 2} tiếng bước chân."
```

## G8 · NPC nhóm và chú thích lời thoại

- **Ngày:** 2026-10-17
- **Cần cho:** D2, D5 (`npc · tất cả · thì thầm`), D2 "(sáu giọng cùng lúc, sát bên tai)"
- **Bổ sung:** NPC có thể khai báo `group: true` (một nhóm người nói cùng lúc, không có trạng thái `found`). Dòng `npc` có trường tuỳ chọn `note`, hiển thị như chú thích nhỏ sau lời thoại.

```yaml
npcs:
  - {id: tat_ca, name: "Tất cả", group: true}
# m1_d2
lines:
  - {ch: npc, who: tat_ca, tone: whisper, text: "Tìm thấy rồi.", note: "sáu giọng cùng lúc, sát bên tai"}
```

## G9 · Dạng dòng `bloodtext`

- **Ngày:** 2026-10-17
- **Cần cho:** M1-02 (L1–L5), M1-41, M1-53, D1 ("Dòng L1 đỏ rực lên")
- **Bổ sung:** `lines` là danh sách id dòng Huyết tự; engine lấy chữ từ khai báo `bloodtext` của màn và tự áp bản méo khi hiển thị. Trường tuỳ chọn `style: glow` hiển thị một vầng sáng tĩnh, không nhấp nháy.

```yaml
- {ch: bloodtext, lines: [L1, L2, L3, L4, L5]}   # m1_n02
- {ch: bloodtext, lines: [L1], style: glow}       # m1_d1
```

## G10 · Nhiều khoá trong một `if` nghĩa là AND

- **Ngày:** 2026-10-17
- **Cần cho:** M1-41, M1-53 ("sanity ≤ 2 và chưa đánh dấu k3/k4")
- **Bổ sung:** một object `if` có nhiều khoá thì mọi khoá phải đúng. `if` rỗng là lỗi.

```yaml
- {ch: bloodtext, lines: [L3], if: {sanity_lte: 2, not_highlighted: k3}}
```

## G11 · Giá trị liệt kê và chữ của lựa chọn

- **Ngày:** 2026-10-17
- **Cần cho:** mọi dòng `npc`, `env`; M1-20, M1-53, M1-60
- **Bổ sung:** `tone: normal | whisper | shout` (mặc định `normal`); `sense: nhìn | ngửi | chạm`. Chữ của lựa chọn giữ nguyên dấu ngoặc kép như trong kịch bản.

```yaml
- {text: "\"Tôi sẽ đi tìm.\"", goto: m1_n21}
```

## G12 · Bỏ qua lựa chọn khi đã có chỗ trốn

- **Ngày:** 2026-10-17
- **Cần cho:** M1-30 ("Nếu `spot` đã có thì bỏ qua lựa chọn, đi thẳng M1-31")
- **Bổ sung:** điều kiện mới `has_spot` (bool). Node được có cả `choices` và `next`: nếu không lựa chọn nào hiện, engine đi theo `next`. Node không có lựa chọn nào hiện và không có `next` là lỗi engine.

```yaml
choices:
  - {text: "Tủ gỗ dưới gầm cầu thang", goto: m1_n31, effects: [{spot: tu_go}], if: {has_spot: false}}
next: m1_n31
```

## G13 · Thứ tự xử lý khi chuyển node

- **Ngày:** 2026-10-17
- **Cần cho:** M1-40, M1-42, M1-61, M1-63 (`eyes_closed` phải đổi trước dòng `env · nhìn`), M1-41 (điều kiện `sanity` cần hiệu ứng của M1-40)
- **Bổ sung:** hiệu ứng của lựa chọn → vào node → áp `scene` → hiệu ứng của node (theo thứ tự trong danh sách) → xét `if` của từng dòng → hiện các dòng → hiện thông báo Tỉnh táo → nếu `sanity` = 0 thì chuyển tới `on_sanity_zero`. `sanity` bị kẹp trong 0–5.
- **Chi tiết cài đặt:** khi `sanity` = 0 ở một node scene, các dòng của node vẫn hiện, rồi mọi lựa chọn được thay bằng một nút "Tiếp" dẫn tới `on_sanity_zero` (cùng cách với hub ở G4). Thông báo "Tỉnh táo" chỉ sinh ra khi giá trị thật sự đổi (đã kẹp). Kết cục chết không khai báo `scene` thì nền đen; kết cục sống giữ cảnh trước đó.

## G14 · Giao diện đánh dấu từ khoá

- **Ngày:** 2026-10-17
- **Cần cho:** M1-02 ("Mở giao diện đánh dấu (k1–k6), cho phép bỏ qua")
- **Bổ sung:** trường node `highlight: true`: sau khi các dòng của node hiện hết, mở giao diện đánh dấu (tối đa 3 cụm, có thể bỏ qua). Mỗi lượt chơi chỉ đánh dấu một lần; Chơi lại xoá các cụm đã đánh dấu (về `init`). Nút "Huyết tự" luôn hiện nhưng bị khoá cho tới khi dòng `bloodtext` đầu tiên của màn xuất hiện.

```yaml
- id: m1_n02
  type: scene
  highlight: true
```

## G15 · Khai báo manh mối

- **Ngày:** 2026-10-17
- **Cần cho:** M1-05 … M1-10, M1-20, E1; validator (AGENTS 11)
- **Bổ sung:** cấp màn có danh sách `clues` gồm id. Không thêm chữ mô tả.

```yaml
clues: [c1, c2, c3, c4, c5, c6]
```

## G16 · Gắn dòng Huyết tự với kết cục chết

> Đã sửa bởi G44: kết cục chết không còn bắt buộc có `violates` hoặc `consequence_of`.

- **Ngày:** 2026-10-17
- **Cần cho:** D1–D5; validator (AGENTS 6.5)
- **Bổ sung:** dòng Huyết tự có `violable` (mặc định `true`). Ending chết khai báo `violates` (vi phạm dòng đó) hoặc `consequence_of` (chết vì hệ quả của dòng đó), ít nhất một trong hai. Ending sống không có hai trường này. Validator đòi mỗi dòng `violable` có ít nhất một ending chết `violates` nó.

```yaml
bloodtext:
  - {id: L1, text: "…"}
  - {id: L2, text: "…", violable: false}
nodes:
  - {id: m1_d1, type: ending, result: death, cause: "Từ chối chơi", violates: [L1], reveal: "…"}
  - {id: m1_d2, type: ending, result: death, cause: "Bị tìm thấy", consequence_of: [L4], reveal: "…"}
```

Màn 1: D1 `violates: [L1]`, D3 `violates: [L3]`; D2, D4, D5 `consequence_of: [L4]`; L2, L4, L5 `violable: false`.

## G17 · Cụm sinh lộ tô sáng trên màn hình chết

- **Ngày:** 2026-10-17
- **Cần cho:** mọi ending (kịch bản: "Huyết tự với cụm sinh lộ (k4) được tô sáng")
- **Bổ sung:** cấp màn có `solution`: danh sách id từ khoá hoặc id dòng Huyết tự. Ending được ghi đè bằng `solution` riêng. Id từ khoá thì tô cụm đó; id dòng thì tô cả dòng.

```yaml
solution: [k4]
nodes:
  - {id: m1_d1, type: ending, solution: [L1]}
  - {id: m1_d3, type: ending, solution: [k3]}
```

## G18 · Hồ sơ mở khoá

- **Ngày:** 2026-10-17
- **Cần cho:** E1 ("Nếu có clue c1: mở khoá hồ sơ 'Vụ cháy nhà C4, 1986'")
- **Bổ sung:** cấp màn khai báo `dossiers` (`id`, `title`; không có nội dung). Ending có `unlock`: danh sách `{dossier, if?}`. Hồ sơ đã mở được lưu trong save và giữ qua các màn.

```yaml
dossiers:
  - {id: hs_chay_c4_1986, title: "Vụ cháy nhà C4, 1986"}
nodes:
  - id: m1_e1
    type: ending
    result: survive
    unlock: [{dossier: hs_chay_c4_1986, if: {clue: c1}}]
```

## G19 · `on_sanity_zero` tuỳ chọn

- **Ngày:** 2026-10-17
- **Cần cho:** màn 1 (Tỉnh táo thấp nhất là 1)
- **Bổ sung:** trường tuỳ chọn. Màn không khai báo mà `sanity` về 0 thì engine ném lỗi (test sẽ bắt được).

## G20 · Trạng thái NPC

- **Ngày:** 2026-10-17
- **Cần cho:** M1-51, M1-52b, M1-53b, M1-54, M1-62 (hiệu ứng `found`), M1-50 (`{following}`)
- **Bổ sung:** mọi NPC không phải nhóm bắt đầu với `{alive: true, found: false, following: false}`. `found: <id>` đặt `found` và `following` của NPC đó thành true; gọi lại lần nữa không đổi gì. `following` toàn cục được tính bằng số NPC có `following: true`, không lưu riêng.

## G21 · `alt` và ảnh placeholder

- **Ngày:** 2026-10-17
- **Cần cho:** 8 ảnh màn 1
- **Bổ sung:** `alt` bắt buộc, một câu, viết từ cột "Góc nhìn và nội dung" của brief, không nhắc chi tiết manh mối. Ảnh `placeholder: true` không bắt buộc có `file`, và validator không kiểm tra file của nó. Ảnh không phải placeholder bắt buộc có `file`.

```yaml
assets:
  - {id: phong_sinh_hoat, alt: "…", placeholder: true}
  - {id: bang_tin_cao_pho, file: bg/bang_tin_cao_pho.png, alt: "…", clue: c1}
```

## G22 · Validator kiểm tra ảnh có clue theo cảnh thực tế

- **Ngày:** 2026-10-17
- **Cần cho:** AGENTS 8.5; M1-05, M1-06, E1
- **Bổ sung:** node không có `scene` kế thừa cảnh của node trước, nên validator lan cảnh theo đồ thị (mọi cạnh `goto`/`next`/`hub_exit`, bỏ qua `if`). Một node scene mà cảnh thực tế có thể dùng ảnh mang `clue` X thì node đó phải có hiệu ứng thêm X. Ending không bị kiểm tra; ending chết không khai báo `scene` thì nền đen.

## V1 · Quy tắc validator bổ sung

- **Ngày:** 2026-10-17
- **Cần cho:** bắt lỗi gõ nhầm trong mọi màn (AGENTS.md 5.5: không bỏ qua âm thầm)
- **Bổ sung:** ngoài các mục ở AGENTS.md 8.9 và 11, validator còn báo lỗi khi:
  - `flag`/`not_flag` trong điều kiện dùng một cờ mà không hiệu ứng `flag` nào bật; `spot` trong điều kiện dùng giá trị mà không hiệu ứng `spot` nào đặt;
  - `keywords[].text` không có nguyên văn trong dòng của nó; `distortions[].unless_highlighted` thuộc dòng khác; một dòng có hai bản méo;
  - hai lựa chọn của hub trùng `goto` (G1); (quy tắc "hai lựa chọn trùng chữ" ban đầu đã đổi thành cảnh báo, xem G31);
  - `visited_count_gte` dùng ngoài node hub (G1);
  - node `highlight: true` không có dòng `bloodtext`; màn có từ khoá mà không node nào `highlight: true`;
  - `found` trỏ tới NPC nhóm; `on_sanity_zero` không trỏ tới kết cục chết;
  - tên file màn khác `<level>.yaml`; `file` của ảnh khác `bg/<id>.png`; `clue` của ảnh không được màn nào khai báo; ảnh có điểm ảnh không đục hoàn toàn.
- Ảnh khai báo mà chưa node nào dùng chỉ là cảnh báo.

## G23 · Tỉnh táo về `init` ở đầu mỗi màn

- **Ngày:** 2026-10-17
- **Cần cho:** màn 2 ("Yêu cầu với engine" mục 1); mọi màn sau
- **Bổ sung:** thay quy tắc "khi sang màn mới chỉ giữ lại `sanity`" ở mục 2 của đặc tả. Mỗi màn bắt đầu với `sanity` lấy từ `init` của màn đó; Chơi lại cũng vậy. Khi sang màn mới chỉ mang theo hồ sơ đã mở khoá (G18). `GameState` bỏ trường `entrySanity`; bản lưu `sinhlo.save.v1` cũ vẫn đọc được (trường thừa bị bỏ qua) nên không tăng phiên bản.

```yaml
init: {sanity: 5, actions_left: 2, time: "22:00"}   # m2: luôn bắt đầu ở 5
```

## G24 · Ẩn giờ khi nhắm mắt

- **Ngày:** 2026-10-17
- **Cần cho:** màn 2 (mục 2), cũng áp dụng cho M1-40, M1-41, M1-61
- **Bổ sung:** khi `eyes_closed` là true, thanh trên cùng không hiện giờ. State vẫn giữ và cập nhật `time`. Không cần khai báo gì trong YAML.

## G25 · Hai NPC khác `id` được cùng tên hiển thị

- **Ngày:** 2026-10-17
- **Cần cho:** màn 2 (mục 3): `anh_phong` và `phong_gia` đều là "Anh Phong"
- **Bổ sung:** chỉ `id` NPC phải duy nhất; `name` được trùng. Người chơi phân biệt qua chữ của dòng thoại.

```yaml
npcs:
  - {id: anh_phong, name: "Anh Phong"}
  - {id: phong_gia, name: "Anh Phong"}
```

## G26 · `on_sanity_zero` trỏ tới node thường

- **Ngày:** 2026-10-17
- **Cần cho:** màn 2 (mục 4): `on_sanity_zero: m2_n90`, M2-90 → D4
- **Bổ sung:** `on_sanity_zero` trỏ tới node bất kỳ trừ `start`. Như G13: khi `sanity` = 0, node hiện tại vẫn hiện hết dòng rồi chỉ còn nút "Tiếp" tới `on_sanity_zero`. Engine ghi `on_sanity_zero` vào `visited` khi vào, và chỉ chuyển hướng khi node đó chưa có trong `visited`; vì vậy từ M2-90 trở đi game đi theo `next`/lựa chọn bình thường dù `sanity` vẫn là 0. Validator coi `on_sanity_zero` tới được từ mọi node, nên nếu node đó không khai báo `scene` thì nó không được kế thừa ảnh có clue (G22).

```yaml
on_sanity_zero: m2_n90
nodes:
  - id: m2_n90
    type: scene
    effects: [{eyes_closed: false}]
    next: m2_d4
```

## G27 · Điều kiện `has_dossier`

- **Ngày:** 2026-10-17
- **Cần cho:** M3-12 (màn 3 mục 1)
- **Bổ sung:** điều kiện mới `has_dossier: <id hồ sơ>`, đúng khi hồ sơ đó đã mở khoá, kể cả ở màn trước. Validator chấp nhận id hồ sơ khai báo ở bất kỳ màn nào.

```yaml
- {ch: narration, if: {has_dossier: hs_chay_c4_1986}, text: "Những cái tên này bạn đã từng gặp. Trên một tờ cáo phó."}
```

## G28 · Một màn có nhiều kết cục sống

- **Ngày:** 2026-10-17
- **Cần cho:** màn 3 (mục 2): E1 và E2
- **Bổ sung:** không đổi schema (đã cho phép). Màn hình hoàn thành màn lấy tiêu đề là `cause` của kết cục đạt được (ví dụ "Không ai chết" hay "Có người chết thay"), và hiện Huyết tự với cụm `solution` của kết cục đó, giống màn hình chết.

## G29 · Kết cục sống được có `consequence_of`

- **Ngày:** 2026-10-17
- **Cần cho:** M3 E2 (màn 3 mục 3)
- **Bổ sung:** ending `result: survive` được khai báo `consequence_of`; vẫn không được có `violates`.

```yaml
- {id: m3_e2, type: ending, result: survive, cause: "Có người chết thay", consequence_of: [L4], solution: [k1, k4], reveal: "…"}
```

## G30 · NPC chỉ được nhắc tên

- **Ngày:** 2026-10-17
- **Cần cho:** M3-33 (màn 3 mục 4): `bac_tam`, `be_na` mỗi người một câu
- **Bổ sung:** không cần cơ chế mới. Mỗi màn tự khai báo trong `npcs` mọi NPC mà dòng `npc` tham chiếu, dùng lại `id` của màn trước. Trạng thái `found`/`following` của họ không được dùng.

```yaml
npcs:
  - {id: bac_tam, name: "Bác Tâm"}
  - {id: be_na, name: "Bé Na"}
```

## G31 · Nhiều lựa chọn cùng chữ, điều kiện loại trừ nhau

- **Ngày:** 2026-10-17
- **Cần cho:** M3-31, M3-33, M3-40 (màn 3 mục 5)
- **Bổ sung:** hai lựa chọn trong một node được trùng chữ. Validator chỉ **cảnh báo** (không chặn) khi hai lựa chọn cùng chữ có thể cùng hiện. Hai điều kiện được coi là loại trừ nhau khi: một bên `flag: x`, bên kia `not_flag: x`; hoặc `spot` khác nhau; hoặc `has_spot` ngược nhau (hay `has_spot: false` với `spot`); hoặc `role` khác nhau. Trường hợp khác coi như có thể cùng hiện. Quy tắc V1 "hai lựa chọn trùng chữ là lỗi" bỏ.

```yaml
choices:
  - {text: "Đặt hình nhân ở ngưỡng cửa rồi buông tay", goto: m3_n32, if: {flag: khong_ten}}
  - {text: "Đặt hình nhân ở ngưỡng cửa rồi buông tay", goto: m3_n33, if: {not_flag: khong_ten}}
```

## G32 · Ảnh có `clue` ghi màn sở hữu manh mối

> Đã thay bằng G43 (theo yêu cầu của `docs/man-9-nguoi-dan-ba-khong-mat.md`): cú pháp `clue: m3:c1`, bỏ trường `level`, và ở màn khác ảnh được dùng tự do.

- **Ngày:** 2026-10-17
- **Cần cho:** `ban_tho_chieu_nghi` (`c1` của màn 3) trong khi `bang_tin_cao_pho` mang `c1` của màn 1; id manh mối chỉ duy nhất trong một màn còn `assets.yaml` dùng chung
- **Bổ sung:** ảnh có `clue` bắt buộc có `level`. Trong màn đó, quy tắc G22 áp như cũ; ở màn khác, ảnh ấy chỉ được dùng ở ending. Validator kiểm tra màn `level` tồn tại và có khai báo manh mối đó. Ba ảnh có clue của màn 1 đã thêm `level: m1`.

```yaml
- {id: ban_tho_chieu_nghi, file: bg/ban_tho_chieu_nghi.png, alt: "…", clue: c1, level: m3}
```

## G33 · Chuyển sang màn tiếp theo

- **Ngày:** 2026-10-17
- **Cần cho:** M3-12 (`has_dossier` cần hồ sơ mở khoá ở màn 1 trong cùng lượt chơi); mục 4.7 của đặc tả nói "rồi về hub" nhưng hub căn hộ chưa có
- **Bổ sung:** cho tới khi có hub, màn hình hoàn thành màn có nút "Màn tiếp theo" (khi còn màn) bên cạnh "Chơi lại". Thứ tự màn theo số trong `level` (m1, m2, m3, …); UI nạp mọi `content/m*.yaml`. Sang màn mới: `initialState` của màn đó, mang theo hồ sơ đã mở khoá (G18), số lần chết về 0, Tỉnh táo theo G23. Bản lưu ghi `state.level` nên tải lại trang vẫn ở đúng màn.

## G34 · Chọn màn

- **Ngày:** 2026-10-17
- **Cần cho:** chơi thử thẳng một màn (ví dụ màn 2) mà không phải qua các màn trước
- **Bổ sung:** bảng cài đặt (nút ⚙) có ô "Chọn màn" liệt kê mọi màn theo thứ tự G33. Chọn một màn thì bắt đầu màn đó từ `start` như G33: Tỉnh táo theo `init` (G23), giữ hồ sơ đã mở khoá, số lần chết về 0. Không đổi schema hay engine.

## G35 · Chú thích đặt trước lời thoại

- **Ngày:** 2026-10-17
- **Cần cho:** M4-20b "(từ cuối hành lang)", M5-32 "(giờ ở ngay sau lưng bạn)", M6-31 "(giọng mẹ)", M9-11 "(sát tai)"
- **Bổ sung:** chú thích trong ngoặc ngay sau tên kênh `npc`, trước lời thoại, cũng ghi vào trường `note` (G8). UI hiện `note` ngay sau lời thoại cho cả hai trường hợp; nội dung giữ nguyên văn, chỉ bỏ dấu ngoặc.

```yaml
- {ch: npc, who: ke_tren_cau, text: "Con ơi, nhìn đường kìa. …", note: "giọng mẹ"}
```

## G36 · Dòng giả và kiểu mực

- **Ngày:** 2026-10-17
- **Cần cho:** màn 5 ("Yêu cầu với engine" mục 1, 2), màn 9 (mục 2)
- **Bổ sung:** dòng trên tường có `ink: do | nau | kho` (mặc định `do`). Dòng giả có id `F<số>` và `fake: true`, không có `violable`, không được làm từ khoá, không được nằm trong `violates`/`consequence_of`; validator kiểm tra. Dòng `kho` là Huyết tự thật như dòng đỏ. View chỉ trả `ink`, không trả `fake`, để người chơi phân biệt bằng mực như trên tường.
- **Hiển thị:** `do` chữ đỏ `#ff5a52` in đậm; `nau` chữ `#a8927a` nét thường, giãn đều; `kho` chữ `#c98a62` in nghiêng, gạch chân chấm. Mỗi kiểu khác nhau cả về nét, không chỉ về màu; trình đọc màn hình đọc thêm "(mực nâu đen)" hoặc "(máu khô)". Cả ba màu đạt ≥ 4.5:1 trên `bg` và `surface` (test).

```yaml
bloodtext:
  - {id: L1, text: "…"}
  - {id: F1, text: "Nếu nghe tiếng mẹ gọi, hãy mở cửa.", fake: true, ink: nau}
  - {id: L4, text: "Khi đủ bảy cái tên được khấn, lửa sẽ tắt.", ink: kho, violable: false}
```

## G37 · Bóp méo đổi mực

- **Ngày:** 2026-10-17
- **Cần cho:** màn 5 (mục 3: F1, F2 sang mực đỏ), màn 9 (F1 sang mực `kho`)
- **Bổ sung:** mục `distortions` có hai dạng: đổi chữ `{line, unless_highlighted, text}` như cũ, hoặc đổi mực `{line, ink}` áp mỗi khi `sanity` ≤ 2, không bảo vệ được bằng từ khoá. Một dòng được có tối đa một bản méo mỗi dạng.

```yaml
distortions:
  - {line: F1, ink: do}
  - {line: L1, unless_highlighted: k2, text: "Từ mười một giờ đêm đến bốn giờ sáng, không được mở cửa căn hộ."}
```

## G38 · `solution` tham chiếu dòng giả

- **Ngày:** 2026-10-17
- **Cần cho:** màn 5 (`solution: [F1, F2]`, D2 `[k2, F1]`, D4 `[k4, F2]`), màn 9 (D1 `[k1, F1]`)
- **Bổ sung:** `solution` nhận id dòng giả. Trên màn hình chết và màn hình kết quả, dòng giả trong `solution` hiện bằng mực gốc và gạch ngang (mark `struck`), dòng thật được tô như G17.

## G39 · Ánh sáng `candle`

- **Ngày:** 2026-10-17
- **Cần cho:** màn 5 (M5-31), màn 7 (ánh lò), màn 9 (M9-20)
- **Bổ sung:** `light: candle`: lớp phủ cam ấm `#ff9a3c`, viền tối dần. Lay động nhẹ, tối đa 2 lần đổi mỗi giây; đứng yên khi `prefers-reduced-motion`. Nhắm mắt thì vẫn đen như mọi ánh sáng khác.

## G40 · Hiệu ứng có điều kiện

- **Ngày:** 2026-10-17
- **Cần cho:** M8-30 (màn 8 "Yêu cầu với engine" mục 1)
- **Bổ sung:** một phần tử `effects` (của node hoặc lựa chọn) được kèm `if`. Engine áp mọi hiệu ứng không điều kiện của danh sách trước, theo thứ tự; sau đó xét lần lượt các hiệu ứng có điều kiện trên state đã cập nhật. Phần tử vẫn chỉ có đúng một khoá hiệu ứng. Validator kiểm tra cả điều kiện của hiệu ứng (cờ chưa bật, v.v.).

```yaml
effects: [{sanity: -1, if: {not_flag: long_sat}}]
```

## G41 · Màn cuối và kết thúc mở

- **Ngày:** 2026-10-17
- **Cần cho:** màn 9 (mục 1)
- **Bổ sung:** màn khai báo `final: true`; chỉ một màn final và đó phải là màn có số lớn nhất (validator). Kết cục sống `open: true` là kết thúc mở; chỉ dùng ở màn final. Kịch bản không nói cách đánh dấu E2, nên chọn trường `open` cho E2. Màn hình kết quả của màn final:
  - kết cục sống không `open` (E1): dòng "Kết thúc", nút "Chơi lại từ màn đầu" (giữ hồ sơ) và "Chơi lại màn này";
  - kết cục `open` (E2): dòng "Kết thúc mở", nút "Chơi lại màn này".

```yaml
level: m9
final: true
nodes:
  - {id: m9_e2, type: ending, result: survive, open: true, …}
```

## G42 · Mực `kho` là Huyết tự thật

- **Ngày:** 2026-10-17
- **Cần cho:** M9 L4 (màn 9 mục 2)
- **Bổ sung:** không cần gì thêm ngoài G36: dòng `ink: kho` không `fake`, nên có `violable`, được làm từ khoá và bị bóp méo đổi chữ như dòng đỏ.

## G43 · `clue` của ảnh tính theo màn (thay G32)

- **Ngày:** 2026-10-17
- **Cần cho:** màn 9 (mục 3), dùng lại `ban_tho_chieu_nghi` ở M9-20
- **Bổ sung:** trong `assets.yaml`, `clue: m<màn>:c<số>`. Quy tắc G22 (AGENTS.md 8.5) chỉ áp trong màn sở hữu manh mối; ở màn khác ảnh dùng tự do (kịch bản bảo đảm chữ của node đã mô tả chi tiết trong ảnh; validator không kiểm tra được điều này). Validator kiểm tra màn đó tồn tại và có khai báo manh mối đó. Bỏ trường `level` của G32.

```yaml
- {id: ban_tho_chieu_nghi, file: bg/ban_tho_chieu_nghi.png, alt: "…", clue: m3:c1}
```

## G44 · Kết cục chết không bắt buộc gắn với dòng luật

- **Ngày:** 2026-10-17
- **Cần cho:** M9 D2 "Ngã cầu thang" (cột Luật là "—")
- **Bổ sung:** bỏ quy tắc của G16 "kết cục chết phải có `violates` hoặc `consequence_of`". Quy tắc "mỗi dòng `violable` phải có ít nhất một kết cục chết `violates` nó" vẫn giữ.

## G45 · Hub xong mà không có dòng nào thì đi thẳng tới `hub_exit` (sửa G4)

- **Ngày:** 2026-10-17
- **Cần cho:** hub quan sát của M1–M9 (M1-04, M2-03, …). Khi chơi thử, hết lượt hành động là gặp một màn hình trống chỉ có nút "Tiếp", vì các hub này không có `lines`.
- **Bổ sung:** khi vào hub, nếu `hub_done` đúng và không có dòng nào hiện ra (tính cả việc ẩn dòng `env · nhìn` khi nhắm mắt), engine vào thẳng `hub_exit`. `scene` của hub vẫn được áp trước, nên ý của G4 về ảnh có clue không đổi. Hub có dòng (như M1-50) vẫn hiện dòng rồi một nút "Tiếp" như G4. Ưu tiên `on_sanity_zero` (G19) giữ nguyên: chỉ bỏ qua khi lối ra đúng là `hub_exit`. Không đổi YAML.

## G46 · Hub tính theo lượt hiện số lượt còn lại

- **Ngày:** 2026-10-17
- **Cần cho:** hub quan sát của M1–M9. Câu "Bạn có N lượt hành động" chỉ hiện một lần trước hub; sau đó người chơi không biết còn mấy lượt.
- **Bổ sung:** ở hub có `hub_done` dùng `actions_left_lte`, khi đang hiện lựa chọn, UI hiện dòng kênh `system` "Còn N lượt hành động." (chuỗi UI trong `src/ui/strings.ts`) phía trên lựa chọn. Hub đếm theo `visited_count_gte` (M1-50) không hiện. Không đổi YAML.

## G47 · Màn hình kết thúc: nhãn dòng, dòng bị vi phạm, bản méo đã đọc

- **Ngày:** 2026-10-17
- **Cần cho:** phần hé lộ nhắc dòng theo id ("Vi phạm L3." ở M1 D3; "L2 ràng buộc bạn… L4 chỉ cho phép dậy." ở M2 E1; M3, M5, M6, M7). Bảng Huyết tự không đánh số dòng nên người chơi không biết L3 là dòng nào.
- **Bổ sung:**
  - Trên màn hình kết thúc (chết và sống), mỗi dòng thật (không `fake`) có nhãn là id của dòng (`L1`, `L2`, …), khớp với cách phần hé lộ nhắc tới. Dòng giả không có nhãn. Nhãn chỉ hiện ở màn hình kết thúc; trong lúc chơi và trong bảng Huyết tự không có nhãn, để không lộ dòng nào là giả (G36).
  - Kết cục chết tô các dòng trong `violates` (G16) bằng viền trái và chữ "vi phạm".
  - Kết cục chết có mục "Huyết tự bạn đã đọc": những dòng mà người chơi đang thấy khác bản gốc (đổi chữ hoặc đổi mực, theo Tỉnh táo và từ khoá lúc chết), gạch ngang; ngay dưới là "Huyết tự thật". Không có dòng méo thì không có mục này.
  - Không đổi YAML.

## Sửa trực tiếp `docs/` lần 2 (được duyệt một lần, 2026-10-17)

Người dùng cho phép chép brief ảnh bổ sung (do Claude viết) vào docs. Lý do: rà ảnh nền thực tế ở từng node, thấy hai chỗ ảnh mâu thuẫn với chữ (M8-31, M6-30 → M6-33) và ba chỗ lệch địa điểm (M9-06, M2-09/M3-15, M5-06).

| File | Chỗ sửa |
| --- | --- |
| `docs/man-2-canh-linh-cuu.md` | Brief `cau_thang_chieu_nghi`; gán cảnh M2-09 (chỉ nhánh `di_xuong`); "cần 3 ảnh mới" |
| `docs/man-3-hinh-nhan-the-mang.md` | Gán cảnh M3-15 `cau_thang_chieu_nghi`; nhắc ảnh dùng lại |
| `docs/man-5-noi-quy.md` | Thêm mục "Brief vẽ" với `hanh_lang_lo_khoa`; gán cảnh M5-06 và M5-03 (hub đặt lại `can_ho_304`); "cần 1 ảnh mới" |
| `docs/man-6-cau-noi.md` | Brief `cau_noi_nhin_ve_c4`; gán cảnh M6-30 (giữ đến M6-33); ghi chú M6-10 chỉ còn giữ cho M6-20, M6-21; "cần 2 ảnh mới" |
| `docs/man-8-binh-minh-khong-den.md` | Brief `phong_404_1986_mat_troi` kèm ghi chú màu; M8-31 dùng ảnh này; M8-01 "giữ đến M8-32"; "cần 2 ảnh mới" |
| `docs/man-9-nguoi-dan-ba-khong-mat.md` | Brief `tiem_vang_ma_ngoai`; gán cảnh M9-06; "cần 2 ảnh mới" |
| `docs/tong-quan-cot-truyen.md` | Danh sách ảnh: 23 ảnh; bỏ câu "Màn 5 không có ảnh mới" |

YAML và `content/assets.yaml` (5 ảnh placeholder, `alt` do Claude viết từ brief) cập nhật trong cùng thay đổi.

## G48 · Nhãn chấm từ khoá: "chìa khoá của sinh lộ"

- **Ngày:** 2026-10-17
- **Cần cho:** màn hình kết quả mọi màn. Khi chơi thử, nhãn "sai" cạnh một cụm hợp lý (ví dụ "Lửa tắt" ở M7, "không được mở mắt" ở M2) đọc như người chơi đã đánh dấu nhầm.
- **Bổ sung:** `correct` của từ khoá giữ nguyên nghĩa (cụm thuộc sinh lộ). Màn hình kết quả ghi "chìa khoá của sinh lộ" thay cho "đúng", "không phải chìa khoá" thay cho "sai". Chuỗi UI trong `src/ui/strings.ts`; mục 4.7 của đặc tả sửa theo. Không đổi YAML.

## G49 · Chơi lại nhớ từ khoá đã đánh dấu

- **Ngày:** 2026-10-17
- **Cần cho:** bước đánh dấu của mọi màn khi bấm "Chơi lại".
- **Bổ sung:** giao diện đánh dấu mở sẵn các cụm đã chọn ở lần đánh dấu trước của cùng màn; người chơi vẫn bỏ chọn, chọn lại hoặc bấm "Bỏ qua". Chỉ nhớ trong phiên đang chơi, không ghi vào bản lưu, nên không đổi `sinhlo.save.v1`. Engine không đổi: lựa chọn vẫn chỉ được ghi khi người chơi xác nhận.

## Sửa trực tiếp `docs/` lần 3 (người dùng cho phép sửa docs, 2026-10-17)

Sau một lượt chơi thử cả 9 màn, người chơi qua mọi màn ngay lần đầu. Người dùng cho phép sửa kịch bản trong `docs/` để giảm những chỗ lộ đáp án. YAML và test cập nhật trong cùng thay đổi.

| File | Chỗ sửa | Lý do |
| --- | --- | --- |
| `docs/man-4-tram-y-te.md` | M4-31: bỏ hai dòng `narration` "Bác sĩ Thanh bạn gặp lúc chín giờ là một người phụ nữ." và "(nếu clue c1) Bảng phân công chỉ ghi một bác sĩ trực." | Lời dẫn suy luận hộ người chơi. Manh mối vẫn còn: bác sĩ lúc chín giờ là "bà" và đi guốc gỗ; người mặc áo blouse đi giày da; c1 ghi một bác sĩ trực |
| `docs/man-9-nguoi-dan-ba-khong-mat.md` | M9-13: bỏ dòng "(nếu flag `biet_ten_hai`) Bạn nhớ dòng tên bị gạch đen trong cuốn sổ cũ." | Như trên; lựa chọn "Bà là bà Hai." vẫn chỉ hiện khi đã biết tên |
| `docs/man-6-cau-noi.md` | Chữ lựa chọn ở M6-10, M6-31, M6-32 (đích đến không đổi) | Ở cả ba node, lựa chọn đúng là câu dài và cụ thể nhất. Viết lại cho độ dài ngang nhau; lựa chọn chết ở M6-32 giờ cũng đáp lời bác sĩ Thanh, chỉ khác là dừng bước |
| `docs/man-5-noi-quy.md` | Chữ lựa chọn ở M5-12, M5-31 (đích đến không đổi) | Như trên: thêm lý do cho lựa chọn chết ("cho tỉnh", "cho đỡ khát", "cho em bé đỡ sợ"), rút gọn lựa chọn đúng |
| `docs/man-2-canh-linh-cuu.md` | M2-50: "Mở mắt" → "Mở mắt, rồi bước ra khỏi quan tài" | Lựa chọn chết sáu chữ cái đứng cạnh một câu dài 47 ký tự; giờ hai lựa chọn chỉ khác thứ tự hai hành động |
| `docs/man-8-binh-minh-khong-den.md` | M8-05 thêm dòng `env · nhìn` "Bạn quay lưng vào bức tranh. Đầu kia căn phòng, thẳng trước mặt, là ô cửa sổ bếp tối om."; M8-30 hai lựa chọn tường sai bật cờ `ve_cua_ra_vao` / `ve_ban_hoc`; M8-32 không còn chỉ sẵn tường cửa sổ bếp mà cho chọn lại giữa hai tường chưa vẽ; cập nhật Sinh lộ, bảng manh mối c2 và "Kiểm tra nhanh" | Trước đây vẽ sai tường lần đầu thì M8-32 đưa sẵn đáp án, nên manh mối phía đông (c1) không có tác dụng. Giờ có hai đường suy ra phía đông (c1, hoặc c2: mặt trời lặn ở tường cửa ra vào, tường đó đối diện cửa sổ bếp) và đoán sai hai lần là D2 |
| `docs/dac-ta-kich-ban.md` | Mục 4.7: cách ghi từ khoá trên màn hình kết quả | G48 |
