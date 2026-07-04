# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (HMR)
npm run build     # tsc -b + vite build → dist/
npm run lint      # eslint
npm run preview   # serve dist/ locally
```

No test runner configured yet.

## Stack

- **React 19** + **TypeScript 6** + **Vite 8**
- **AG Grid Community v32** (`ag-grid-community`, `ag-grid-react`) — primary UI component
- `shadcn-ui` installed but not yet used
- No router, no state management library, no backend

## Architecture

Single-page app. Entire logic lives in `src/App.tsx`:

- `TickerRow` — TypeScript type for one stock row (symbol, ceiling, floor, reference, price, change, volume, sector)
- `rows` — hardcoded mock data (5 Vietnamese stocks: VCI, FPT, VNM, HPG, MWG)
- `columnDefs` — AG Grid column definitions with `valueFormatter` for price (2 decimal) and volume (locale string)
- `cellClassRules` on the `change` column drives `price-up` / `price-down` CSS classes (green/red)
- Symbol column is pinned left

Styles are in `src/App.css` (plain CSS, no CSS-in-JS or Tailwind). AG Grid theme: `ag-theme-quartz`.

## AG Grid conventions

- All column definitions typed as `ColDef<TickerRow>[]`
- `defaultColDef` sets `flex: 1`, `filter`, `sortable`, `resizable` for every column
- Value formatters receive `ValueFormatterParams<TickerRow, number>` — guard with `typeof value === 'number'`
- To add live data: replace `rowData={rows}` with state + WebSocket/SSE updates calling `gridApi.applyTransactionAsync`



# 🧠 DETER Loop — Mô Hình Tư Duy Chuẩn (workflow + tiết kiệm token)

Mỗi task chạy vòng **DETER**. Chọn đúng tool theo khâu, bịt đúng cửa rò token.

## 2 lớp nén input (nối tiếp, KHÔNG trùng)

- **RTK** (hook, lossless, 60-90%): nén output shell (`git diff/log/status`, `yarn build`, `ls -la`). Đo: `rtk gain`.
- **Headroom** (proxy, lossy, 60-95%): nén file read, history, memory, RAG. Đo: `headroom perf`.

Luồng: `shell → RTK nén output → file/history → Headroom nén → API`. RTK xong rồi thì Headroom không nén lại.
⚠️ Headroom lossy — agent quên code/sai file → hạ mức nén file, chỉ giữ nén history/memory.

## Vòng đời task

| Khâu            | Tool                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------- |
| **D** Design    | `brainstorming` (mơ hồ) · `writing-plans` (multi-step) · Memory · Context7                  |
| **E** Explore   | CodeGraph (`search/callers/trace/impact`) · `cavecrew-investigator` (rộng, nén ~60%)        |
| **T** Transform | `test-driven-development` (logic mới) · Serena (sửa symbol, không nạp cả file) · Edit (nhỏ) |
| **E** Examine   | `systematic-debugging` · `verification-before-completion` · Playwright (UI)                 |
| **R** Report    | Caveman (gọn) · Memory (lưu fact mới)                                                       |

RTK nén shell ở mọi khâu. Test fail → quay **T**.

## Chọn tool theo loại data

| Data                 | Tool                         | Lưu ý                           |
| -------------------- | ---------------------------- | ------------------------------- |
| Tìm symbol/flow      | CodeGraph                    | Text/comment thuần → grep       |
| Sửa code             | Serena `replace_symbol_body` | File không phải code → Edit     |
| Shell output verbose | RTK (auto)                   | Lệnh 1-2 dòng → khỏi            |
| File/history/memory  | Headroom                     | Lossy — canh chất lượng         |
| Docs lib/framework   | Context7                     | Không web search                |
| Việc rộng nhiều file | cavecrew subagent            | Nén tool-result ~60%            |
| Trả lời user         | Caveman                      | Code/commit/PR/security viết rõ |
| Xuyên session        | Memory                       | Không giải thích lại            |

## RTK nâng cao

- `rtk discover` — quét lịch sử tìm lệnh tốn token chưa nén. Chạy định kỳ.
- `rtk proxy <cmd>` — chạy thô khi debug output gốc.
- Ưu tiên 1 lệnh verbose (đã nén) hơn nhiều lệnh nhỏ.

## Luồng vàng

```
💾 recall → plan → 🔍 tìm → 🔧 sửa → ⚡ test → verify → 💾 nhớ → báo gọn
```

## 3 nguyên tắc

1. **Đúng cửa, đúng tool** — rò cửa nào bịt cửa đó.
2. **Plan đúng = ít redo** — Superpowers đầu vòng cắt token redo (đắt nhất).
3. **Nhớ để khỏi lặp** — Memory cắt token giải thích lại mỗi session.

## Guardrail

- RTK + Headroom không nén cùng 1 data (nối tiếp, không song song)
- Headroom: bật mạnh cho history/memory, KHÔNG nén code file quá tay
- Caveman: KHÔNG dùng cho code/commit/PR/security
- Superpowers/subagent: task 1 dòng hiển nhiên → làm thẳng
- Sửa file `.md` lớn: dùng Edit thay Write (Write ghi cả file = đắt). Gộp thay đổi → 1 lần ghi. Không đọc lại file vừa sửa.


##Rule

Viết code type safety dễ maintan dễ mở rông

viết code tối ưu perfoemce, react best practice, clean code, readable code, easy to maintain, easy to extend


- sử dụng bigO tối ưu nhất

-nguyên tắc 100% giống design 100% pêrfomece 

- xây dựng bộ component core có thể reuse và mở rộng dễ dàng