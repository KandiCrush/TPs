"use client";

import { Button } from "@/src/components/ui/button";
import { Trash2 } from "lucide-react";

export const DeleteSimButton = ({
    id,
    deleteFunction,
}: {
    id: string;
    deleteFunction: (id: string) => Promise<void>;
}) => {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            title="Supprimer"
            onClick={() => deleteFunction(id)}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    );
};
