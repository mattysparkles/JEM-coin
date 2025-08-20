import { sha256 } from 'js-sha256';

interface TrackerConfig {
  siteToken: string;
  rules?: Record<string, unknown>;
  sampling?: number;
  rateLimits?: Record<string, number>;
}

type EventCb = (data: unknown) => void;

class JemsTrackerImpl {
  private config?: TrackerConfig;
  private events: Record<string, EventCb[]> = {};

  configure(cfg: TrackerConfig) {
    this.config = cfg;
  }

  status() {
    const hasProvider = typeof (window as any).jems !== 'undefined';
    return { hasProvider };
  }

  on(name: string, cb: EventCb) {
    (this.events[name] = this.events[name] || []).push(cb);
  }

  emit(kind: string, meta: Record<string, unknown> = {}) {
    const metaHash = sha256(JSON.stringify(meta));
    const provider = (window as any).jems;
    if (provider && typeof provider.emit === 'function') {
      provider.emit(kind, { metaHash });
      this.events['ticket-accepted']?.forEach(cb => cb({ kind }));
    }
    return metaHash;
  }
}

(function () {
  const script = document.currentScript as HTMLScriptElement | null;
  const siteToken = script?.dataset.siteToken || '';
  const tracker = new JemsTrackerImpl();
  tracker.configure({ siteToken });
  (window as any).JemsTracker = tracker;
  tracker.emit('page_view', { url: location.href });
})();
