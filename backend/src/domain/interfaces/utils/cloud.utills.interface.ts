export interface cloudUtillsInterface {
  uploadMultiFiles(imageFiles: unknown[]): Promise<{ url: string; id: string }[]>;
  uploadSingleFile(imageFile: unknown): Promise<{ url: string; id: string }>;
  deleteImage(id: string): Promise<boolean>;
}
