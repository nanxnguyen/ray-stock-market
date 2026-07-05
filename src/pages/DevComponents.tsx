import {
  PriceText,
  ChangeBadge,
  Panel,
  FilterChip,
  SearchField,
  NavPill,
  IconChip,
  ModalShell,
} from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { SettingsIcon } from "lucide-react"

export default function DevComponents() {
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filterActive, setFilterActive] = useState(false)
  const [chipActive, setChipActive] = useState("all")

  return (
    <div className="space-y-8 p-6 overflow-y-auto h-full text-txt-primary">
      <h1 className="font-heading text-2xl font-bold">Dev Components Gallery</h1>

      {/* ─── PriceText ─── */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-txt-secondary">PriceText</h2>
        <div className="flex flex-wrap items-center gap-4">
          <PriceText value="45,200" direction="up" />
          <PriceText value="32,100" direction="down" />
          <PriceText value="28,500" direction="flat" />
          <PriceText value="72,000" direction="ceiling" />
          <PriceText value="15,000" direction="floor" />
          <PriceText value="30,000" direction="reference" />
        </div>
      </section>

      {/* ─── ChangeBadge ─── */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-txt-secondary">ChangeBadge</h2>
        <div className="flex flex-wrap items-center gap-3">
          <ChangeBadge value="+2.5%" direction="up" size="md" />
          <ChangeBadge value="-1.3%" direction="down" size="md" />
          <ChangeBadge value="0.0%" direction="flat" size="md" />
          <ChangeBadge value="+5.0%" direction="up" size="sm" />
          <ChangeBadge value="-3.2%" direction="down" size="sm" />
          <ChangeBadge value="+1.8%" />
        </div>
      </section>

      {/* ─── Panel ─── */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-txt-secondary">Panel</h2>
        <div className="flex gap-4">
          <Panel variant="default" className="p-4 flex-1">
            <span className="text-sm">Panel default</span>
          </Panel>
          <Panel variant="elevated" className="p-4 flex-1">
            <span className="text-sm">Panel elevated</span>
          </Panel>
        </div>
      </section>

      {/* ─── FilterChip ─── */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-txt-secondary">FilterChip</h2>
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={chipActive === "all"} onClick={() => setChipActive("all")}>Tất cả</FilterChip>
          <FilterChip active={chipActive === "up"} onClick={() => setChipActive("up")}>Tăng</FilterChip>
          <FilterChip active={chipActive === "down"} onClick={() => setChipActive("down")}>Giảm</FilterChip>
          <FilterChip active={chipActive === "flat"} onClick={() => setChipActive("flat")}>Đi ngang</FilterChip>
          <FilterChip arrow>Ticker ▾</FilterChip>
        </div>
      </section>

      {/* ─── SearchField ─── */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-txt-secondary">SearchField</h2>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Tìm mã CK..."
          className="max-w-xs"
        />
      </section>

      {/* ─── NavPill ─── */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-txt-secondary">NavPill</h2>
        <div className="flex items-center gap-2">
          <NavPill active href="#">Tổng quan</NavPill>
          <NavPill href="#">Khối lượng</NavPill>
          <NavPill href="#">Phân tích</NavPill>
        </div>
      </section>

      {/* ─── IconChip ─── */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-txt-secondary">IconChip</h2>
        <div className="flex items-center gap-2">
          <IconChip icon={<SettingsIcon className="size-4" />} label="Cài đặt" />
          <IconChip icon={<SettingsIcon className="size-4" />} label="Active" active />
        </div>
      </section>

      {/* ─── ModalShell ─── */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-txt-secondary">ModalShell</h2>
        <Button onClick={() => setModalOpen(true)} variant="outline" size="sm">
          Mở modal
        </Button>
        <ModalShell open={modalOpen} onClose={() => setModalOpen(false)} title="Modal Demo">
          <p className="text-sm text-txt-secondary">
            Đây là nội dung modal demo. Nhấn ra ngoài hoặc nút × để đóng.
          </p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setModalOpen(false)} size="sm">Đóng</Button>
          </div>
        </ModalShell>
      </section>

      {/* ─── shadcn UI Primitives ─── */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-txt-secondary">UI Primitives (shadcn)</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge size="xs">XS</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="xs">XS</Button>
          <Button size="sm">SM</Button>
          <Button size="default">Default</Button>
          <Button size="lg">LG</Button>
        </div>
      </section>
    </div>
  )
}
