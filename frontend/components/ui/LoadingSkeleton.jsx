"use client";

export function SkeletonCard({ className = "" }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse ${className}`}>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
      <div className="border-b border-slate-200 dark:border-slate-700 p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-slate-100 dark:border-slate-700/50 p-4 flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 h-64 animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-6" />
          <div className="h-40 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 h-64 animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-6" />
          <div className="h-40 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ icon = "📋", title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-body dark:text-slate-200 mb-2">{title}</h3>
      {description && <p className="text-sm text-heading text-center max-w-md mb-4">{description}</p>}
      {action && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-success hover:bg-success-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
        >
          {action}
        </button>
      )}
    </div>
  );
}
