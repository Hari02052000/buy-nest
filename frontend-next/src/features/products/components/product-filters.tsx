"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface ProductFiltersProps {
  categories: { id: string; name: string }[];
  brands: string[];
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  selectedCategory?: string;
  selectedBrand?: string;
  inStockOnly?: boolean;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onCategoryChange: (value?: string) => void;
  onBrandChange: (value?: string) => void;
  onInStockToggle: (checked: boolean) => void;
  onReset: () => void;
  className?: string;
}

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Top Rated" },
];

export function ProductFilters({
  categories,
  brands,
  minPrice,
  maxPrice,
  sortBy,
  selectedCategory,
  selectedBrand,
  inStockOnly = false,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onCategoryChange,
  onBrandChange,
  onInStockToggle,
  onReset,
  className,
}: ProductFiltersProps) {
  return (
    <div className={className}>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>

        <div>
          <Label className="text-sm">Sort By</Label>
          <Select value={sortBy} onValueChange={(v) => onSortChange(v ?? "")}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div>
          <Label className="text-sm">Category</Label>
          <Select
            value={selectedCategory ?? "all"}
            onValueChange={(v) => onCategoryChange(v === "all" ? undefined : v ?? undefined)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Brand</Label>
          <Select
            value={selectedBrand ?? "all"}
            onValueChange={(v) => onBrandChange(v === "all" ? undefined : v ?? undefined)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="All brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div>
          <Label className="text-sm">Price Range</Label>
          <div className="flex items-center gap-2 mt-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-2">
          <Checkbox
            id="inStock"
            checked={inStockOnly}
            onCheckedChange={(checked) => onInStockToggle(checked === true)}
          />
          <Label htmlFor="inStock" className="text-sm cursor-pointer">
            In stock only
          </Label>
        </div>
      </div>
    </div>
  );
}