"use client"

import { CartContextType, CartItem, CartState, Product } from "@/types"
import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: "ADD_TO_CART"; product: Product; quantity: number }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; cart: CartState }

const initialCartState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
}

function calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItemIndex = state.items.findIndex((item) => item.product.id === action.product.id)

      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + action.quantity } : item,
        )
      } else {
        // Add new item
        newItems = [...state.items, { product: action.product, quantity: action.quantity }]
      }

      const { total, itemCount } = calculateCartTotals(newItems)
      return { items: newItems, total, itemCount }
    }

    case "REMOVE_FROM_CART": {
      const newItems = state.items.filter((item) => String(item.product.id) !== String(action.productId))
      const { total, itemCount } = calculateCartTotals(newItems)
      return { items: newItems, total, itemCount }
    }

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const newItems = state.items.filter((item) => String(item.product.id) !== String(action.productId))
        const { total, itemCount } = calculateCartTotals(newItems)
        return { items: newItems, total, itemCount }
      }

      const newItems = state.items.map((item) =>
        String(item.product.id) === String(action.productId) ? { ...item, quantity: action.quantity } : item,
      )
      const { total, itemCount } = calculateCartTotals(newItems)
      return { items: newItems, total, itemCount }
    }

    case "CLEAR_CART":
      return initialCartState

    case "LOAD_CART":
      return action.cart

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("tay-nguyen-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", cart: parsedCart })
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tay-nguyen-cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, quantity = 1) => {
    if (!product.inStock) return
    dispatch({ type: "ADD_TO_CART", product, quantity })
  }

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const isInCart = (productId: string): boolean => {
    return cart.items.some((item) => String(item.product.id) === String(productId))
  }

  const getItemQuantity = (productId: string): number => {
    const item = cart.items.find((item) => String(item.product.id) === String(productId))
    return item ? item.quantity : 0
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
