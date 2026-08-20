import PageWrapper from "@/components/common/layout/PageWrapper";

export default function CommandsLoading() {
  return (
    <PageWrapper>
      <div className="flex flex-col">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 border-b border-border-base animate-pulse"
          >
            <div className="w-4 h-4 bg-bg-hover rounded" />
            <div className="h-4 w-1/4 bg-bg-hover rounded" />
            <div className="flex-1" />
            <div className="h-4 w-32 bg-bg-hover rounded" />
            <div className="h-4 w-16 bg-bg-hover rounded-full" />
            <div className="h-3 w-12 bg-bg-hover rounded" />
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
