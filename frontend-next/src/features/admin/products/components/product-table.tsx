"use client";

import * as React from "react";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { PriceDisplay } from "@/components/shared/product-image";
import { cn } from "@/lib/utils";

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  isListed: boolean;
  images?: { url: string; id: string }[];
  category?: { name: string };
}

interface ProductTableProps {
  products: AdminProduct[];
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  className?: string;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  className,
}: ProductTableProps) {
  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No products found
              </TableCell>
            </TableRow>
          )}
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={product.images?.[0]?.url || IMAGE_PLACEHOLDER}
                    alt={product.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium line-clamp-1 max-w-[200px]">
                {product.name}
              </TableCell>
              <TableCell>{product.category?.name || "—"}</TableCell>
              <TableCell>
                <PriceDisplay price={product.price} />
              </TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Badge variant={product.isListed ? "default" : "secondary"}>
                  {product.isListed ? "Listed" : "Unlisted"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(product.id)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(product.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}