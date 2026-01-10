// Skeleton de loading para Careers adaptado al diseño de las tarjetas
export default function SkeletonCareers() {
  return (
    <section className="py-12 bg-linear-to-br from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full text-sm font-medium mb-3 animate-pulse">
            <div className="w-4 h-4 mr-2 bg-amber-400 rounded-full" />
            <span className="w-24 h-4 bg-amber-400/30 rounded animate-pulse" />
          </div>
          <div className="h-8 w-64 mx-auto bg-white/10 rounded mb-3 animate-pulse" />
          <div className="h-5 w-80 mx-auto bg-white/10 rounded animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300 animate-fade-in p-6 flex flex-col gap-4">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-[#035AA6] to-[#07598C] rounded-lg animate-pulse mr-3" />
                <div>
                  <div className="h-4 w-32 bg-amber-500/30 rounded mb-2 animate-pulse" />
                  <div className="h-3 w-24 bg-[#11B4D9]/20 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-full bg-white/10 rounded mb-3 animate-pulse" />
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="h-4 w-16 bg-[#035AA6]/20 rounded-full animate-pulse" />
                <span className="h-4 w-20 bg-[#038C7F]/20 rounded-full animate-pulse" />
                <span className="h-4 w-20 bg-[#07598C]/20 rounded-full animate-pulse" />
              </div>
              <div className="h-4 w-24 bg-amber-400/20 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="bg-linear-to-r from-amber-500 to-orange-500 rounded-xl p-6 max-w-3xl mx-auto animate-pulse">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full mr-4 animate-pulse" />
              <div className="text-left">
                <div className="h-5 w-32 bg-white/20 rounded mb-2 animate-pulse" />
                <div className="h-4 w-40 bg-amber-100/30 rounded animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 justify-items-center text-amber-100 text-xs">
              {[1,2,3,4].map((i) => (
                <div key={i} className="h-4 w-full max-w-24 bg-white/10 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
