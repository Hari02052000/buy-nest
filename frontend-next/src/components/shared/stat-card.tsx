import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  href?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  href,
  className,
}: StatCardProps) {
  const content = (
    <div
      className={cn(
        "rounded-lg border bg-card p-5 shadow-sm transition-colors",
        href && "hover:border-primary/50",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {trend && (
        <p
          className={cn(
            "mt-1 text-xs",
            trend.value >= 0 ? "text-status-delivered" : "text-status-cancelled",
          )}
        >
          {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
