import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Điện thoại",
      content: "0979938675",
      subContent: "Thứ 2 - Chủ nhật: 8:00 - 20:00",
    },
    {
      icon: Mail,
      title: "Email",
      content: "taynguyennuts.exe201@gmail.com",
      subContent: "Phản hồi trong vòng 24h",
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "Đại học FPT Hà Nội",
      subContent: "Khu Công Nghệ Cao Hòa Lạc, km 29, Đại lộ, Thăng Long, Hà Nội",
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "Thứ 2 - Chủ nhật",
      subContent: "8:00 - 20:00",
    },
  ]

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-800 to-orange-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Liên hệ với chúng tôi</h1>
              <p className="text-xl text-amber-100 max-w-3xl mx-auto leading-relaxed">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin, chúng tôi sẽ phản hồi trong thời
                gian sớm nhất.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-8 h-8 text-amber-800" />
                    </div>
                    <h3 className="font-bold text-amber-900 mb-2">{info.title}</h3>
                    <p className="text-gray-900 font-medium mb-1">{info.content}</p>
                    <p className="text-sm text-gray-600">{info.subContent}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form and Map Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card className="border-amber-200 shadow-xl">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold text-amber-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>
                  <ContactForm />
                </CardContent>
              </Card>

              {/* Map and Social */}
              <div className="space-y-6">
                <Card className="border-amber-200 shadow-xl overflow-hidden">
                  <div className="aspect-video bg-amber-100 relative">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8835.927008642127!2d105.526499!3d21.013705000000005!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be9d7d0b5abcbf4!2sFPT%20University!5e1!3m2!1sen!2sus!4v1760000179794!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Bản đồ vị trí"
                    />
                  </div>
                </Card>

                <Card className="border-amber-200 shadow-xl">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-amber-900 mb-4">Kết nối với chúng tôi</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Theo dõi chúng tôi trên mạng xã hội để cập nhật những sản phẩm mới nhất và các chương trình khuyến
                      mãi hấp dẫn.
                    </p>
                    <div className="flex gap-4">
                      <a
                        href="https://www.facebook.com/profile.php?id=61581550020967"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                        <span className="font-medium">Facebook</span>
                      </a>
                      <a
                        href="https://www.facebook.com/profile.php?id=61581550020967"
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors"
                      >
                        <img src="/Icon_of_Zalo.svg.webp" alt="Zalo" className="w-5 h-5" />
                        <span className="font-medium">Zalo</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-amber-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">Câu hỏi thường gặp</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Thời gian giao hàng là bao lâu?",
                  a: "Đơn hàng trong nội thành Hà Nội sẽ được giao trong vòng 1-2 ngày. Đơn hàng ngoại thành và các tỉnh khác từ 3-5 ngày làm việc.",
                },
                {
                  q: "Tôi có thể đổi trả hàng không?",
                  a: "Chúng tôi chấp nhận đổi trả trong vòng 7 ngày nếu sản phẩm còn nguyên vẹn, chưa sử dụng và có đầy đủ hóa đơn.",
                },
                {
                  q: "Làm sao để bảo quản sản phẩm?",
                  a: "Nên bảo quản sản phẩm ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Sau khi mở bao bì, nên cho vào hộp kín và sử dụng trong vòng 1 tháng.",
                },
                {
                  q: "Có chương trình khuyến mãi nào không?",
                  a: "Chúng tôi thường xuyên có các chương trình khuyến mãi vào dịp lễ, tết. Theo dõi fanpage để cập nhật thông tin mới nhất.",
                },
              ].map((faq, index) => (
                <Card key={index} className="border-amber-200">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-amber-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
