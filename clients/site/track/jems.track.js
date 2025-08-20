(function(){
  function hash(obj){
    var enc = new TextEncoder().encode(JSON.stringify(obj||{}));
    return crypto.subtle.digest('SHA-256', enc).then(function(buf){
      return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
    });
  }
  var events = {};
  var tracker = {
    configure: function(cfg){ tracker._cfg = cfg; },
    status: function(){ return { hasProvider: typeof window.jems !== 'undefined' }; },
    on: function(name, cb){ (events[name] = events[name] || []).push(cb); },
    emit: function(kind, meta){
      hash(meta).then(function(metaHash){
        var p = window.jems;
        if (p && typeof p.emit === 'function') {
          p.emit(kind, { metaHash: metaHash });
          (events['ticket-accepted']||[]).forEach(function(cb){ cb({kind:kind}); });
        }
      });
    }
  };
  var script = document.currentScript;
  var siteToken = script && script.dataset ? script.dataset.siteToken || '' : '';
  tracker.configure({ siteToken: siteToken });
  window.JemsTracker = tracker;
  tracker.emit('page_view',{ url: location.href });
})();
