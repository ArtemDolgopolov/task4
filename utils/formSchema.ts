import { z } from "zod"
import { FormDatas } from "./types"

export const validationSchema = z.object({
 name: z
 .string()
 .min(1, "Name must be at least 1 characters long")
 .max(50, "Password cannot exceed 50 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password must be at least 6 characters long")
    .max(50, "Password cannot exceed 50 characters"),
});

// Client-side validation
export function validateData(data: FormDatas): { isValid: boolean, errors: FormDatas } {
 try {
   validationSchema.parse(data);
   return { isValid: true, errors: {} };
 } catch (e) {
   if (e instanceof z.ZodError) {
     const fieldErrors: FormDatas = {};
     e.errors.forEach((err) => {
       if (err.path[0] === "email") fieldErrors.email = err.message;
       if (err.path[0] === "password") fieldErrors.password = err.message;
     });
     return { isValid: false, errors: fieldErrors };
   }
   return { isValid: false, errors: {} };
 }
}