import { SimulationAutoMultiple } from "../_components/SimulationAutoMultiple";

export default function Page() {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b bg-card px-6 py-4">
                <h1 className="text-2xl font-bold">Simulation en groupe</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Sumilez plusieurs prêts hypotécaires en même temps
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <SimulationAutoMultiple />
            </div>
        </div>
    );
}
