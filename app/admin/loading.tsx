export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Banner Skeleton */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-emerald-100 rounded-full animate-pulse" />
          <div className="h-7 w-64 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-3.5 w-80 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* KPI 4 Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-8 w-8 bg-slate-100 rounded-xl animate-pulse" />
            </div>
            <div className="h-7 w-32 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-3 w-28 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Analytics Chart Skeleton */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="h-4 w-40 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-3 w-60 bg-slate-100 rounded-lg animate-pulse" />
          </div>
          <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
        </div>
        <div className="h-56 bg-slate-50 rounded-2xl animate-pulse flex items-end gap-4 p-4">
          {[40, 75, 55, 90, 65, 80, 45].map((h, idx) => (
            <div
              key={idx}
              style={{ height: `${h}%` }}
              className="flex-1 bg-slate-200 rounded-t-xl animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Table Section Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="h-5 w-44 bg-slate-200 rounded-lg animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-14 w-full bg-slate-50 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}