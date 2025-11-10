import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Debe ser un correo electrónico válido." }),
  password: z
    .string()
    .trim()
    .min(1, { message: "La contraseña no puede estar vacía." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const onboardingSchema = z.object({
  name: z.string().min(3, { message: "El nombre es requerido." }),
  documentNumber: z
    .string()
    .min(5, { message: "El número de documento es requerido." }),
  email: z
    .string()
    .email({ message: "Debe ser un correo electrónico válido." }),
  initialAmount: z
    .number()
    .min(0, { message: "El monto inicial no puede ser negativo." }),
  productId: z.string().uuid({ message: "Debe seleccionar un producto." }),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
