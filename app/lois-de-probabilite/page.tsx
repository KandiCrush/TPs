import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { BinComp } from "./_components/BinComp";
import { HyperComp } from "./_components/HyperComp";
import { PoisComp } from "./_components/PoisComp";

export default function Page() {
    return (
        <div className="container max-w-3xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Simulations de lois — Binomiale, Poisson,
                        Hypergéométrique
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="binomiale">
                        <TabsList className="grid grid-cols-3">
                            <TabsTrigger value="binomiale">
                                Binomiale
                            </TabsTrigger>
                            <TabsTrigger value="poisson">Poisson</TabsTrigger>
                            <TabsTrigger value="hyper">
                                Hypergéométrique
                            </TabsTrigger>
                        </TabsList>

                        {/* BINOMIALE */}
                        <BinComp />

                        {/* POISSON */}
                        <PoisComp />

                        {/* HYPERGÉOMÉTRIQUE */}
                        <HyperComp />
                    </Tabs>
                </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground mt-4">
                Cours : Théorie des probabilité. <br />
                Application des lois binomiale, de poisson et hypergéométrique
                dans le cas de probabilité exact (X = k) et probabilité continue
                (X ≤ k).
            </p>
        </div>
    );
}
