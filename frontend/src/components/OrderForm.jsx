import { useCallback, useMemo, useState } from 'react'

const initialForm = {
  customer_name: '',
  phone: '',
  product_name: '',
  quantity: 1,
  total_price: '',
  note: '',
}

// Vietnam mobile prefixes (09, 08, 07, 05, 03)
const PHONE_PREFIXES = ['09', '08', '07', '05', '03']
const isValidVietPhone = (v) => {
  const cleaned = v.replace(/\D/g, '')
  if (cleaned.length < 10 || cleaned.length > 11) return false
  if (!PHONE_PREFIXES.some((p) => cleaned.startsWith(p))) return false
  return true
}

const MAX_INT = 9_999_999_999

export default function OrderForm({ onCreate, loading }) {
  const [form, setForm] = useState(initialForm)
  const [touched, setTouched] = useState(false)

  const errors = useMemo(() => {
    const e = {}

    const name = form.customer_name?.trim()
    if (!name) {
      e.customer_name = 'Bắt buộc'
    } else if (name.length < 2) {
      e.customer_name = 'Tối thiểu 2 ký tự'
    } else if (name.length > 100) {
      e.customer_name = 'Tối đa 100 ký tự'
    } else if (/\d/.test(name)) {
      e.customer_name = 'Không được chứa số'
    }

    const phone = form.phone?.trim()
    if (!phone) {
      e.phone = 'Bắt buộc'
    } else if (!isValidVietPhone(phone)) {
      e.phone = 'SĐT không hợp lệ (10-11 số, đầu 03/05/07/08/09)'
    }

    const product = form.product_name?.trim()
    if (!product) {
      e.product_name = 'Bắt buộc'
    } else if (product.length < 2) {
      e.product_name = 'Tối thiểu 2 ký tự'
    } else if (product.length > 200) {
      e.product_name = 'Tối đa 200 ký tự'
    }

    const qty = Number(form.quantity)
    if (!Number.isFinite(qty) || qty < 1) {
      e.quantity = 'Phải từ 1 trở lên'
    } else if (!Number.isInteger(qty) || qty > 9999) {
      e.quantity = 'Tối đa 9.999'
    }

    if (form.total_price !== '') {
      const total = Number(form.total_price)
      if (!Number.isFinite(total) || total < 0) {
        e.total_price = 'Số không hợp lệ'
      } else if (total > MAX_INT) {
        e.total_price = 'Số quá lớn'
      }
    }

    if (form.note && form.note.length > 500) {
      e.note = 'Tối đa 500 ký tự'
    }

    return e
  }, [form])

  const isValid = Object.keys(errors).length === 0

  const setField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (!isValid || loading) return

    const payload = {
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim(),
      product_name: form.product_name.trim(),
      quantity: Number(form.quantity),
      total_price: form.total_price === '' ? 0 : Number(form.total_price),
      note: form.note?.trim() || '',
    }

    await onCreate(payload)
    setForm(initialForm)
    setTouched(false)
  }

  function fieldClass(name) {
    return touched && errors[name] ? 'input inputError' : 'input'
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="cardHeader">
        <div className="cardHeaderLeft">
          <h2 className="cardTitle">Tạo đơn hàng mới</h2>
          <p className="cardSubTitle">Nhập thông tin và nhấn Tạo đơn</p>
        </div>
      </div>

      <div className="formGrid">
        <div className="field">
          <label className="label" htmlFor="customer_name">Tên khách hàng</label>
          <input
            id="customer_name"
            className={fieldClass('customer_name')}
            placeholder="VD: Nguyen Van A"
            value={form.customer_name}
            onChange={(e) => setField('customer_name', e.target.value.replace(/\d/g, ''))}
            autoComplete="name"
          />
          {errors.customer_name && (
            <span className="errorText">{errors.customer_name}</span>
          )}
        </div>

        <div className="field">
          <label className="label" htmlFor="phone">Số điện thoại</label>
          <input
            id="phone"
            className={fieldClass('phone')}
            placeholder="VD: 0901234567"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            inputMode="tel"
            autoComplete="tel"
          />
          {errors.phone && (
            <span className="errorText">{errors.phone}</span>
          )}
        </div>

        <div className="field">
          <label className="label" htmlFor="product_name">Sản phẩm</label>
          <input
            id="product_name"
            className={fieldClass('product_name')}
            placeholder="VD: Ao thun"
            value={form.product_name}
            onChange={(e) => setField('product_name', e.target.value)}
            autoComplete="off"
          />
          {errors.product_name && (
            <span className="errorText">{errors.product_name}</span>
          )}
        </div>

        <div className="field">
          <label className="label" htmlFor="quantity">Số lượng</label>
          <input
            id="quantity"
            className={fieldClass('quantity')}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="1"
            value={form.quantity}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, '')
              setField('quantity', v === '' ? '' : Number(v))
            }}
          />
          {errors.quantity && (
            <span className="errorText">{errors.quantity}</span>
          )}
        </div>

        <div className="field">
          <label className="label" htmlFor="total_price">Tổng tiền</label>
          <div className="inputSuffixWrap">
            <input
              id="total_price"
              className={fieldClass('total_price')}
              type="text"
              inputMode="numeric"
              placeholder="VD: 150.000"
              value={form.total_price}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, '')
                setField('total_price', v === '' ? '' : Number(v))
              }}
            />
            <span className="inputSuffix">VND</span>
          </div>
          {errors.total_price && (
            <span className="errorText">{errors.total_price}</span>
          )}
        </div>

        <div className="field formFullRow">
          <label className="label" htmlFor="note">
            Ghi chú
            <span className="labelOptional">(tuỳ chọn)</span>
          </label>
          <textarea
            id="note"
            className={touched && errors.note ? 'textarea textareaError' : 'textarea'}
            placeholder="VD: Giao giờ hành chính, đóng gói cẩn thận..."
            value={form.note}
            onChange={(e) => setField('note', e.target.value)}
            rows={2}
          />
          {errors.note && (
            <span className="errorText">{errors.note}</span>
          )}
        </div>
      </div>

      <div className="actions">
        <button className="button primary" type="submit" disabled={loading || !isValid}>
          {loading ? 'Đang tạo...' : 'Tạo đơn'}
        </button>
        <button
          className="button outline"
          type="button"
          disabled={loading}
          onClick={() => {
            setForm(initialForm)
            setTouched(false)
          }}
        >
          Xóa nhập
        </button>
      </div>
    </form>
  )
}
