import { cn } from "@/libs/utils";

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function PageLayout({
  children, className
}: PageLayoutProps) {
  return (
    <section className={cn('max-w-4xl xl:max-w-5xl px-4 sm:px-6 xl:px-0 mx-auto mb-10 ', className)}>
      <div className="flex flex-col flex-1 min-h-dvh">
        {children}
      </div>
    </section>
  );
}
