"use client";
import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Checkbox,
  PlusIcon,
  //   TrashIcon,
} from "@/components";
import { countryOptions } from "@/utils/regions";

type Continent =
  | "Europe"
  | "Asia"
  | "Africa"
  | "North America"
  | "South America"
  | "Oceania";

interface Country {
  code: string;
  name: string;
}

interface ShippingZone {
  zone_name: string;
  continents: Continent[];
  countries: string[];
  delivery_days_min: number;
  delivery_days_max: number;
  shipping_price: number;
  per_order_fee_limit: boolean;
}

const continentOptions: { value: Continent; label: string }[] = [
  { value: "Europe", label: "Europe" },
  { value: "Asia", label: "Asia" },
  { value: "Africa", label: "Africa" },
  { value: "North America", label: "North America" },
  { value: "South America", label: "South America" },
  { value: "Oceania", label: "Oceania" },
];

export default function ShippingZoneForm({
  onZonesChange,
}: {
  onZonesChange: (zones: ShippingZone[]) => void;
}) {
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([
    {
      zone_name: "",
      continents: [],
      countries: [],
      delivery_days_min: 0,
      delivery_days_max: 0,
      shipping_price: 0,
      per_order_fee_limit: false,
    },
  ]);

  const addShippingZone = () => {
    const newZone = {
      zone_name: "",
      continents: [],
      countries: [],
      delivery_days_min: 0,
      delivery_days_max: 0,
      shipping_price: 0,
      per_order_fee_limit: false,
    };
    setShippingZones([...shippingZones, newZone]);
    onZonesChange([...shippingZones, newZone]);
  };

  const removeShippingZone = (index: number) => {
    const newZones = shippingZones.filter((_, i) => i !== index);
    setShippingZones(newZones);
    onZonesChange(newZones);
  };

  const updateZone = (index: number, field: keyof ShippingZone, value: any) => {
    const newZones = [...shippingZones];
    newZones[index] = { ...newZones[index], [field]: value };

    // Reset countries when continents change
    if (field === "continents") {
      newZones[index].countries = [];
    }

    setShippingZones(newZones);
    onZonesChange(newZones);
  };

  const handleCountryToggle = (index: number, countryCode: string) => {
    const newZones = [...shippingZones];
    const currentCountries = newZones[index].countries;

    if (currentCountries.includes(countryCode)) {
      newZones[index].countries = currentCountries.filter(
        (code) => code !== countryCode
      );
    } else {
      newZones[index].countries = [...currentCountries, countryCode];
    }

    setShippingZones(newZones);
    onZonesChange(newZones);
  };

  return (
    <div className="space-y-8">
      {shippingZones.map((zone, index) => (
        <div
          key={index}
          className="p-6 border border-gray-200 rounded-lg space-y-6"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Shipping Zone {index + 1}
              </h3>
              <p className="text-sm text-gray-500">
                Define shipping details for this zone
              </p>
            </div>
            {index > 0 && (
              <Button
                onClick={() => removeShippingZone(index)}
                variant="ghost"
                className="text-red-500 hover:text-red-700"
              >
                x
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Zone Name*</Label>
              <Input
                value={zone.zone_name}
                onChange={(e) => updateZone(index, "zone_name", e.target.value)}
                placeholder="e.g., European Zone"
                className="border-0 bg-[#0000001A] rounded mt-2"
              />
            </div>

            <div>
              <Label>Shipping Price (USD)*</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={zone.shipping_price}
                onChange={(e) =>
                  updateZone(
                    index,
                    "shipping_price",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="border-0 bg-[#0000001A] rounded mt-2"
              />
            </div>

            <div>
              <Label>Continents*</Label>
              <select
                multiple
                value={zone.continents}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value as Continent
                  );
                  updateZone(index, "continents", values);
                }}
                className="w-full border-0 bg-[#0000001A] rounded mt-2 h-[120px] p-2"
              >
                {continentOptions.map((continent) => (
                  <option key={continent.value} value={continent.value}>
                    {continent.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple continents
              </p>
            </div>

            <div>
              <Label>Countries*</Label>
              <div className="mt-2 border rounded-md bg-[#0000001A] p-4 max-h-[300px] overflow-y-auto">
                {zone.continents.map((continent: Continent) => (
                  <div key={continent} className="mb-4">
                    <h4 className="font-medium mb-2">{continent}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {countryOptions[continent]?.map((country) => (
                        <div
                          key={country.code}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${index}-${country.code}`}
                            checked={zone.countries.includes(country.code)}
                            onCheckedChange={() =>
                              handleCountryToggle(index, country.code)
                            }
                          />
                          <label
                            htmlFor={`${index}-${country.code}`}
                            className="text-sm cursor-pointer"
                          >
                            {country.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {zone.continents.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    Please select continents first
                  </p>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Selected countries: {zone.countries.length}
              </div>
            </div>

            <div>
              <Label>Minimum Delivery Days*</Label>
              <Input
                type="number"
                min="0"
                value={zone.delivery_days_min}
                onChange={(e) =>
                  updateZone(
                    index,
                    "delivery_days_min",
                    parseInt(e.target.value) || 0
                  )
                }
                className="border-0 bg-[#0000001A] rounded mt-2"
              />
            </div>

            <div>
              <Label>Maximum Delivery Days*</Label>
              <Input
                type="number"
                min="0"
                value={zone.delivery_days_max}
                onChange={(e) =>
                  updateZone(
                    index,
                    "delivery_days_max",
                    parseInt(e.target.value) || 0
                  )
                }
                className="border-0 bg-[#0000001A] rounded mt-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6">
            <Checkbox
              checked={zone.per_order_fee_limit}
              onCheckedChange={(checked) =>
                updateZone(index, "per_order_fee_limit", checked)
              }
            />
            <Label className="font-normal text-sm">
              Customer will pay only one shipping fee per order (limited to 5
              items/order)
            </Label>
          </div>
        </div>
      ))}

      <Button
        onClick={addShippingZone}
        className="flex items-center gap-2"
        variant="outline"
        type="button"
      >
        x Add Another Shipping Zone
      </Button>
    </div>
  );
}
