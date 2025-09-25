export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: "nuts" | "coffee" | "dried-fruits" | "specialties"
  inStock: boolean
  weight?: string
  origin?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar?: string
  rating: number
}

export interface CompanyValue {
  id: string
  title: string
  description: string
  icon: string
}

export interface ContactInfo {
  phone: string
  email: string
  address: string
  workingHours: string
}

export interface SocialLinks {
  facebook?: string
  instagram?: string
  youtube?: string
  zalo?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface CartContextType {
  cart: CartState
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
  getItemQuantity: (productId: string) => number
}
