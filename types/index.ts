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
