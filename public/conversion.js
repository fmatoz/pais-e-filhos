/* Google Ads: WhatsApp clicks. Keep new-tab navigation native. */
(function () {
  window.gtag_report_conversion = function (url) {
    var navigated = false;
    var timer;
    var callback = function () {
      if (typeof url !== 'undefined' && !navigated) {
        navigated = true;
        clearTimeout(timer);
        window.location.assign(url);
      }
    };
    if (typeof url !== 'undefined') timer = setTimeout(callback, 1500);
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-1005276118/937TCL6nuokdENaXrd8D',
          value: 1.0,
          currency: 'BRL',
          transaction_id: '',
          event_callback: callback,
          event_timeout: 1200
        });
      } else callback();
    } catch (_) { callback(); }
    return false;
  };
  function trackWhatsApp(event) {
    if (event.defaultPrevented || (event.type === 'auxclick' && event.button !== 1)) return;
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var destination;
    try { destination = new URL(link.href); } catch (_) { return; }
    if (destination.protocol !== 'https:' || destination.hostname !== 'wa.me') return;
    var newContext = link.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1;
    if (newContext) {
      window.gtag_report_conversion();
    } else {
      event.preventDefault();
      window.gtag_report_conversion(link.href);
    }
  }
  document.addEventListener('click', trackWhatsApp);
  document.addEventListener('auxclick', trackWhatsApp);
}());
