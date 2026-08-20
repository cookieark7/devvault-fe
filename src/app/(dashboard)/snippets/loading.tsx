import PageWrapper from "@/components/common/layout/PageWrapper";

export default function SnippetsLoading() {
  return (
    <PageWrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border border-border-base rounded p-4 animate-pulse"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-bg-hover rounded" />
              <div className="h-4 w-1/2 bg-bg-hover rounded" />
            </div>
            <div className="bg-bg-subtle rounded p-3 space-y-2">
              <div className="h-3 w-full bg-bg-hover rounded" />
              <div className="h-3 w-4/5 bg-bg-hover rounded" />
              <div className="h-3 w-3/5 bg-bg-hover rounded" />
            </div>
            <div className="flex gap-2 mt-3">
              <div className="h-5 w-12 bg-bg-hover rounded-full" />
              <div className="flex-1" />
              <div className="h-3 w-16 bg-bg-hover rounded" />
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
