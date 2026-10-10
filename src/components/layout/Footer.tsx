import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E0E0E0] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E0E0E0]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-[#2E7D32]">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#2E7D32]">Krishibhoomi</span>
            </div>
            <p className="text-sm text-[#37474F]/80 leading-relaxed max-w-sm">
              Smart farming software empowering sustainable agriculture using advanced Artificial Intelligence and soil data analytics. Zero expensive hardware needed.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F1F8E9] border border-[#C8E6C9] rounded-lg text-xs font-semibold text-[#2E7D32]">
              <Cpu className="w-4 h-4" />
              100% Software-Based AI & Data Analytics
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-[#37474F] uppercase tracking-wider mb-4">Core Modules</h4>
            <ul className="space-y-2.5 text-sm text-[#37474F]/80">
              <li><Link to="/dashboard?tab=soil-analysis" className="hover:text-[#2E7D32] transition-colors">Soil Report Analysis</Link></li>
              <li><Link to="/dashboard?tab=crop-recommendation" className="hover:text-[#2E7D32] transition-colors">Crop Recommendation</Link></li>
              <li><Link to="/dashboard?tab=fertilizer" className="hover:text-[#2E7D32] transition-colors">Fertilizer Advisory</Link></li>
              <li><Link to="/dashboard?tab=pesticides" className="hover:text-[#2E7D32] transition-colors">Bio-Pesticide Guidance</Link></li>
              <li><Link to="/dashboard?tab=yield" className="hover:text-[#2E7D32] transition-colors">Yield Prediction</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#37474F] uppercase tracking-wider mb-4">Farm Analytics</h4>
            <ul className="space-y-2.5 text-sm text-[#37474F]/80">
              <li><Link to="/dashboard?tab=market" className="hover:text-[#2E7D32] transition-colors">Mandi Market Insights</Link></li>
              <li><Link to="/dashboard?tab=profit" className="hover:text-[#2E7D32] transition-colors">Cost & Profit Modeling</Link></li>
              <li><Link to="/dashboard?tab=scenarios" className="hover:text-[#2E7D32] transition-colors">Scenario Simulator</Link></li>
              <li><Link to="/dashboard?tab=reports" className="hover:text-[#2E7D32] transition-colors">Historical Field Audits</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#2E7D32] transition-colors">Farmer Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#37474F] uppercase tracking-wider mb-4">Sustainable AI</h4>
            <p className="text-xs text-[#37474F]/80 leading-relaxed mb-3">
              Designed in compliance with soil conservation principles, organic enrichment protocols, and ICAR agronomic thresholds.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2E7D32]">
              <ShieldCheck className="w-4 h-4" />
              Agronomic Data Verified
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#37474F]/70">
          <p>© {new Date().getFullYear()} Krishibhoomi. All rights reserved. For Sustainable Agriculture Using AI.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2">
            <button type="button" className="hover:text-[#2E7D32] transition-colors whitespace-nowrap">
              Privacy & Data Security
            </button>
            <button type="button" className="hover:text-[#2E7D32] transition-colors whitespace-nowrap">
              Agronomic Terms
            </button>
            <button type="button" className="hover:text-[#2E7D32] transition-colors whitespace-nowrap">
              Soil Lab Integrations
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
