"use client";

import { NumberInput } from "@/src/components/NumberInput";
import { ResContainer } from "@/src/components/ResContainer";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { TabsContent } from "@/src/components/ui/tabs";
import { binomialCDF, binomialPMF } from "@/src/lib/prob";
import { useState } from "react";

export const BinComp = () => {
    const [nB, setNB] = useState("10");
    const [pB, setPB] = useState("0.3");
    const [kB, setKB] = useState("3");
    const [resB, setResB] = useState<{
        pmf?: number;
        cdf?: number;
        tail?: number;
        err?: string;
    }>({});

    const handleBinomial = () => {
        try {
            const n = parseInt(nB, 10);
            const p = parseFloat(pB);
            const k = parseInt(kB, 10);
            const pmf = binomialPMF(n, p, k);
            const cdf = binomialCDF(n, p, k);
            setResB({ pmf, cdf, tail: 1 - cdf, err: undefined });
        } catch (e: unknown) {
            if (e instanceof Error) {
                setResB({ err: e.message });
            } else {
                setResB({ err: "Une erreur inconnue est survenue." });
                console.log({ e });
            }
        }
    };

    return (
        <TabsContent value="binomiale" className="mt-4">
            <p className="text-sm text-muted-foreground mb-3">
                Conseil : n ≤ 10 000 pour de bons temps de calcul, p dans [0,1].
            </p>
            <div className="grid grid-cols-2 gap-4">
                <NumberInput
                    id="nB"
                    label="n (essais)"
                    value={nB}
                    onChange={setNB}
                    min={0}
                />
                <NumberInput
                    id="pB"
                    label="p (succès)"
                    value={pB}
                    onChange={setPB}
                    step="0.001"
                    min={0}
                    max={1}
                />
                <NumberInput
                    id="kB"
                    label="k (valeur)"
                    value={kB}
                    onChange={setKB}
                    min={0}
                />
            </div>
            <div className="mt-4 flex gap-2">
                <Button onClick={handleBinomial}>Calculer</Button>
            </div>
            <Separator className="my-4" />
            {resB.err ? (
                <div className="text-red-600 text-sm">{resB.err}</div>
            ) : (
                <ResContainer pmf={resB.pmf} cdf={resB.cdf} tail={resB.tail} />
            )}
        </TabsContent>
    );
};
