"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Send } from "lucide-react"

export function ContactForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Gửi tin nhắn thành công!",
      description: "Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.",
    })

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-amber-900">
          Họ và tên <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Nguyễn Văn A"
          className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-amber-900">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="email@example.com"
            className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-amber-900">
            Số điện thoại
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0123 456 789"
            className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-amber-900">
          Tiêu đề <span className="text-red-500">*</span>
        </Label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder="Tôi muốn hỏi về..."
          className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-amber-900">
          Nội dung <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Nhập nội dung tin nhắn của bạn..."
          rows={6}
          className="border-amber-300 focus:border-amber-500 focus:ring-amber-500 resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg font-semibold"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Đang gửi...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Gửi tin nhắn
          </>
        )}
      </Button>
    </form>
  )
}
