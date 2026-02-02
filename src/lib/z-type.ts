import z from "zod";
import {
    clientSchema,
    signInSchema,
    signUpSchema,
    simulationDocumentSchema,
    simulationResultSchema,
    simulationSchema,
} from "./z-schema";

// export type Response = {
//     error: boolean;
//     data?;
//     message: string;
// };

export type SignInType = z.infer<typeof signInSchema>;
export type SignUpType = z.infer<typeof signUpSchema>;
export type ClientType = z.infer<typeof clientSchema>;

export type SimulationType = z.infer<typeof simulationSchema>;
export type SimulationResultType = z.infer<typeof simulationResultSchema>;

export type SimulationDocumentType = z.infer<typeof simulationDocumentSchema>;
