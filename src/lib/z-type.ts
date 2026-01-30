import z from "zod";
import { clientSchema, signInSchema, signUpSchema } from "./z-schema";

// export type Response = {
//     error: boolean;
//     data?;
//     message: string;
// };

export type SignInType = z.infer<typeof signInSchema>;
export type SignUpType = z.infer<typeof signUpSchema>;
export type ClientType = z.infer<typeof clientSchema>;
