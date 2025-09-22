import { Button } from "@/components/ui/button"

export function IngredientsSection() {
  return (
    <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rINHlAZH3AiUX4hYfYkhKoLCpTdvU6.png')`,
          backgroundAttachment: "fixed",
        }}
      />

      <div className="relative z-10 max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Starting At</h2>
          <div className="text-3xl font-bold text-green-600 mb-4">$12.89 Per Meal</div>
          <p className="text-gray-600 mb-6 text-pretty">
            Lorem ipsum dolor amet, consectetur adipiscing elit, sed do incididunt ut dolore magna aliqua.
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full">Pick A Plan</Button>
        </div>
      </div>
    </section>
  )
}
