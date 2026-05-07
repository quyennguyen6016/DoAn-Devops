import { useEffect, useMemo, useRef, useState } from 'react'
import OrderForm from './components/OrderForm.jsx'
import OrderList from './components/OrderList.jsx'
import {
  createOrder,
  deleteOrder,
  getOrders,
  healthCheck,
  updateStatus,
} from './api/orderApi.js'

function createMockOrders() {
  // Mock data để thử UI khi backend chưa sẵn sàng (chỉ nên dùng ở môi trường dev).
  const now = Date.now()
  const iso = (msAgo) => new Date(now - msAgo).toISOString()

  return [
    {
      id: 1001,
      customer_name: 'Nguyễn Văn An',
      phone: '0901234567',
      product_name: 'Áo thun basic',
      quantity: 2,
      total_price: 298000,
      status: 'pending',
      note: 'Giao giờ hành chính',
      created_at: iso(1000 * 60 * 60 * 6),
      updated_at: iso(1000 * 60 * 10),
    },
    {
      id: 1002,
      customer_name: 'Trần Thị Bình',
      phone: '0987654321',
      product_name: 'Giày sneaker',
      quantity: 1,
      total_price: 799000,
      status: 'confirmed',
      note: '',
      created_at: iso(1000 * 60 * 60 * 30),
      updated_at: iso(1000 * 60 * 60 * 2),
    },
    {
      id: 1003,
      customer_name: 'Lê Quốc Cường',
      phone: '0911222333',
      product_name: 'Tai nghe Bluetooth',
      quantity: 1,
      total_price: 459000,
      status: 'shipping',
      note: 'Gọi trước khi giao',
      created_at: iso(1000 * 60 * 60 * 54),
      updated_at: iso(1000 * 60 * 30),
    },
    {
      id: 1004,
      customer_name: 'Phạm Thu Dung',
      phone: '0933444555',
      product_name: 'Bình giữ nhiệt 500ml',
      quantity: 3,
      total_price: 357000,
      status: 'completed',
      note: 'Xuất hoá đơn giúp mình',
      created_at: iso(1000 * 60 * 60 * 90),
      updated_at: iso(1000 * 60 * 60 * 24),
    },
    {
      id: 1005,
      customer_name: 'Hoàng Gia Huy',
      phone: '0977000111',
      product_name: 'Balo laptop 15"',
      quantity: 1,
      total_price: 520000,
      status: 'cancelled',
      note: 'Khách đổi ý',
      created_at: iso(1000 * 60 * 60 * 12),
      updated_at: iso(1000 * 60 * 60 * 3),
    },
  ]
}

function App() {
  const [orders, setOrders] = useState([])
  const [loadingList, setLoadingList] = useState(false)
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)

  const apiUrlHint = useMemo(() => import.meta.env.VITE_API_URL, [])
  const [usingMock, setUsingMock] = useState(false)

  function showToast(type, message) {
    setToast({ type, message })
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3500)
  }

  async function loadOrders() {
    setLoadingList(true)
    try {
      const data = await getOrders()
      const list = Array.isArray(data) ? data : data?.data || data?.orders
      setOrders(Array.isArray(list) ? list : [])
      setUsingMock(false)
    } catch (e) {
      if (import.meta.env.DEV) {
        setOrders(createMockOrders())
        setUsingMock(true)
        showToast('error', 'Không tải được từ API. Đang hiển thị dữ liệu mẫu để thử giao diện.')
      } else {
        showToast('error', e.message || 'Không tải được danh sách đơn hàng.')
      }
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
          const extra = apiUrlHint ? '' : ' (Vui lòng cấu hình VITE_API_URL)'
          if (import.meta.env.DEV) {
            setOrders(createMockOrders())
            setUsingMock(true)
            showToast(
              'error',
              `Không thể kết nối máy chủ${extra}. Đang hiển thị dữ liệu mẫu để thử giao diện.`,
            )
          } else {
            showToast('error', `${e.message || 'Không thể kết nối máy chủ.'}${extra}`)
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function handleUpdateStatus(id, status) {
    try {
      await updateStatus(id, status)
      showToast('success', 'Cập nhật trạng thái thành công.')
      await loadOrders()
    } catch (e) {
      showToast('error', e.message || 'Cập nhật trạng thái thất bại.')
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
          <div className="brandSub">
            Quản lý đơn: tạo mới, cập nhật trạng thái và xoá.
          </div>
        </div>
        <div className="topbarRight">
          <span className="hint">
            API: <span className="mono">{apiUrlHint || '(chưa cấu hình)'}</span>
          </span>
          {usingMock ? <span className="hint">Đang dùng dữ liệu mẫu</span> : null}
        </div>
      </header>

      <main className="layout">
        <OrderForm onCreate={handleCreate} loading={creating} />
        <OrderList
          orders={orders}
          loading={loadingList}
          onRefresh={loadOrders}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      </main>

      {toast ? (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          <div className="toastMsg">{toast.message}</div>
          <button className="toastClose" type="button" onClick={() => setToast(null)}>
            Đóng
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default App
