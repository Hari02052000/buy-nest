import { type UseFormRegister, type FieldValues, type Path } from "react-hook-form";

export interface UseRegisterInputOptions<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>;
  requiredMessage?: string;
  valueAsNumber?: boolean;
}

export function useRegisterInput<T extends FieldValues>({
  register,
  name,
  requiredMessage,
  valueAsNumber,
}: UseRegisterInputOptions<T>) {
  return register(name, {
    ...(requiredMessage ? { required: requiredMessage } : {}),
    ...(valueAsNumber ? { valueAsNumber: true } : {}),
  });
}