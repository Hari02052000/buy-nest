"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";

import { FormField } from "@/components/forms/form-field";
import { FileUpload } from "@/components/forms/file-upload";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/state";
import { PriceDisplay } from "@/components/shared/product-image";
import { SearchBar } from "@/components/shared/search-bar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

import { ProductCard } from "@/features/products/components/product-card";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductImages } from "@/features/products/components/product-images";
import { ProductFilters } from "@/features/products/components/product-filters";
import { CartItem } from "@/features/cart/components/cart-item";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { CartBadge } from "@/features/cart/components/cart-badge";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
import { OrderCard } from "@/features/orders/components/order-card";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { AddressList } from "@/features/checkout/components/address-list";
import { AddressForm } from "@/features/checkout/components/address-form";
import { PaymentMethod } from "@/features/checkout/components/payment-method";
import { OrderSummary } from "@/features/checkout/components/order-summary";
import { OrderSuccessModal } from "@/features/checkout/components/order-success-modal";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { AvatarUpload } from "@/features/profile/components/avatar-upload";
import { ProductTable } from "@/features/admin/products/components/product-table";
import { ProductForm } from "@/features/admin/products/components/product-form";
import { CategoryTable } from "@/features/admin/categories/components/category-table";
import { CategoryForm } from "@/features/admin/categories/components/category-form";
import { AdminOrderTable } from "@/features/admin/orders/components/admin-order-table";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold border-b pb-2">{title}</h2>
      <div className="p-4 border rounded-lg bg-muted/20">{children}</div>
    </section>
  );
}

const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones with Noise Cancellation",
    price: 99.99,
    images: [{ url: "", id: "1" }],
    stock: 10,
    brandName: "AudioTech",
    isListed: true,
  },
  {
    id: "2",
    name: "Mechanical Keyboard RGB",
    price: 149.0,
    images: [{ url: "", id: "2" }],
    stock: 0,
    brandName: "KeyCraft",
    isListed: true,
  },
  {
    id: "3",
    name: "Gaming Mouse Ergonomic",
    price: 49.5,
    images: [{ url: "", id: "3" }],
    stock: 25,
    brandName: "GamePro",
    isListed: false,
  },
];

