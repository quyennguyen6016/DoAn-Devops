import { useEffect, useRef, useState } from 'react'
import OrderForm from './components/OrderForm.jsx'
import OrderList from './components/OrderList.jsx'
import {
  createOrder,
  deleteOrder,
  getOrders,
  healthCheck,
  updateStatus,
} from './api/orderApi.js'

function App() {
  const [orders, setOrders] = useState([])
  const [loadingList, setLoadingList] = useState(false)
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)

  function showToast(type, message) {
    setToast({ type, message })
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(null), 4000)
  }

  async function loadOrders() {
    setLoadingList(true)
    try {
      const data = await getOrders()
      const list = Array.isArray(data) ? data : data?.data || data?.orders
      setOrders(Array.isArray(list) ? list : [])
    } catch (e) {
      showToast('error', e.message || 'Không tải được danh sách đơn hàng.')
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function boot() {
      try {
        await healthCheck()
        if (!cancelled) showToast('success', 'Kết nối máy chủ thành công.')
      } catch (e) {
        if (!cancelled) {
          showToast('error', e.message || 'Không thể kết nối máy chủ.')
        }
      } finally {
        if (!cancelled) loadOrders()
      }
    }

    boot()

    return () => {
      cancelled = true
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    }
  }, [])

  async function handleCreate(payload) {
    setCreating(true)
    try {
      await createOrder(payload)
      showToast('success', 'Tạo đơn hàng thành công.')
      await loadOrders()
    } catch (e) {
      showToast('error', e.message || 'Tạo đơn hàng thất bại.')
    } finally {
      setCreating(false)
    }
  }

  const STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipping: 'Đang giao',
    completed: 'Hoàn tất',
    cancelled: 'Đã hủy',
  }

  async function handleUpdateStatus(id, status) {
    const label = STATUS_LABELS[status] || status
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o)),
    )
    try {
      await updateStatus(id, status)
      showToast('success', `Cập nhật trạng thái thành "${label}" thành công.`)
    } catch (e) {
      showToast('error', e.message || 'Cập nhật trạng thái thất bại.')
      await loadOrders()
    }
  }

  async function handleDelete(id) {
    try {
      await deleteOrder(id)
      showToast('success', 'Xoá đơn hàng thành công.')
      await loadOrders()
    } catch (e) {
      showToast('error', e.message || 'Xoá đơn hàng thất bại.')
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brandTitle">Hệ thống Theo dõi Đơn hàng</div>
          <div className="brandSub">Quản lý đơn: tạo mới, cập nhật trạng thái và xoá</div>
        </div>
        <div className="topbarRight">
          <span className="hint">
            {import.meta.env.VITE_API_URL || 'chưa-cấu-hình'}
          </span>
        </div>
      </header>

      <div className="pageContent">
        <OrderForm onCreate={handleCreate} loading={creating} />
        <OrderList
          orders={orders}
          loading={loadingList}
          onRefresh={loadOrders}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      </div>

      {toast && (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          <span className="toastIcon">{toast.type === 'success' ? '\u2713' : '\u2717'}</span>
          <div className="toastMsg">{toast.message}</div>
          <button className="toastClose" type="button" onClick={() => setToast(null)} title="Đóng">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default App
