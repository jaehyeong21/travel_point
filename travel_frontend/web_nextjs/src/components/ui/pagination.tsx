import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/libs/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { Link } from "next-view-transitions";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

// type PaginationLinkProps = {
//   href: string,
//   isActive?: boolean
// } & Pick<ButtonProps, "size"> &
//   React.ComponentProps<"a">

interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  size?: "icon" | "default" | "sm" | "lg" | null | undefined; // 예시
  disabled?: boolean;  // 'disabled' 속성 추가
  href: string
}

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  href,
  disabled,
  ...props
}: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? "page" : undefined}
    href={href}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
      disabled && 'pointer-events-none opacity-70' 
    )}
    onClick={(e) => {
      if (disabled) {
        e.preventDefault();
      }
    }}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled: boolean }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pr-2.5", className, { 'pointer-events-none opacity-50': disabled })}
    {...props}
    onClick={(e) => {
      if (disabled) {
        e.preventDefault(); // 클릭 비활성화
      } else {
        props.onClick?.(e);
      }
    }}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled: boolean }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className, { 'pointer-events-none opacity-50': disabled })}
    {...props}
    onClick={(e) => {
      if (disabled) {
        e.preventDefault(); // 클릭 비활성화
      } else {
        props.onClick?.(e);
      }
    }}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
