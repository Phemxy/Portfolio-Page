// The pinned cf CLI reads this object when deploying Vite's existing dist/.
// No application runtime or extra build plugin is required for static hosting.
export default {
  worker: {
    name: 'portfolio-page',
    compatibilityDate: '2026-11-25',
    workersDev: true,
    assets: {
      htmlHandling: 'auto-trailing-slash',
      notFoundHandling: 'none',
    },
    observability: {
      enabled: true,
      logs: { enabled: true, invocationLogs: true },
      traces: { enabled: true, headSamplingRate: 0.1 },
    },
  },
};
