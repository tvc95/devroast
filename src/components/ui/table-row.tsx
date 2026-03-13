import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const table = tv(
  {
    base: [
      "flex w-full flex-col rounded border border-[var(--border-primary)]",
    ],
    variants: {
      variant: {
        default: [],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
  {
    twMerge: true,
  },
);

const tableRow = tv(
  {
    base: [
      "flex items-center border-b border-[var(--border-primary)] px-5 py-4 last:border-b-0",
    ],
    variants: {
      variant: {
        default: [],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
  {
    twMerge: true,
  },
);

export interface TableProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof table> {}

export const Table = forwardRef<HTMLDivElement, TableProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div ref={ref} className={table({ variant, className })} {...props}>
        {children}
      </div>
    );
  },
);

Table.displayName = "Table";

export interface TableRowProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tableRow> {}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div ref={ref} className={tableRow({ variant, className })} {...props}>
        {children}
      </div>
    );
  },
);

TableRow.displayName = "TableRow";

export interface TableCellProps extends HTMLAttributes<HTMLDivElement> {}

export const TableCell = forwardRef<HTMLDivElement, TableCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  },
);

TableCell.displayName = "TableCell";
