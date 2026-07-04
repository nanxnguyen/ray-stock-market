import { memo } from 'react'

function MarketNewsInner() {
  const th = {
    pageBg: 'var(--ds-color-bg-app)',
    cardBg: 'var(--ds-color-bg-elevated)',
    cardBorder: 'var(--ds-color-border-strong)',
    text: 'var(--ds-color-text-primary)',
    textMuted: 'var(--ds-color-text-secondary)',
  }

  const tagColors: Record<string, { bg: string; color: string }> = {
    'Vĩ mô': { bg: 'rgba(168,139,250,.15)', color: '#a78bfa' },
    'Doanh nghiệp': { bg: 'rgba(96,165,250,.15)', color: '#60a5fa' },
    'Ngành': { bg: 'rgba(245,158,11,.15)', color: '#f59e0b' },
    'Thị trường': { bg: 'rgba(34,197,94,.15)', color: '#22c55e' },
  }

  const allNews = [
    { tag: 'Vĩ mô', symbol: '', title: 'NHNN giữ nguyên lãi suất điều hành trong kỳ họp tháng 7', excerpt: 'Ngân hàng Nhà nước quyết định giữ nguyên các mức lãi suất điều hành nhằm hỗ trợ tăng trưởng kinh tế trong bối cảnh lạm phát được kiểm soát tốt.', time: '2 giờ trước', source: 'Vietstock' },
    { tag: 'Doanh nghiệp', symbol: 'VCB', title: 'Vietcombank công bố lợi nhuận quý 2 tăng 18% so với cùng kỳ', excerpt: 'Ngân hàng dẫn đầu về vốn hóa ghi nhận lợi nhuận trước thuế đạt 12,500 tỷ đồng trong quý 2/2026, vượt kỳ vọng của giới phân tích.', time: '3 giờ trước', source: 'CafeF' },
    { tag: 'Ngành', symbol: '', title: 'Ngành thép hưởng lợi từ chính sách đầu tư công 2026', excerpt: 'Các dự án hạ tầng trọng điểm được đẩy nhanh tiến độ giải ngân, kỳ vọng thúc đẩy nhu cầu tiêu thụ thép xây dựng trong nửa cuối năm.', time: '5 giờ trước', source: 'Đầu tư Chứng khoán' },
    { tag: 'Doanh nghiệp', symbol: 'FPT', title: 'FPT ký hợp đồng chuyển đổi số trị giá 50 triệu USD với đối tác Nhật', excerpt: 'Hợp đồng mới sẽ được ghi nhận doanh thu từ quý 3/2026, củng cố vị thế dẫn đầu mảng công nghệ thông tin xuất khẩu.', time: '6 giờ trước', source: 'ĐTCK' },
    { tag: 'Thị trường', symbol: '', title: 'Khối ngoại mua ròng hơn 800 tỷ đồng trên HOSE phiên hôm nay', excerpt: 'Dòng vốn ngoại tiếp tục đổ vào nhóm cổ phiếu ngân hàng và bất động sản khu công nghiệp trong bối cảnh định giá hấp dẫn.', time: '7 giờ trước', source: 'Vietstock' },
    { tag: 'Vĩ mô', symbol: '', title: 'GDP quý 2/2026 ước tăng 6.8%, cao hơn dự báo', excerpt: 'Tổng cục Thống kê công bố số liệu tăng trưởng kinh tế vượt kỳ vọng, được thúc đẩy bởi xuất khẩu và đầu tư trực tiếp nước ngoài.', time: '9 giờ trước', source: 'Reuters' },
    { tag: 'Doanh nghiệp', symbol: 'HPG', title: 'Hòa Phát khởi công giai đoạn 2 dự án Dung Quất 2', excerpt: 'Dự án mở rộng công suất thêm 2.8 triệu tấn thép/năm, dự kiến đi vào vận hành từ quý 4/2027.', time: '1 ngày trước', source: 'CafeF' },
    { tag: 'Ngành', symbol: '', title: 'Xuất khẩu thủy sản 6 tháng đầu năm đạt 5.2 tỷ USD', excerpt: 'Thị trường Mỹ và EU phục hồi nhu cầu nhập khẩu, tạo động lực tăng trưởng cho nhóm cổ phiếu thủy sản.', time: '1 ngày trước', source: 'VnEconomy' },
    { tag: 'Thị trường', symbol: '', title: 'VN-Index vượt mốc 1,860 điểm, thanh khoản cải thiện', excerpt: 'Thị trường ghi nhận phiên tăng điểm thứ 4 liên tiếp với sự dẫn dắt của nhóm cổ phiếu vốn hóa lớn.', time: '1 ngày trước', source: 'Vietstock' },
  ]

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: th.pageBg, padding: 24 }}>
      <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: th.text }}>TIN TỨC THỊ TRƯỜNG</h1>

        {/* Featured News */}
        <div style={{
          background: th.cardBg, border: `1px solid ${th.cardBorder}`,
          borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
          display: 'grid', gridTemplateColumns: '1fr 1.3fr',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a2a1f, #0f1e17)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200,
          }}>
            <span style={{ fontSize: 48 }}>📈</span>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
            <span style={{
              fontSize: 9, fontWeight: 700, color: 'var(--ds-color-market-up)',
              background: 'rgba(34,197,94,.15)', padding: '3px 8px', borderRadius: 5,
              width: 'fit-content', textTransform: 'uppercase',
            }}>Nổi bật</span>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: th.text, lineHeight: 1.4 }}>
              VN-Index lập đỉnh mới trong năm nhờ dòng tiền khối ngoại và kết quả kinh doanh quý 2 khả quan
            </h2>
            <p style={{ margin: 0, fontSize: 11.5, color: th.textMuted, lineHeight: 1.5 }}>
              Thị trường chứng khoán Việt Nam ghi nhận tuần giao dịch tích cực khi VN-Index tăng hơn 3% với thanh khoản bình quân đạt trên 25,000 tỷ đồng/phiên, cao nhất kể từ đầu năm.
            </p>
            <span style={{ fontSize: 10, color: th.textMuted, marginTop: 4 }}>30 phút trước · Ray Stock Market</span>
          </div>
        </div>

        {/* News List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {allNews.map((n, i) => {
            const tc = tagColors[n.tag] || { bg: 'rgba(138,148,166,.15)', color: '#8a94a6' }
            return (
              <div
                key={i}
                style={{
                  background: th.cardBg, border: `1px solid ${th.cardBorder}`,
                  borderRadius: 10, padding: 14, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 8.5, fontWeight: 700, color: tc.color, background: tc.bg,
                    padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase',
                  }}>{n.tag}</span>
                  <span style={{ fontSize: 9.5, color: th.textMuted }}>{n.time}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: th.text, lineHeight: 1.4 }}>{n.title}</h3>
                <p style={{
                  margin: 0, fontSize: 10.5, color: th.textMuted, lineHeight: 1.5,
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>{n.excerpt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                  <span style={{ fontSize: 9.5, color: th.textMuted }}>{n.source}</span>
                  {n.symbol && (
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--ds-color-text-link)', fontFamily: "'JetBrains Mono', monospace" }}>{n.symbol}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const MarketNews = memo(MarketNewsInner)
export default MarketNews
