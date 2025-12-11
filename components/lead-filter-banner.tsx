"use client"

import React from "react"

export default function LeadFilterBanner() {
  return (
  <div className="w-full fixed top-[57px] sm:top-[73px] left-0 right-0 z-40">{/* full-width background; mobile 57px, desktop 73px */}
      <div className="bg-blue-600 w-full border-t border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 py-1.5">{/* centered */}
            <div className="flex items-center justify-center gap-3 flex-wrap text-center max-w-[980px] mx-auto">
              <div className="text-white font-semibold text-[9px] sm:text-[12px]">EXCLUSIVO PARA LOJISTAS QUE QUEREM VENDER MAIS CARROS TODOS OS MESES.</div>
              <div className="hidden sm:block h-3 w-px bg-white/20" />
              <div className="hidden sm:block text-white text-[12px]">Não é agência genérica. É Aceleradora Comercial focada em veículos.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