export default function ShowcasePage() {
  const [search, setSearch] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [wishlisted, setWishlisted] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [payment, setPayment] = React.useState<"cod" | "online">("cod");

  return (
    <div className="container mx-auto py-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Component Showcase</h1>
        <p className="text-muted-foreground mt-1">
          Visual registry of all reusable BuyNest components.
        </p>
      </div>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><span>+</span></Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Inputs & Form">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField label="Name" htmlFor="demo-name" required error="">
            <Input id="demo-name" placeholder="Enter name" />
          </FormField>
          <FormField label="Email" htmlFor="demo-email" error="Invalid email">
            <Input id="demo-email" placeholder="Enter email" />
          </FormField>
          <FormField label="Message" htmlFor="demo-msg">
            <Textarea id="demo-msg" placeholder="Enter message" />
          </FormField>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox id="c1" />
              <Label htmlFor="c1">Accept terms</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="s1" />
              <Label htmlFor="s1">Enable notifications</Label>
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Option A</SelectItem>
                <SelectItem value="b">Option B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <FileUpload value={files} onChange={setFiles} />
        </div>
      </Section>

      <Section title="Badges & Price">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <PriceDisplay price={99.99} className="text-lg" />
          <CartBadge count={3} />
          <CartBadge count={150} />
        </div>
      </Section>

      <Section title="Order Status Badges">
        <div className="flex gap-2 flex-wrap">
          <OrderStatusBadge status="pending" />
          <OrderStatusBadge status="confirmed" />
          <OrderStatusBadge status="processing" />
          <OrderStatusBadge status="shipped" />
          <OrderStatusBadge status="delivered" />
          <OrderStatusBadge status="cancelled" />
        </div>
      </Section>

      <Section title="Product Card">
        <div className="max-w-xs">
          <ProductCard
            product={mockProducts[0]}
            onAddToCart={() => {}}
            onAddToWishlist={() => setWishlisted(!wishlisted)}
            isInWishlist={wishlisted}
          />
        </div>
      </Section>

      <Section title="Product Grid">
        <ProductGrid products={mockProducts} onAddToCart={() => {}} onAddToWishlist={() => {}} />
      </Section>

      <Section title="Product Images">
        <div className="max-w-sm">
          <ProductImages
            images={[
              { url: "", id: "1" },
              { url: "", id: "2" },
              { url: "", id: "3" },
            ]}
            name="Demo Product"
          />
        </div>
      </Section>

      <Section title="Product Filters">
        <ProductFilters
          categories={[{ id: "1", name: "Electronics" }]}
          brands={["AudioTech", "KeyCraft"]}
          minPrice=""
          maxPrice=""
          sortBy="popularity"
          onMinPriceChange={() => {}}
          onMaxPriceChange={() => {}}
          onSortChange={() => {}}
          onCategoryChange={() => {}}
          onBrandChange={() => {}}
          onInStockToggle={() => {}}
          onReset={() => {}}
        />
      </Section>

      <Section title="Cart Item & Summary">
        <div className="grid md:grid-cols-2 gap-6">
          <CartItem
            item={{
              product: { id: "1", name: "Wireless Headphones", price: 99.99, images: [{ url: "", id: "1" }] },
              quantity: 2,
              price: 99.99,
              totalPrice: 199.98,
            }}
            onUpdateQuantity={() => {}}
            onRemove={() => {}}
          />
          <CartSummary totalAmount={199.98} itemCount={2} onCheckout={() => {}} />
        </div>
      </Section>

      <Section title="Wishlist Button">
        <WishlistButton productId="1" isInWishlist={wishlisted} onToggle={() => setWishlisted(!wishlisted)} variant="full" />
        <div className="mt-2">
          <WishlistButton productId="1" isInWishlist={wishlisted} onToggle={() => setWishlisted(!wishlisted)} />
        </div>
      </Section>

      <Section title="Order Card">
        <div className="max-w-md">
          <OrderCard
            order={{
              id: "order12345678",
              items: [{ productId: "1", quantity: 2, price: 99.99, totalPrice: 199.98, product: { name: "Headphones", images: [{ url: "", id: "1" }] } }],
              orderStatus: "pending",
              totalAmount: 199.98,
              createdAt: new Date().toISOString(),
            }}
            onViewDetails={() => {}}
          />
        </div>
      </Section>

      <Section title="Checkout: Address, Payment, Summary">
        <div className="grid md:grid-cols-3 gap-6">
          <AddressList
            addresses={[
              { id: "a1", fullName: "John Doe", addressLine1: "123 Main St", city: "NYC", state: "NY", zipCode: "10001", phone: "+1234567890" },
            ]}
            selectedId="a1"
            onSelect={() => {}}
          />
          <div className="space-y-4">
            <PaymentMethod value={payment} onChange={setPayment} />
            <AddressForm onSubmit={() => {}} />
          </div>
          <OrderSummary
            items={[{ product: { name: "Headphones" }, quantity: 2, price: 99.99 }]}
            totalAmount={199.98}
          />
        </div>
      </Section>

      <Section title="Profile & Avatar">
        <div className="space-y-4 max-w-md">
          <AvatarUpload />
          <ProfileForm onSubmit={() => {}} />
        </div>
      </Section>

      <Section title="Admin: Tables">
        <div className="space-y-6">
          <ProductTable
            products={[
              { id: "1", name: "Headphones", price: 99.99, stock: 10, isListed: true, images: [{ url: "", id: "1" }], category: { name: "Electronics" } },
            ]}
            onEdit={() => {}}
            onDelete={() => {}}
          />
          <CategoryTable
            categories={[{ id: "1", name: "Electronics", isActive: true, offer: 10 }]}
            onEdit={() => {}}
            onDelete={() => {}}
          />
          <AdminOrderTable
            orders={[
              { id: "order12345678", orderStatus: "processing", totalAmount: 199.98, createdAt: new Date().toISOString(), user: { name: "John", email: "j@x.com" }, itemCount: 2 },
            ]}
            onView={() => {}}
            onStatusChange={() => {}}
          />
        </div>
      </Section>

      <Section title="Admin: Forms">
        <div className="grid md:grid-cols-2 gap-6">
          <ProductForm categories={[{ id: "1", name: "Electronics" }]} onSubmit={() => {}} />
          <CategoryForm onSubmit={() => {}} />
        </div>
      </Section>

      <Section title="Dialogs & Overlays">
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>This is a dialog description.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Open Confirm
          </Button>
          <ConfirmDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Delete product?"
            description="This action cannot be undone."
            onConfirm={() => setDialogOpen(false)}
            variant="destructive"
          />

          <Sheet>
            <SheetTrigger render={<Button variant="outline">Open Sheet</Button>} />
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sheet Title</SheetTitle>
              </SheetHeader>
              <p className="text-sm text-muted-foreground mt-4">Sheet content here.</p>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline">Open Menu</Button>} />
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <OrderSuccessModal open={false} orderId="order12345678" />
        </div>
      </Section>

      <Section title="Tabs & Tooltip">
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Tab 1 content</TabsContent>
          <TabsContent value="tab2">Tab 2 content</TabsContent>
        </Tabs>
        <div className="mt-4">
          <TooltipProvider>
            <Tooltip>
            <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
              <TooltipContent>Tooltip content</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Section>

      <Section title="Table (Raw)">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Item A</TableCell>
              <TableCell><PriceDisplay price={10} /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>

      <Section title="Pagination">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Section>

      <Section title="Skeleton & States">
        <div className="space-y-6">
          <div className="flex gap-4">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <EmptyState title="No items yet" description="Add your first item to get started" />
          <ErrorState title="Failed to load" description="Please try again" />
          <LoadingState />
        </div>
      </Section>

      <Section title="Search Bar">
        <div className="max-w-md">
          <SearchBar value={search} onChange={setSearch} onSearch={() => {}} />
        </div>
      </Section>

      <Section title="Layout: Store Header & Footer">
        <div className="space-y-4">
          <StoreHeader cartCount={3} isAuthenticated userName="John" />
          <StoreFooter />
        </div>
      </Section>

      <Section title="Layout: Admin Shell">
        <div className="flex border rounded-lg overflow-hidden h-96">
          <AdminSidebar onLogout={() => {}} />
          <div className="flex-1 flex flex-col">
            <AdminTopbar userName="Admin" onLogout={() => {}} />
            <div className="flex-1 p-4 text-sm text-muted-foreground">
              Admin content area
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}