export const ResultLine = ({
    label,
    value,
}: {
    label: string;
    value: number;
}) => {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{label}</span>
            <span className="tabular-nums">
                {Number.isFinite(value) ? `${value.toPrecision(12)}` : "—"}
            </span>
        </div>
    );
};
