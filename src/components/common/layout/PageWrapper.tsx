import { cn } from "@/lib/utils/cn";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn("px-6 py-8 max-w-[900px] mx-auto w-full", className)}>
      {children}
    </div>
  );
}
