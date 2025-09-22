import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

const features = [
  "No shopping or cleaning",
  "Heat 2 minutes in the microwave",
  "Heat 8 minutes in the oven",
  "Lunch and Dinner options",
  "Healthy beverages",
  "On the go snacks",
]

const plans = [
  {
    title: "6 Meals Per Week",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
    price: "$12.89",
    period: "meal",
    image: "/healthy-meal-bowl-with-vegetables.jpg",
  },
  {
    title: "8 Meals Per Week",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
    price: "$13.19",
    period: "meal",
    image: "/gourmet-meal-plate-with-protein-and-vegetables.jpg",
  },
  {
    title: "10 Meals Per Week",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
    price: "$13.59",
    period: "meal",
    image: "/fresh-salad-bowl-with-greens.jpg",
  },
  {
    title: "14 Meals Per Week",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
    price: "$13.99",
    period: "meal",
    image: "/nutritious-meal-with-salmon-and-vegetables.jpg",
  },
]

export function PlansSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-green-600 mb-8">Our plans</h2>
            </div>

            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {plans.map((plan, index) => (
            <Card key={index} className="overflow-hidden border border-gray-200">
              <div className="aspect-video">
                <img src={plan.image || "/placeholder.svg"} alt={plan.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-600 text-lg mb-2">{plan.title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{plan.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-800">
                    {plan.price} / {plan.period}
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white text-sm px-6 py-2 rounded-full">
                    Start Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
