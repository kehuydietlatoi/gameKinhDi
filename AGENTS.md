# AGENTS.md

Quy tắc cho mọi coding agent làm việc trong repo này.

## 1. Dự án

Game text kinh dị sinh tồn, nhiều lựa chọn, chạy trên trình duyệt. Bối cảnh: khu tập thể cũ ở Việt Nam. Mỗi màn có một "Huyết tự" (bộ luật luôn đúng từng chữ) và một "sinh lộ" (cách sống sót suy ra được từ chính câu chữ của luật).

Game là **data-driven**: engine chỉ biết luật chơi; toàn bộ nội dung màn chơi nằm trong `content/*.yaml`.

## 2. Nguồn sự thật

| Câu hỏi | File quyết định |
| --- | --- |
| Engine phải làm gì, schema ra sao | `docs/dac-ta-kich-ban.md` |
| Nội dung một màn (câu chữ, node, kết cục) | `docs/man-<số>-*.md` |
| Bối cảnh, ý tưởng chung | `docs/brainstorm.md` (chỉ tham khảo) |
| Những gì đã bổ sung vào đặc tả | `docs/spec-changes.md` |

- Khi `content/*.yaml` khác `docs/man-*.md`, file trong `docs/` là đúng.
- `docs/` vẫn là nguồn sự thật. Được sửa `docs/man-*.md` để đồng bộ với quyết định đã được người dùng duyệt; mỗi lần sửa ghi vào `docs/spec-changes.md` (ngày, màn, lý do).
- Không tự thêm hay viết lại thoại, node, manh mối hay kết cục khi chưa được duyệt (xem mục 6).
- Các file khác trong `docs/` chỉ sửa khi người dùng yêu cầu, trừ `docs/spec-changes.md`.

## 3. Cấu trúc thư mục

```
docs/            tài liệu thiết kế
content/         m1.yaml, m2.yaml, …, assets.yaml  (chỉ dữ liệu)
public/bg/       ảnh nền pixel <id>.png
src/content/     zod schema + loader đọc YAML
src/engine/      state machine thuần TypeScript, KHÔNG import React
src/ui/          component React, chỉ đọc state và gửi action
scripts/         validate.ts và các script phụ
tests/           Vitest
```

## 4. Lệnh

| Lệnh | Việc |
| --- | --- |
| `npm run dev` | Chạy game cục bộ |
| `npm run build` | Build production |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |
| `npm run validate` | Kiểm tra mọi file trong `content/` |

Trước khi báo một việc là xong: `typecheck`, `lint`, `test`, `validate` đều phải pass. Báo rõ lệnh nào đã chạy và kết quả.

## 5. Quy tắc engine

1. Engine là hàm thuần: `step(state, action) => state`. Không side effect, không `Date.now()`, không `Math.random()`.
2. Mọi thứ "ngẫu nhiên" phải tất định. Ví dụ biến thể Huyết tự xoay vòng theo số lần chết.
3. Engine không chứa bất kỳ câu chữ nào của màn chơi. Chuỗi UI chung (nút "Chơi lại", nhãn "Tỉnh táo") để trong `src/ui/strings.ts`.
4. Mỗi điều kiện (`if`) được định nghĩa ở đúng một chỗ: `src/engine/conditions.ts`. Mỗi hiệu ứng (`effects`) ở đúng một chỗ: `src/engine/effects.ts`. Thêm cái mới thì cập nhật zod schema trong cùng thay đổi.
5. Điều kiện hoặc hiệu ứng không xác định là **lỗi validate**, không được bỏ qua âm thầm.
6. Luật tối thượng: vi phạm một dòng Huyết tự luôn dẫn tới một kết cục chết do màn khai báo. Engine không tự quyết cái chết.
7. Bóp méo Huyết tự chỉ thay đổi phần **hiển thị**. State luôn giữ bản gốc.

## 6. Quy tắc nội dung

1. Giữ nguyên văn mọi câu trong kịch bản: không diễn đạt lại, không sửa chính tả, không "làm cho hay hơn".
2. Không tự viết thêm thoại, node, manh mối, twist hay kết cục. Thiếu nội dung thì hỏi.
3. Quy ước id: node `m<màn>_n<số>` (M1-05 → `m1_n05`, M1-52b → `m1_n52b`); kết cục sống `m<màn>_e<số>`, chết `m<màn>_d<số>`.
4. Id NPC, manh mối, từ khoá giữ đúng như trong `docs/` (`bac_tam`, `c1`, `k4`).
5. Mỗi dòng Huyết tự có thể bị vi phạm phải có ít nhất một node chết tương ứng.
6. Một màn chỉ được coi là xong khi `validate` pass và có test cho đường sống cùng từng kết cục chết.

## 7. Kênh hiển thị (không có âm thanh)

