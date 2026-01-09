import { motion } from 'framer-motion';

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d1117] backdrop-blur-md">
      <div className="w-64 space-y-4">
        <div className="flex justify-between text-md tracking-widest text-slate-500">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            INITIALIZING_KERNEL...
          </motion.span>
          <span>74%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="relative h-[2px] w-full overflow-hidden bg-blue-500/10">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-full w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_8px_#3b82f6]"
          />
        </div>

        <p className="text-center text-[9px] text-slate-600 uppercase tracking-tighter">
          Checking collaborative sessions...
        </p>
      </div>
    </div>
  )
}

export const InlineCloader = () => {
  return (
    <div className="inline-flex font-mono text-xl space-x-1 font-bold text-blue-500">
      <span>[</span>
      <span className="animate-[pulse_1.5s_infinite]">C</span>
      <span>]</span>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="">
      <div className="relative h-48 overflow-hidden rounded-xl border border-slate-800 bg-[#161b22] p-6">
        
        {/* The Shimmer Effect: Moves slowly across the background */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

        <div className="flex items-center space-x-3">
          {/* Static gray blocks with very low opacity */}
          <div className="h-6 w-6 rounded bg-slate-800/50" />
          <div className="h-6 w-32 rounded bg-slate-800/50" />
        </div>
        
        {/* Added secondary lines to match card layout */}
        <div className="mt-8 space-y-3">
          <div className="h-2 w-20 rounded bg-slate-800/40" />
          <div className="h-2 w-24 rounded bg-slate-800/40" />
        </div>
      </div>
    </div>
  )
}

export function DashboardLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#05070A]">
      <div className="text-4xl font-bold text-blue-500 animate-pulse">
        [C]
      </div>
    </div>
  )
}

export function TopLoader() {
  return (
    <div className="fixed top-0 left-0 h-[2px] w-full bg-blue-500 animate-loading" />
  )
}
