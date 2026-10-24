import { CategoryManagement } from "@/features/admin/categories/components/CategoryManagement";
import { ToastProviderComponent as ToastProvider, Toaster } from "@/components/ui/useToast";

export default function CategoriesPage() {
  return (
    <ToastProvider>
      <CategoryManagement />
      <Toaster />
    </ToastProvider>
  );
}