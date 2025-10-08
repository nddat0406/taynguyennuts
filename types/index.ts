export interface ProductImages {
  url: string
  isMainImage: boolean
  alt?: string
}

export interface Product {
  id: number 
  name: string
  description: string
  price: number
  product_images: ProductImages[]
  inStock: boolean
  weight: string
  category?: Category
}

export interface User {
  id: string,
  email: string,
  profile?: Profile
}
export interface Profile {
  address: string | null
  fullname: string | null
  province: string | null
  updated_at: string | null
  ward: string | null
  phone: string | null

}
export interface Category {
  id: number
  name: string
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
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: number) => boolean
  getItemQuantity: (productId: number) => number
}
