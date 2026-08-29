"use client";

import * as React from "react";
import type { QueryKey } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/state";
import { BulkActionToolbar } from "./bulk-action-toolbar";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  accessorKey: string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
  className?: string;
}

export interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (ids: string[]) => Promise<void> | void;
  variant?: "destructive" | "default" | "outline";
  confirmMessage?: string;
}

export interface DataTableParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: unknown;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  queryKey: QueryKey;
  queryFn: (params: DataTableParams) => Promise<T[]>;
  initialData?: T[];
  initialParams?: Record<string, unknown>;
  getId: (row: T) => string;
  rowActions?: (row: T) => React.ReactNode;
  bulkActions?: BulkAction[];
  searchPlaceholder?: string;
  exportFilename?: string;
  pageSize?: number;
}

function exportToCsv<T>(
  rows: T[],
  columns: DataTableColumn<T>[],
  filename: string,
) {
  const headers = columns.map((c) => c.header);
  const escape = (val: unknown) => {
    const str = String(val ?? "");
    return `"${str.replace(/"/g, '""')}"`;
  };
  const body = rows.map((row) =>
    columns
      .map((col) => {
        const value = (row as Record<string, unknown>)[col.accessorKey];
        return escape(value);
      })
      .join(","),
  );
  const csv = [headers.map(escape).join(","), ...body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function DataTable<T>({
  columns,
  queryKey,
  queryFn,
  initialData,
  getId,
  rowActions,
  bulkActions,
  searchPlaceholder = "Search...",
  exportFilename,
  pageSize = 20,
  initialParams,
}: DataTableProps<T>) {
  const [params, setParams] = React.useState<DataTableParams>({
    page: 1,
    limit: pageSize,
    search: "",
    sortBy: undefined,
    sortOrder: undefined,
    ...initialParams,
  });
  const [searchInput, setSearchInput] = React.useState("");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({});
  const [exporting, setExporting] = React.useState(false);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setParams((p) => ({ ...p, search: searchInput, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [...queryKey, params] as QueryKey,
    queryFn: () => queryFn(params),
    initialData: params.page === 1 ? initialData : undefined,
  });

  const rows = React.useMemo(() => data ?? [], [data]);
  const visibleColumns = columns.filter(
    (col) => columnVisibility[col.accessorKey] !== false,
  );

  const toggleSort = (key: string) => {
    setParams((p) => {
      if (p.sortBy !== key) return { ...p, sortBy: key, sortOrder: "asc", page: 1 };
      if (p.sortOrder === "asc")
        return { ...p, sortBy: key, sortOrder: "desc", page: 1 };
      return { ...p, sortBy: undefined, sortOrder: undefined, page: 1 };
    });
  };

  const selectedIds = React.useMemo(
    () => rows.filter((r) => selected.has(getId(r))).map(getId),
    [rows, selected, getId],
  );

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map(getId)));
  };

  const handleExport = () => {
    setExporting(true);
    try {
      exportToCsv(rows, visibleColumns, exportFilename ?? "export");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {exportFilename && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting || rows.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background h-8 px-3 text-sm font-medium hover:bg-muted",
              )}
            >
              <Columns3 className="h-4 w-4" />
              Columns
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.accessorKey}
                  checked={columnVisibility[col.accessorKey] !== false}
                  onCheckedChange={(val) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      [col.accessorKey]: val === true,
                    }))
                  }
                >
                  {col.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bulk action toolbar */}
      {bulkActions && bulkActions.length > 0 && (
        <BulkActionToolbar
          selectedCount={selected.size}
          actions={bulkActions}
          selectedIds={selectedIds}
          onClear={() => setSelected(new Set())}
        />
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {bulkActions && bulkActions.length > 0 && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={
                      rows.length > 0 && selected.size === rows.length
                    }
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {visibleColumns.map((col) => (
                <TableHead key={col.accessorKey} className={col.className}>
                  {col.enableSorting ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.accessorKey)}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      {col.header}
                      {params.sortBy === col.accessorKey ? (
                        params.sortOrder === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
              {rowActions && <TableHead className="w-12">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {bulkActions && bulkActions.length > 0 && (
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                  {visibleColumns.map((col) => (
                    <TableCell key={col.accessorKey}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={
                    visibleColumns.length +
                    (bulkActions ? 1 : 0) +
                    (rowActions ? 1 : 0)
                  }
                >
                  <ErrorState
                    title="Failed to load data"
                    description="Please try again"
                    action={
                      <Button size="sm" onClick={() => refetch()}>
                        Retry
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    visibleColumns.length +
                    (bulkActions ? 1 : 0) +
                    (rowActions ? 1 : 0)
                  }
                >
                  <EmptyState title="No records found" />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const id = getId(row);
                return (
                  <TableRow key={id}>
                    {bulkActions && bulkActions.length > 0 && (
                      <TableCell>
                        <Checkbox
                          checked={selected.has(id)}
                          onCheckedChange={() => toggleRow(id)}
                          aria-label={`Select row`}
                        />
                      </TableCell>
                    )}
                    {visibleColumns.map((col) => (
                      <TableCell key={col.accessorKey} className={col.className}>
                        {col.cell
                          ? col.cell(row)
                          : String(
                              (row as Record<string, unknown>)[col.accessorKey] ??
                                "",
                            )}
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {rowActions(row)}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && !isError && rows.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {params.page} of {Math.max(1, Math.ceil(rows.length / pageSize))}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setParams((p) => ({ ...p, page: Math.max(1, p.page - 1) }));
                  }}
                  className={params.page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setParams((p) => ({ ...p, page: p.page + 1 }));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
