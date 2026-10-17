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
