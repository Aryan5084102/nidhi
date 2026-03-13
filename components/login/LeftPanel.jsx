function LeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1a2744] to-[#0F172A]">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.07] blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/[0.07] blur-3xl" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 via-indigo-400 to-emerald-400" />

      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-emerald-500/25">
            G
          </div>
          <div>
            <div className="text-white text-lg font-bold tracking-tight">Glimmora Nidhi</div>
            <div className="text-slate-400 text-xs">Agentic AI Platform</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-dot" />
              <span className="text-emerald-400 text-xs font-semibold">AI-Powered Chit Fund Management</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Smart Chit Fund<br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Operations Hub</span>
            </h1>
            <p className="text-slate-400 text-[15px] leading-relaxed">
              Manage your Nidhi company with AI-powered risk assessment,
              automated compliance, and real-time fraud detection — all in one platform.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "\uD83D\uDEE1\uFE0F", title: "RBI Compliant", desc: "Automated regulatory compliance monitoring" },
              { icon: "\uD83E\uDD16", title: "6 AI Agents", desc: "Intelligent automation across all operations" },
              { icon: "\uD83D\uDCCA", title: "Real-time Analytics", desc: "Live dashboards with predictive insights" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{f.title}</div>
                  <div className="text-slate-500 text-xs">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-slate-600 text-xs">
          &copy; 2026 Glimmora International. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default LeftPanel;
