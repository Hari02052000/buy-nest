# Product Management Frontend Plan

## Goal
Build admin product management (list + create + edit + image gallery + toggle list + delete) in `frontend-next`, mirroring the existing category feature structure and reusing its UI primitives.

## Backend API surface (already implemented, `/api/product`)
| Method | Path | Body | Notes |
|--------|------|------|-------|
| POST | `/` | multipart `files[]` + fields | requires >=1 image; unique on (name, brandName, modelName) |
| GET | `/` | query: limit, skip, category, search, brand, model, minPrice, maxPrice | admin sees all; public sees only isListed + listed category |
| GET | `/:id` | - | single, populated category |
| PUT | `/:id` | JSON | partial edit; re-checks uniqueness when name/brand/model change |
| PUT | `/upload-image/:id` | multipart `files[]` | appends images |
| DELETE | `/delete-image/:id` | body `{ image: {url, id} }` | removes one image |
| PATCH | `/toggle-list/:id` | body `{ isListed }` | |

Product fields: name, images[] ({url,id}), description, price (number), category (id/name/ancestors/isListed), brandName, modelName, isListed, stock.

## Reusable components to create/extend
1. **New `ImageGallery` component** (`src/components/ui/ImageGallery.tsx`) — multi-image upload + per-image remove. Replaces single `ImageUpload` for products. Supports: add images (file picker + drag-drop), remove individual image (calls `onRemoveImage`), empty state, max-size + type validation, disabled state. Reuses `UploadIcon/CameraIcon` from lucide-react and `cn`.
2. **New `NumberInput`** — optional; if `Input` does not support `type="number"` cleanly, check `src/components/ui/Input.tsx` first. If fine, reuse `Input` with `type="number"`.

## Feature folder: `src/features/admin/products/`
```
products/
  schemas/product.schema.ts     # zod schemas (create/edit)
  api/
    product.types.ts             # Product, ProductCategory, CreateProductInput, UpdateProductInput
    product.service.ts           # thin HTTP wrappers (apiClient)
    product.queries.ts           # React Query hooks (list, single, create, edit, uploadImage, deleteImage, toggleList)
  components/
    ProductColumns.tsx           # table column factory (createProductColumns)
    ProductFormDialog.tsx        # create/edit dialog (image gallery + fields)
    ProductManagement.tsx        # page container
```
Route: `src/app/admin/(protected)/products/page.tsx` -> `<ProductManagement/>` wrapped in ToastProvider (like categories page).

## ProductColumns.tsx
Factory `createProductColumns({ onEdit, onToggleStatus, onDelete, onImageManage?, isLoading })` returning ColumnDef[]:
- Image: show first image (or placeholder icon)
- Name
- Brand
- Model
- Price
- Category (name, indented by ancestors if available)
- Stock
- Status: Switch (isListed) -> onToggleStatus
- Actions: Edit, (optional image manage), Delete (error styling)

## ProductFormDialog.tsx
Dialog with mode create/edit. Uses react-hook-form + zodResolver + ShakeProvider (like CategoryFormDialog).
Fields: name, description (textarea - use a simple textarea since no FormTextarea exists; add `rows=4`), price (number), brandName, modelName, stock (number), category (ApiSelect from useParentCategories), images (ImageGallery).
- Create schema requires >=1 image.
- Edit schema: images optional; image changes call `uploadImage` (append) or `deleteImage` (per-image remove); other fields call `editProduct` on submit.
- Immediate toasts on image actions; toast on submit success/error.
- Disable controls while mutations pending.

## ProductManagement.tsx
Container mirroring CategoryManagement: search, list query, pagination, edit/create state, delete confirm dialog, toggle status, toast. Uses `useProducts`, `useCreateProduct`, `useEditProduct`, `useUploadProductImage`, `useDeleteProductImage`, `useToggleProductListStatus`.

## Queries/service conventions
- Follow category pattern exactly: `productQueryKeys`, `useProducts(params)`, `useProduct(id)`, `useCreateProduct()`, `useEditProduct()`, `useUploadProductImage()`, `useDeleteProductImage()`, `useToggleProductListStatus()`.
- Service uses `apiClient` (multipart for image endpoints with `headers: {}`).

## Validation
- `npm run lint` (eslint)
- `npx tsc --noEmit`
- `npm run build` (next build)
- Manual: navigate /admin/products, create, edit, toggle, delete, image gallery add/remove.

## Open questions / out of scope
- Delete product: backend has no delete-product endpoint. `onDelete` in columns currently shows a "to be implemented" toast (matching category behavior). Keep consistent.
- Search/filter UI beyond search box: out of scope (backend supports brand/model/price filters but no UI yet).
- Product detail page (customer-facing): out of scope.