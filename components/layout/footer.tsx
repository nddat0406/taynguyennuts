import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-amber-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">TN</span>
              </div>
              <span className="text-2xl font-bold">Tây Nguyên Nuts</span>
            </div>
            <p className="text-amber-100 leading-relaxed mb-6 max-w-md">
              Mang đến những sản phẩm nông sản chất lượng cao từ Tây Nguyên, kết nối người tiêu dùng với nông dân địa
              phương.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-300" />
                <span className="text-amber-100">0123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-300" />
                <span className="text-amber-100">info@taynyguennuts.vn</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-300 mt-1" />
                <span className="text-amber-100">
                  123 Đường ABC, Quận XYZ
                  <br />
                  TP. Hồ Chí Minh, Việt Nam
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Liên kết</h3>
            <div className="space-y-3">
              <a href="#products" className="block text-amber-100 hover:text-white transition-colors">
                Sản phẩm
              </a>
              <a href="#story" className="block text-amber-100 hover:text-white transition-colors">
                Câu chuyện
              </a>
              <a href="#" className="block text-amber-100 hover:text-white transition-colors">
                Chính sách
              </a>
              <a href="#" className="block text-amber-100 hover:text-white transition-colors">
                Hướng dẫn
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-12 pt-8 text-center">
          <p className="text-amber-200">© 2024 Tây Nguyên Nuts. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
