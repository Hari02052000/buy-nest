import { CategoryFormPage } from "../../_components/category-form-page";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryFormPage id={id} />;
}
