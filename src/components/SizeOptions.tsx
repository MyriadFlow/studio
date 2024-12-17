// components/SizeOptions.tsx
import { useState, useEffect } from "react";
import { Checkbox, Input, Label } from "@/components";

interface SizeDetails {
  selected: boolean;
  quantity: number;
  additional_details: string;
}

interface SizeOptionsProps {
  variant: "rare" | "phygital";
  onSizeChange: (sizeData: {
    option: number;
    details: Array<{
      size: string;
      quantity: number;
      additional_details: string;
    }> | null;
  }) => void;
  totalQuantity: number;
}

export default function SizeOptions({
  variant,
  onSizeChange,
  totalQuantity,
}: SizeOptionsProps) {
  const [sizeOption, setSizeOption] = useState<number>(0);
  const [specifications, setSpecifications] = useState<string>("");
  const [specificSizes, setSpecificSizes] = useState<
    Record<string, SizeDetails>
  >({
    XS: { selected: false, quantity: 0, additional_details: "" },
    S: { selected: false, quantity: 0, additional_details: "" },
    M: { selected: false, quantity: 0, additional_details: "" },
    L: { selected: false, quantity: 0, additional_details: "" },
    XL: { selected: false, quantity: 0, additional_details: "" },
    XXL: { selected: false, quantity: 0, additional_details: "" },
  });

  const [quantityError, setQuantityError] = useState<string>("");

  useEffect(() => {
    if (variant === "phygital" && sizeOption === 3) {
      const totalSizeQuantity = Object.values(specificSizes).reduce(
        (sum, size) => sum + (size.selected ? size.quantity : 0),
        0
      );

      if (totalSizeQuantity !== totalQuantity) {
        setQuantityError(`Total quantity must equal ${totalQuantity}`);
      } else {
        setQuantityError("");
      }
    }
  }, [specificSizes, totalQuantity, variant, sizeOption]);

  const handleSizeOptionChange = (option: number) => {
    setSizeOption(option);
    const details =
      option === 2
        ? [
            {
              size: "Specification",
              quantity: 0,
              additional_details: specifications,
            },
          ]
        : option === 3
        ? Object.entries(specificSizes)
            .filter(([_, details]) => details.selected)
            .map(([size, details]) => ({
              size,
              quantity: details.quantity,
              additional_details: details.additional_details || "",
            }))
        : null;

    onSizeChange({
      option,
      details,
    });
  };

  const handleSpecificSizeChange = (
    size: string,
    field: keyof SizeDetails,
    value: any
  ) => {
    const updatedSizes = {
      ...specificSizes,
      [size]: {
        ...specificSizes[size],
        [field]: value,
        ...(field === "selected" && {
          quantity: value ? specificSizes[size].quantity || 0 : 0,
        }),
      },
    };
    setSpecificSizes(updatedSizes);
    if (sizeOption === 3) {
      handleSizeOptionChange(3);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Sizes*</Label>
      <p className="text-sm text-gray-500">Choose one of the options.</p>

      <div className="flex items-center space-x-2">
        <input
          type="radio"
          checked={sizeOption === 1}
          onChange={() => handleSizeOptionChange(1)}
          name="sizeOption"
        />
        <Label>This product is available in one size only</Label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="radio"
          checked={sizeOption === 2}
          onChange={() => handleSizeOptionChange(2)}
          name="sizeOption"
        />
        <Label>One size with specific measurements</Label>
        {sizeOption === 2 && (
          <Input
            placeholder="height, length, width"
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
            className="border-0 bg-[#0000001A] rounded w-64"
          />
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="radio"
          checked={sizeOption === 3}
          onChange={() => handleSizeOptionChange(3)}
          name="sizeOption"
        />
        <Label>This product is available in different sizes</Label>
      </div>

      {sizeOption === 3 && (
        <>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {Object.entries(specificSizes).map(([size, details]) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  checked={details.selected}
                  onCheckedChange={(checked) =>
                    handleSpecificSizeChange(size, "selected", checked)
                  }
                />
                <Label>{size}</Label>
                <Input
                  disabled={!details.selected}
                  type="number"
                  min="0"
                  placeholder="Quantity"
                  value={details.quantity || ""}
                  onChange={(e) =>
                    handleSpecificSizeChange(
                      size,
                      "quantity",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className={`border-0 rounded w-24 ${
                    details.selected ? "bg-[#0000001A]" : "bg-gray-100"
                  }`}
                />
              </div>
            ))}
          </div>
          {quantityError && (
            <p className="text-red-500 text-sm">{quantityError}</p>
          )}
        </>
      )}
    </div>
  );
}
