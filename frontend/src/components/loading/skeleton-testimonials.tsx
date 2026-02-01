// Skeleton de loading para Testimonials adaptado al diseño de las tarjetas y estadísticas
export default function SkeletonTestimonials() {
  return (
    <section className="py-20 bg-linear-to-br from-white via-gray-50 to-[#11B4D9]/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#11B4D9]/10 text-[#035AA6] px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
            <div className="w-4 h-4 mr-2 bg-[#035AA6] rounded-full" />
            <div className="h-4 w-32 bg-[#11B4D9]/20 rounded animate-pulse" />
          </div>
          <div className="h-10 w-80 mx-auto bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="h-6 w-96 mx-auto bg-gray-100 rounded animate-pulse" />
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg transition-all duration-300 border border-[#11B4D9]/10 relative animate-fade-in">
              <div className="p-8">
                <div className="absolute -top-3 -right-3">
                  <div className="bg-linear-to-r from-amber-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse w-24 h-6" />
                </div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-linear-to-br from-[#035AA6] to-[#11B4D9] rounded-full animate-pulse" />
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                      <div className="h-3 w-20 bg-gray-100 rounded mb-1 animate-pulse" />
                      <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1,2,3,4,5].map((j) => (
                      <div key={j} className="w-4 h-4 bg-amber-200 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
                <div className="h-16 w-full bg-gray-100 rounded mb-6 animate-pulse" />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-[#038C7F]/10 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Stats */}
        <div className="mt-20 bg-linear-to-r from-[#035AA6] via-[#11B4D9] to-[#07598C] rounded-3xl p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[1,2,3,4].map((i) => (
              <div key={i} className="group">
                <div className="h-10 w-20 mx-auto bg-white/20 rounded mb-2 animate-pulse" />
                <div className="h-4 w-32 mx-auto bg-[#D1ECF9]/20 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
