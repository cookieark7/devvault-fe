interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-20 px-4">
      <div className="w-12 h-12 bg-bg-subtle border border-border-base rounded-md flex items-center justify-center mb-4 text-text-secondary">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-text-primary mt-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-xs mt-1">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
