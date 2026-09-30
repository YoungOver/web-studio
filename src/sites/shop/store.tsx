import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DELIVERY_COST, FREE_DELIVERY, PROMO, byId, type Volume } from './data'

export interface CartLine {
  id: string
  vol: Volume
  qty: number
}

export interface Flight {
  key: number
  id: string
  from: DOMRect
}

interface Shop {
  cart: CartLine[]
  add: (id: string, vol: Volume, qty?: number, from?: DOMRect | null) => void
  setQty: (id: string, vol: Volume, qty: number) => void
  remove: (id: string, vol: Volume) => void
  count: number
  subtotal: number
  discount: number
  delivery: number
  total: number
  promo: string | null
  applyPromo: (code: string) => boolean
  clearPromo: () => void
  drawer: boolean
  setDrawer: (v: boolean) => void
  product: string | null
  openProduct: (id: string | null) => void
  flights: Flight[]
  land: (key: number) => void
  bump: number
}

const Ctx = createContext<Shop | null>(null)
const KEY = 'lavanda-cart-v1'

// The demo opens with one serum already in the cart so the free-delivery bar reads «1 200 ₽».
const START: CartLine[] = [{ id: 'serum-lavender', vol: 30, qty: 1 }]

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const v = JSON.parse(raw) as CartLine[]
      if (Array.isArray(v)) return v.filter((l) => byId(l.id))
    }
  } catch {
    /* storage unavailable */
  }
  return START
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(load)
  const [promo, setPromo] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)
  const [product, openProduct] = useState<string | null>(null)
  const [flights, setFlights] = useState<Flight[]>([])
  const [bump, setBump] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(cart))
    } catch {
      /* ignore */
    }
  }, [cart])

  const add = useCallback((id: string, vol: Volume, qty = 1, from?: DOMRect | null) => {
    setCart((c) => {
      const i = c.findIndex((l) => l.id === id && l.vol === vol)
      if (i < 0) return [...c, { id, vol, qty }]
      const next = c.slice()
      next[i] = { ...next[i], qty: next[i].qty + qty }
      return next
    })
    if (from) setFlights((f) => [...f, { key: Date.now() + Math.random(), id, from }])
    else setBump((b) => b + 1)
  }, [])

  const land = useCallback((key: number) => {
    setFlights((f) => f.filter((x) => x.key !== key))
    setBump((b) => b + 1)
  }, [])

  const setQty = useCallback((id: string, vol: Volume, qty: number) => {
    setCart((c) =>
      qty <= 0 ? c.filter((l) => !(l.id === id && l.vol === vol)) : c.map((l) => (l.id === id && l.vol === vol ? { ...l, qty } : l)),
    )
  }, [])

  const remove = useCallback((id: string, vol: Volume) => setCart((c) => c.filter((l) => !(l.id === id && l.vol === vol))), [])

  const applyPromo = useCallback((code: string) => {
    const k = code.trim().toUpperCase()
    if (PROMO[k] !== undefined) {
      setPromo(k)
      return true
    }
    return false
  }, [])

  const value = useMemo<Shop>(() => {
    const count = cart.reduce((s, l) => s + l.qty, 0)
    const subtotal = cart.reduce((s, l) => s + byId(l.id).prices[l.vol] * l.qty, 0)
    const discount = promo ? Math.round(subtotal * PROMO[promo]) : 0
    const after = subtotal - discount
    const delivery = count === 0 || after >= FREE_DELIVERY ? 0 : DELIVERY_COST
    return {
      cart,
      add,
      setQty,
      remove,
      count,
      subtotal,
      discount,
      delivery,
      total: after + delivery,
      promo,
      applyPromo,
      clearPromo: () => setPromo(null),
      drawer,
      setDrawer,
      product,
      openProduct,
      flights,
      land,
      bump,
    }
  }, [cart, add, setQty, remove, promo, applyPromo, drawer, product, flights, land, bump])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useShop() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useShop outside ShopProvider')
  return v
}