- Không dùng file âm thanh, Web Audio hay text-to-speech. Mọi "âm thanh" là dòng chữ thuộc kênh `sound`.
- Sáu kênh: `narration`, `env`, `sound`, `npc`, `bloodtext`, `system`. Kiểu hiển thị theo mục 1 của đặc tả.
- Khi `eyes_closed` là true, ẩn mọi dòng `env` có `sense: nhìn`.
- Mỗi kênh là một component riêng trong `src/ui/channels/`. Không render kênh bằng chuỗi `if/else` rải rác.

## 8. Hình ảnh

Quy cách đầy đủ ở mục 5 của `docs/dac-ta-kich-ban.md`; brief vẽ từng ảnh ở phần "Cảnh và ảnh nền" của từng file màn.

1. Ảnh nền PNG 320×180 px, không khử răng cưa, chỉ dùng 16 màu của bảng màu chung. Hiển thị bằng `image-rendering: pixelated`, phóng theo bội số nguyên.
2. Màu đỏ máu `#8a0b0b` chỉ dùng trong ảnh, cho máu và Huyết tự vẽ trên tường. Chữ Huyết tự trên UI dùng màu riêng (mục 9).
3. **Không vẽ người.** Chỗ NPC đứng nằm ngoài khung hoặc trong vùng tối.
4. Ảnh không được chứa thông tin mà kịch bản không có. Chi tiết hình là manh mối thì ảnh phải khai báo `clue` trong `content/assets.yaml`.
5. Ảnh có `clue` chỉ dùng ở node thêm đúng clue đó hoặc ở ending; validator kiểm tra.
6. Mỗi ảnh có một bản vẽ theo đúng brief: đủ mục "Bắt buộc có", không có gì trong mục "Cấm vẽ". Lệch brief thì sửa ảnh, không sửa brief.
7. Ánh sáng (`flicker`, `dark`, `dawn`) do engine phủ lên bằng CSS; không vẽ thêm biến thể ánh sáng.
8. Chưa có ảnh thật thì dùng `placeholder: true`; không chặn tiến độ engine vì thiếu ảnh.
9. Validator kiểm tra: mọi `bg` được tham chiếu có trong `assets.yaml`; mọi file khai báo tồn tại, đúng kích thước 320×180 và chỉ chứa màu trong bảng màu.

## 9. Quy tắc UI

- Font phải hỗ trợ đầy đủ dấu tiếng Việt (ví dụ Be Vietnam Pro, Noto Serif). Kiểm tra với chữ "Huyết tự", "Ò… ó… o…".
- Hiệu ứng gõ chữ: chạm/nhấp để hiện hết ngay; có cài đặt tốc độ; tắt hẳn khi `prefers-reduced-motion`.
- An toàn thị giác: không nhấp nháy quá 3 lần mỗi giây, không jump scare bằng chớp sáng toàn màn hình.
- Chữ `bloodtext` dùng màu `#ff5a52`, không dùng `#8a0b0b` (màu đó chỉ cho ảnh). Phải đạt độ tương phản tối thiểu 4.5:1 trên nền tối nhất của UI.
- Dùng được ở chiều rộng 360px, không cuộn ngang.
- Nút "Huyết tự" và thanh Tỉnh táo luôn hiển thị trong một màn.

## 10. Lưu tiến trình

- `localStorage`, key có phiên bản: `sinhlo.save.v2` (v1 được migrate khi đọc, xem G55).
- Mọi đọc/ghi bọc trong `try/catch`. Game vẫn chạy được khi storage lỗi hoặc trống.
- Đổi cấu trúc save thì tăng phiên bản key và viết hàm migrate.

## 11. Test

- Có helper `play(levelId, choices[])` chạy cả màn bằng danh sách lựa chọn và trả về state cuối.
- Mỗi màn cần test: đường sống, từng kết cục chết, và từng bản bóp méo (khi `sanity` ≤ 2 và chưa đánh dấu từ khoá).
- `validate` phải kiểm tra:
  - mọi `goto`/`next` trỏ tới node có thật;
  - mọi node tới được từ `start`;
  - mọi nhánh kết thúc ở một `ending`;
  - id NPC, manh mối, từ khoá, dòng Huyết tự được tham chiếu đều có khai báo.

## 12. Khi đặc tả thiếu

1. Chọn cách bổ sung đơn giản nhất phục vụ đúng nhu cầu của kịch bản.
2. Cập nhật schema, engine và validator trong cùng một thay đổi.
3. Ghi vào `docs/spec-changes.md`: ngày, màn/node cần nó, nội dung bổ sung, ví dụ YAML.
4. Nếu bổ sung làm thay đổi ý nghĩa một màn đã xong, dừng lại và hỏi.

## 13. Cách làm việc

- Làm theo bước nhỏ. Khi task chia bước, dừng sau mỗi bước để review.
- Không thêm dependency mới khi chưa nêu lý do trong phần tóm tắt.
- Không thêm backend, analytics, tài khoản người dùng, âm thanh, hay sinh nội dung bằng AI lúc chạy game.
- Commit theo Conventional Commits: `feat(engine): …`, `content(m1): …`, `test(m1): …`, `fix(ui): …`.
