"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { MapPin, Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/utils"
import useSWR from "swr"

interface Province {
  name: string
  code: number
  codename: string
  division_type: string
  phone_code: number
  wards?: Ward[]
}


interface Ward {
  name: string
  code: number
  codename: string
  division_type: string
  district_code: number
}

export interface Location {
  province?: string
  ward?: string
}

interface AddressInputProps {
  onLocationChange: (field: string, value: string) => void
  location: Location
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const ComboBox = ({
  options,
  placeholder,
  label,
  isLoading,
  selectedValue,
  onSelect,
  disabled,
}: {
  options: { value: string; label: string }[]
  placeholder: string
  label: string
  isLoading: boolean
  selectedValue: string | null
  onSelect: (value: string | null) => void
  disabled?: boolean
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={disabled ? () => {} : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-transparent border-gray-300 hover:bg-amber-50",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          disabled={disabled}
        >
          {isLoading
            ? "Đang tải..."
            : selectedValue
              ? options.find((option) => option.value === selectedValue)?.label
              : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={`Tìm kiếm ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>Không tìm thấy {label.toLowerCase()}.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onSelect(option.value === selectedValue ? null : option.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedValue === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function AddressInput({ onLocationChange, location }: AddressInputProps) {
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null)

  // Fetch provinces
  const { data: provinces = [], isLoading: provincesLoading } = useSWR<Province[]>(
    "https://provinces.open-api.vn/api/v2/?depth=1",
    fetcher,
  )

  // Fetch wards based on selected province
  const { data: provinceData, isLoading: wardsLoading } = useSWR<Province>(
    selectedProvinceCode ? `https://provinces.open-api.vn/api/v2/p/${selectedProvinceCode}?depth=2` : null,
    fetcher,
  )

  // Extract all wards from all districts
  const wards: Ward[] = []
  if (provinceData?.wards) {
    provinceData.wards.forEach((ward) => {
      wards.push(ward)
    })
  }

  // Sync local state with location prop
  useEffect(() => {
    if (location.province && provinces.length > 0) {
      const province = provinces.find((p) => p.name === location.province)
      setSelectedProvinceCode(province?.code || null)
    } else if (!location.province) {
      setSelectedProvinceCode(null)
    }
  }, [location.province, provinces])

  // Convert provinces and wards to Combobox options format
  const provinceOptions = provinces.map((province) => ({
    value: province.code.toString(),
    label: province.name,
  }))

  const wardOptions = wards.map((ward) => ({
    value: ward.code.toString(),
    label: ward.name,
  }))

  // Handle selection changes
  const handleProvinceSelect = (value: string | null) => {
    const province = provinces.find((p) => p.code.toString() === value)
    setSelectedProvinceCode(province?.code || null)
    onLocationChange("province", province?.name || "")
    onLocationChange("ward", "")
  }

  const handleWardSelect = (value: string | null) => {
    const ward = wards.find((w) => w.code.toString() === value)
    onLocationChange("ward", ward?.name || "")
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Province Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Tỉnh/Thành phố *
        </Label>
        <ComboBox
          options={provinceOptions}
          placeholder="Chọn tỉnh/thành phố"
          label="tỉnh/thành phố"
          isLoading={provincesLoading}
          selectedValue={selectedProvinceCode?.toString() || null}
          onSelect={handleProvinceSelect}
        />
      </div>

      {/* Ward Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Phường/Xã
        </Label>
        <ComboBox
          options={wardOptions}
          placeholder="Chọn phường/xã"
          label="phường/xã"
          isLoading={wardsLoading}
          selectedValue={
            location.ward && wards.length > 0
              ? wards.find((w) => w.name === location.ward)?.code.toString() || null
              : null
          }
          onSelect={handleWardSelect}
          disabled={!selectedProvinceCode}
        />
      </div>
    </div>
  )
}
