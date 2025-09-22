import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Have questions? We love to hear from you!</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-pretty">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s.
          </p>
        </div>

        <form className="grid md:grid-cols-2 gap-6">
          <div>
            <Input placeholder="First Name" className="mb-4" />
            <Input placeholder="Last Name" className="mb-4" />
            <Input type="email" placeholder="Email Address" className="mb-4" />
          </div>

          <div>
            <Textarea placeholder="Your Message" className="h-32 mb-4 resize-none" />
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full">Send Message</Button>
          </div>
        </form>
      </div>
    </section>
  )
}
