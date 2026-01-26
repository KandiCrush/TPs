"use client";

import { NumberInput } from "@/src/components/NumberInput";
import { ResContainer } from "@/src/components/ResContainer";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { TabsContent } from "@/src/components/ui/tabs";
import { hypergeoCDF, hypergeoPMF } from "@/src/lib/prob";
import { useState } from "react";

export const HyperComp = () => {
    const [N, setN] = useState("100");
    const [K, setK] = useState("30");
    const [n, setn] = useState("10");
    const [kh, setKh] = useState("3");
    const [resH, setResH] = useState<{
        pmf?: number;
        cdf?: number;
        tail?: number;
        err?: string;
    }>({});

    const handleHypergeo = () => {
        try {
            const Nint = parseInt(N, 10);
            const Kint = parseInt(K, 10);
            const nint = parseInt(n, 10);
            const kint = parseInt(kh, 10);
            const pmf = hypergeoPMF(Nint, Kint, nint, kint);
            const cdf = hypergeoCDF(Nint, Kint, nint, kint);
            setResH({ pmf, cdf, tail: 1 - cdf, err: undefined });
        } catch (e: unknown) {
            if (e instanceof Error) {
                setResH({ err: e.message });
            } else {
                setResH({ err: "Une erreur inconnue est survenue." });
                console.log({ e });
            }
        }
    };

    return (
        <TabsContent value="hyper" className="mt-4">
            <p className="text-sm text-muted-foreground mb-3">
                Conseil : N ≤ 100 000, paramètres entiers valides.
            </p>
            <div className="grid grid-cols-2 gap-4">
                <NumberInput
                    id="N"
                    label="N (population)"
                    value={N}
                    onChange={setN}
                    min={1}
                />
                <NumberInput
                    id="K"
                    label="K (succès dans la population)"
                    value={K}
                    onChange={setK}
                    min={0}
                />
                <NumberInput
                    id="n"
                    label="n (tirages)"
                    value={n}
                    onChange={setn}
                    min={0}
                />
                <NumberInput
                    id="kh"
                    label="k (valeur)"
                    value={kh}
                    onChange={setKh}
                    min={0}
                />
            </div>
            <div className="mt-4 flex gap-2">
                <Button onClick={handleHypergeo}>Calculer</Button>
            </div>
            <Separator className="my-4" />
            {resH.err ? (
                <div className="text-red-600 text-sm">{resH.err}</div>
            ) : (
                <ResContainer pmf={resH.pmf} cdf={resH.cdf} tail={resH.tail} />
            )}
        </TabsContent>
    );
};
