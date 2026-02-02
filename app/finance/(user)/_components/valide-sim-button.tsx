import { Button } from "@/src/components/ui/button";
import { CheckCircle } from "lucide-react";

export const ValidateSimButton = ({
    id,
    validateFunction,
    onValidated,
}: {
    id: string;
    validateFunction: (id: string) => Promise<void>;
    onValidated: (id: string) => void;
}) => {
    const handleValidate = async () => {
        await validateFunction(id);
        onValidated(id);
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
