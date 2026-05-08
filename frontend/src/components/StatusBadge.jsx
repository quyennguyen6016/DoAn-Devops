const STATUS_META = {
  pending:    { label: 'Chờ xác nhận',  bg: '#FEF9C3', text: '#854D0E', border: '#EAB308' },
  processing: { label: 'Đang xử lý',   bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
  shipping:   { label: 'Đang giao',     bg: '#E0E7FF', text: '#3730A3', border: '#6366F1' },
  completed:  { label: 'Hoàn tất',       bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  cancelled:  { label: 'Đã hủy',         bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
}

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || {
    label: status || 'Không rõ',
    bg: '#F3F4F6',
    text: '#374151',
    border: '#D1D5DB',
  }

  return (
    <span
      className="badge"
      style={{
        background: meta.bg,
        color: meta.text,
        borderColor: meta.border,
      }}
      title={meta.label}
    >
      {meta.label}
    </span>
  )
}
