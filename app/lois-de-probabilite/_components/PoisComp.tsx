"use client";

import { NumberInput } from "@/src/components/NumberInput";
import { ResContainer } from "@/src/components/ResContainer";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { TabsContent } from "@/src/components/ui/tabs";
import { poissonCDF, poissonPMF } from "@/src/lib/prob";
import { useState } from "react";

export const PoisComp = () => {
    const [lP, setLP] = useState("2.5");
    const [kP, setKP] = useState("4");
    const [resP, setResP] = useState<{
        pmf?: number;
        cdf?: number;
        tail?: number;
        err?: string;
    }>({});

    const handlePoisson = () => {
        try {
            const lam = parseFloat(lP);
            const k = parseInt(kP, 10);
            const pmf = poissonPMF(lam, k);
            const cdf = poissonCDF(lam, k);
            setResP({ pmf, cdf, tail: 1 - cdf, err: undefined });
        } catch (e: unknown) {
            if (e instanceof Error) {
                setResP({ err: e.message });
            } else {
                setResP({ err: "Une erreur inconnue est survenue." });
                console.log({ e });
            }
        }
    };
    return (
        <TabsContent value="poisson" className="mt-4">
            <p className="text-sm text-muted-foreground mb-3">
                Conseil : λ entre 0 et ~1e6 selon le besoin. k entier ≥ 0.
            </p>
            <div className="grid grid-cols-2 gap-4">
                <NumberInput
                    id="lP"
                    label="λ (taux moyen)"
                    value={lP}
                    onChange={setLP}
                    step="0.001"
                    min={0}
                />
                <NumberInput
                    id="kP"
                    label="k (valeur)"
                    value={kP}
                    onChange={setKP}
                    min={0}
                />
            </div>
            <div className="mt-4 flex gap-2">
                <Button onClick={handlePoisson}>Calculer</Button>
            </div>
            <Separator className="my-4" />
            {resP.err ? (
                <div className="text-red-600 text-sm">{resP.err}</div>
            ) : (
                <ResContainer pmf={resP.pmf} cdf={resP.cdf} tail={resP.tail} />
            )}
        </TabsContent>
    );
};
