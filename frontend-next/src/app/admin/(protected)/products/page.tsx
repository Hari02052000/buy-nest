import { ProductManagement } from "@/features/admin/products/components/ProductManagement";
import { ToastProviderComponent as ToastProvider, Toaster } from "@/components/ui/useToast";

export default function ProductsPage() {
  return (
    <ToastProvider>
      <ProductManagement />
      <Toaster />
    </ToastProvider>
  );
}