import { useMemo, useState } from 'react'
import StatusBadge from './StatusBadge.jsx'

const ALL_STATUS = [
  { value: '', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'completed', label: 'Hoàn tất' },
  { value: 'cancelled', label: 'Đã hủy' },
]

const STATUS_OPTIONS = ALL_STATUS.slice(1)

function formatMoney(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '-'
  return new Intl.NumberFormat('vi-VN').format(n)
}

function formatDate(value) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d)
}

function LoadingSkeleton({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} style={{ opacity: 0.6 }}>
          <td><span className="skeleton" style={{ width: 36 }} /></td>
          <td>
            <span className="skeleton" style={{ width: 140, display: 'block' }} />
            <span className="skeleton" style={{ width: 100, display: 'block', marginTop: 4 }} />
          </td>
          <td><span className="skeleton" style={{ width: 90 }} /></td>
          <td>
            <span className="skeleton" style={{ width: 120, display: 'block' }} />
            <span className="skeleton" style={{ width: 80, display: 'block', marginTop: 4 }} />
          </td>
          <td><span className="skeleton" style={{ width: 28 }} /></td>
          <td><span className="skeleton" style={{ width: 80 }} /></td>
          <td>
            <span className="skeleton" style={{ width: 90, display: 'block' }} />
            <span className="skeleton" style={{ width: 130, display: 'block', marginTop: 4 }} />
          </td>
          <td><span className="skeleton" style={{ width: 70 }} /></td>
        </tr>
      ))}
    </>
  )
}

export default function OrderList({
  orders,
  loading,
  onRefresh,
  onUpdateStatus,
  onDelete,
}) {
  const [busyId, setBusyId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = useMemo(() => {
    if (!filterStatus) return orders
    return orders.filter((o) => o.status === filterStatus)
  }, [orders, filterStatus])

  const statusCountMap = useMemo(() => {
    const map = {}
    for (const s of STATUS_OPTIONS) map[s.value] = 0
    for (const o of orders) {
      if (map[o.status] !== undefined) map[o.status]++
    }
    return map
  }, [orders])

  async function handleChangeStatus(orderId, nextStatus) {
    if (!orderId || !nextStatus) return
    setBusyId(orderId)
    try {
      await onUpdateStatus(orderId, nextStatus)
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(order) {
    const ok = window.confirm(
      `Xóa đơn #${order?.id ?? ''}? Hành động này không thể hoàn tác.`,
    )
    if (!ok) return
    setBusyId(order.id)
    try {
      await onDelete(order.id)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="card">
      <div className="cardHeader">
        <div className="cardHeaderLeft">
          <h2 className="cardTitle">Danh sách đơn hàng</h2>
          <p className="cardSubTitle">
            {loading
              ? 'Đang tải...'
              : `${filtered.length} đơn${filterStatus ? ' (lọc theo trạng thái)' : ''} / ${orders.length} tổng`}
          </p>
        </div>
        <button className="button sm" type="button" onClick={onRefresh} disabled={loading}>
          Làm mới
        </button>
      </div>

      <div className="tableToolbar">
        <span className="toolbarLabel">Lọc theo trạng thái:</span>
        {ALL_STATUS.map((s) => (
          <button
            key={s.value}
            className={`button sm ${filterStatus === s.value ? 'primary' : 'outline'}`}
            type="button"
            onClick={() => setFilterStatus(s.value)}
          >
            {s.label}
            {s.value && statusCountMap[s.value] != null && (
              <span style={{ opacity: 0.7, fontSize: 11 }}>
                {' '}({statusCountMap[s.value]})
              </span>
            )}
          </button>
        ))}
        {filterStatus && (
          <button
            className="button sm outline"
            type="button"
            onClick={() => setFilterStatus('')}
            style={{ marginLeft: 'auto' }}
          >
            Xóa lọc
          </button>
        )}
      </div>

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 56 }}>#</th>
              <th>Khách hàng</th>
              <th style={{ width: 110 }}>SĐT</th>
              <th>Sản phẩm</th>
              <th style={{ width: 60, textAlign: 'center' }}>SL</th>
              <th style={{ width: 130, textAlign: 'right' }}>Tổng tiền (VND)</th>
              <th style={{ width: 200 }}>Trạng thái</th>
              <th style={{ width: 100, textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingSkeleton rows={Math.min(orders.length || 5, 8)} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="emptyCell">
                    <div className="emptyIcon">\uD83D\uDCCB</div>
                    <div>
                      {filterStatus
                        ? 'Không có đơn nào phù hợp'
                        : 'Chưa có đơn hàng nào'}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((o) => {
                const isBusy = busyId === o.id
                return (
                  <tr key={o.id}>
                    <td>
                      <span className="cellId">#{o.id}</span>
                    </td>
                    <td>
                      <div className="cellMain">{o.customer_name || '-'}</div>
                      <div className="cellSub">Tạo: {formatDate(o.created_at)}</div>
                    </td>
                    <td>
                      <span className="cellPhone">{o.phone || '-'}</span>
                    </td>
                    <td>
                      <div className="cellMain">{o.product_name || '-'}</div>
                      {o.note && (
                        <div className="cellSub" title={o.note}>
                          Ghi chú: {o.note.length > 30 ? o.note.slice(0, 30) + '...' : o.note}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="cellQty">{o.quantity ?? '-'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="cellMoney">{formatMoney(o.total_price)} <span style={{ fontSize: 11, fontWeight: 400 }}>VND</span></span>
                    </td>
                    <td>
                      <div className="statusCell">
                        <StatusBadge status={o.status} />
                        <select
                          className="statusSelect"
                          value={o.status || 'pending'}
                          onChange={(e) => handleChangeStatus(o.id, e.target.value)}
                          disabled={loading || isBusy}
                          title="Đổi trạng thái đơn hàng"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <div className="cellSub">Cập nhật: {formatDate(o.updated_at)}</div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="actionCell">
                        <button
                          className="button icon danger"
                          type="button"
                          onClick={() => handleDelete(o)}
                          disabled={loading || isBusy}
                          title="Xóa đơn hàng"
                        >
                          {isBusy ? '...' : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
