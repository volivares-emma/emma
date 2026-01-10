export default function SkeletonSlide() { 
  return (
    <section className="min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-blue-900 via-slate-900 to-cyan-700">
      <div className="relative z-10 flex gap-8">
        {/* Solo 1 skeleton en sm */}
        <div className="block md:hidden">
          <div
            className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-56 flex flex-col items-center shadow-lg transition-all duration-700 ease-out animate-fade-in`}
            style={{ animationDelay: `200ms` }}
          >
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 animate-pulse mb-4" />
            <div className="h-4 w-24 bg-slate-300/30 rounded mb-2 animate-pulse" />
            <div className="h-3 w-16 bg-slate-300/20 rounded mb-2 animate-pulse" />
            <div className="h-3 w-20 bg-slate-300/20 rounded animate-pulse" />
          </div>
        </div>
        {/* 3 skeletons en md+ */}
        <div className="hidden md:flex gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-56 flex flex-col items-center shadow-lg transition-all duration-700 ease-out animate-fade-in`}
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 animate-pulse mb-4" />
              <div className="h-4 w-24 bg-slate-300/30 rounded mb-2 animate-pulse" />
              <div className="h-3 w-16 bg-slate-300/20 rounded mb-2 animate-pulse" />
              <div className="h-3 w-20 bg-slate-300/20 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}