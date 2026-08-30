// New architecture exports
export * from "./primitives";
export * from "./field";
export * from "./hooks";

// Legacy exports (for existing consumers - to be migrated)
export { FormField as LegacyFormField } from "./form-field";
export { FormInput as LegacyFormInput } from "./form-input";
export { FormSelect } from "./form-select";
export type { FormSelectProps, SelectOption } from "./form-select";
export { FormDatePicker } from "./form-date-picker";
export type { FormDatePickerProps } from "./form-date-picker";
export { FileUpload } from "./file-upload";