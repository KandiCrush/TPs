import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const NumberInput = ({
    id,
    label,
    value,
    onChange,
    step = "1",
    min,
    max,
    placeholder,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    step?: string;
    min?: number;
    max?: number;
    placeholder?: string;
}) => {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                step={step}
                min={min}
                max={max}
                placeholder={placeholder}
            />
        </div>
    );
};
