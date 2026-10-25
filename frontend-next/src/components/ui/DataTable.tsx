"use client";

import React from "react";
import {
  useTable,
  createCoreRowModel,
  createSortedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createExpandedRowModel,
  columnVisibilityFeature,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
  type ExpandedState,
  type Updater,
} from "@tanstack/react-table";
import { useState, type ReactNode } from "react";
import { ChevronRightIcon, Loader2Icon, ChevronLeftIcon as ChevronLeftIconLib } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface DataTableProps<TData> {
  columns: ColumnDef<any, any, any>[];
  data: TData[];
  isLoading?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  expanded?: ExpandedState;
  onExpandedChange?: (expanded: ExpandedState) => void;
  getRowCanExpand?: (row: any) => boolean;
  renderRowExpanded?: (row: any) => ReactNode;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  sortable = true,
  filterable = false,
  pagination = true,
  pageSize = 10,
  pageCount = -1,
  onPaginationChange,
  expanded,
  onExpandedChange,
  getRowCanExpand,
  renderRowExpanded,
  className,
  emptyMessage = "No data available",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [expandedState, setExpandedState] = useState<ExpandedState>(expanded || {});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = useTable({
    data: data as any,
    columns: columns as any,
    state: {
      sorting,
      columnFilters,
      pagination: paginationState,
      expanded: expandedState,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const newState = typeof updater === "function" ? updater(paginationState) : updater;
      setPaginationState(newState);
      onPaginationChange?.(newState);
    },
    onExpandedChange: (updater: Updater<ExpandedState>) => {
      const newState = typeof updater === "function" ? updater(expandedState) : updater;
      setExpandedState(newState);
      onExpandedChange?.(newState);
    },
    getCoreRowModel: createCoreRowModel(),
    getSortedRowModel: sortable ? createSortedRowModel() : undefined,
    getFilteredRowModel: filterable ? createFilteredRowModel() : undefined,
    getPaginationRowModel: pagination ? createPaginatedRowModel() : undefined,
    getExpandedRowModel: renderRowExpanded ? createExpandedRowModel() : undefined,
    getRowCanExpand,
    manualPagination: pageCount > 0,
    pageCount,
    debugTable: false,
    features: [columnVisibilityFeature],
  } as any);

  if (isLoading) {
    return (
      <div className={cn("relative overflow-x-auto rounded-lg border border-border", className)}>
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            {table
              .getHeaderGroups()
              .map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b transition-colors hover:bg-surface/50 data-[state=selected]:bg-surface">
                  {headerGroup.headers.map((header: any) => (
                    <th
                      key={header.id}
                      className={cn(
                        "h-12 px-4 text-left align-middle font-medium text-foreground-secondary",
                        header.getCanSort?.() && "cursor-pointer select-none"
                      )}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            <tr>
              <td colSpan={columns.length} className="h-32 text-center text-foreground-muted">
                <Loader2Icon className="mx-auto h-8 w-8 animate-spin" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-x-auto rounded-lg border border-border", className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          {table
            .getHeaderGroups()
            .map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b transition-colors hover:bg-surface/50 data-[state=selected]:bg-surface">
                {headerGroup.headers.map((header: any) => (
                  <th
                    key={header.id}
                    className={cn(
                      "h-12 px-4 text-left align-middle font-medium text-foreground-secondary",
                      header.getCanSort?.() && "cursor-pointer select-none"
                    )}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="h-32 text-center text-foreground-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row: any) => (
              <React.Fragment key={row.id}>
                <tr
                  className={cn(
                    "border-b transition-colors hover:bg-surface/50 data-[state=selected]:bg-surface",
                    getRowCanExpand?.(row) && "cursor-pointer"
                  )}
                  onClick={() => {
                    if (getRowCanExpand?.(row)) {
                      row.toggleExpanded();
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "p-4 align-middle",
                        cell.column.getCanSort?.() && "cursor-pointer"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {renderRowExpanded && row.getIsExpanded() && (
                  <tr>
                    <td colSpan={columns.length} className="p-0">
                      <div className="border-t border-border bg-surface/50">
                        {renderRowExpanded(row)}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
        {pagination && (
          <tfoot>
            <tr>
              <td colSpan={columns.length} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground-muted">
                      Page {paginationState.pageIndex + 1} of {typeof table.getPageCount === "function" ? table.getPageCount() : pageCount}
                    </span>
                    <select
                      value={paginationState.pageSize}
                      onChange={(e) => onPaginationChange?.({ pageIndex: 0, pageSize: Number(e.target.value) })}
                      className="h-8 px-2 text-sm border border-border rounded-md bg-surface"
                    >
                      {[10, 20, 30, 40, 50].map((size) => (
                        <option key={size} value={size}>
                          {size} per page
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPaginationChange?.({ pageIndex: paginationState.pageIndex - 1, pageSize: paginationState.pageSize })}
                      disabled={paginationState.pageIndex === 0}
                    >
                      <ChevronLeftIconLib className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPaginationChange?.({ pageIndex: paginationState.pageIndex + 1, pageSize: paginationState.pageSize })}
                      disabled={typeof table.getPageCount === "function" ? !table.getCanNextPage() : paginationState.pageIndex >= pageCount - 1}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}