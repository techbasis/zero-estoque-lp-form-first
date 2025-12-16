'use client'

export default function LeadFilterBanner() {
  return (
    <div className="fixed top-[57px] right-0 left-0 z-40 w-full overflow-x-hidden sm:top-[73px]">
      {/* full-width background; mobile 57px, desktop 73px */}
      <div className="w-full border-t border-b border-white/5 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 py-1.5">
            {/* centered */}
            <div className="mx-auto flex max-w-[980px] flex-wrap items-center justify-center gap-3 text-center">
              <div className="text-[9px] font-semibold break-words text-white sm:text-[12px]">
                EXCLUSIVO PARA LOJISTAS QUE QUEREM VENDER MAIS CARROS TODOS OS MESES.
              </div>
              <div className="hidden h-3 w-px bg-white/20 sm:block" />
              <div className="hidden text-[12px] text-white sm:block">
                Não é agência genérica. É Aceleradora Comercial focada em veículos.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
