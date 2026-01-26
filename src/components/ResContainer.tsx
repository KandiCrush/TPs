import { ResultLine } from "./ResultLine";

type Props = {
    pmf?: number;
    cdf?: number;
    tail?: number;
};

export const ResContainer = ({ pmf, cdf, tail }: Props) => {
    return (
        <div className="grid gap-2">
            <ResultLine label="P(X = k)" value={pmf ?? NaN} />
            <ResultLine label="P(X ≤ k)" value={cdf ?? NaN} />
            <ResultLine label="P(X &gt; k)" value={tail ?? NaN} />
        </div>
    );
};
