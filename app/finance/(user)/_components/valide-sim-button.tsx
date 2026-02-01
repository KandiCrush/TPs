"use client";

import { Button } from "@/src/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export const ValidateSimButton = ({
    id,
    validateFunction,
}: {
    id: string;
    validateFunction: (id: string) => Promise<void>;
}) => {
    const router = useRouter();
    const handleValidate = async () => {
        await validateFunction(id);
        router.refresh();
    };
    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-green-500 hover:text-green-500"
            title="Valider"
            onClick={handleValidate}
        >
            <CheckCircle className="h-4 w-4" />
        </Button>
    );
};
