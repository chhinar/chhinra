
"use strict";

(function() {
  function createScriptLoadPromise(script) {
    return new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
    });
  }

  let trustArcPromise;

  const userAgentPatterns = "Googlebot|bingbot";
  const hideFromUserAgent = new RegExp(userAgentPatterns).test(
    navigator.userAgent
  );

  if (!hideFromUserAgent) {
    const trustArcScript = document.createElement('script');
    trustArcScript.src = "https://consent.trustarc.com/v2/notice/gsyiod";
    trustArcScript.type = 'text/javascript';
    trustArcScript.async = true;
    document.head.appendChild(trustArcScript);
    trustArcPromise = createScriptLoadPromise(trustArcScript);
  } else {
    trustArcPromise = Promise.resolve();
  }

  const consentManagerScript = document.createElement('script');
  consentManagerScript.src = '/javascripts/consentManager.js?17f6bfece9f1';
  consentManagerScript.type = 'text/javascript';
  consentManagerScript.async = true;
  document.head.appendChild(consentManagerScript);
  const consentManagerPromise = createScriptLoadPromise(consentManagerScript);

  Promise.all([
    trustArcPromise,
    consentManagerPromise,
  ]).then(() => {
    const consentManager = window.Consent.ConsentManager;
    const log = window.Consent.createLogger("lib:consentManager:rails");

    if (consentManager) {
      log(`Consent manager loaded`);


      window.Consent.initSegment({
        writeKey: "poTMRBHig2tYBNBP5P6kGfkGBFq19jmB",
        cookieDomain: "wellfound.com",
        load: (writeKey, integrations) => {
          var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;
          t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};
          analytics._writeKey="poTMRBHig2tYBNBP5P6kGfkGBFq19jmB";
          analytics.SNIPPET_VERSION="4.15.2";
          analytics.load("poTMRBHig2tYBNBP5P6kGfkGBFq19jmB", { cookie: {domain: "wellfound.com", secure: true}, integrations: integrations });

          window.analytics_enabled = true;


          analytics.page();
        }},
        reset: () => {
          window.analytics_enabled = false;
          analytics.reset();
        }
      });

      consentManager.addConsentChangedListener(
        'functional',
        () => {
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "m9tpuk6fvx");

          window.clarity('consent');



          log('Clarity consent granted');
        },
        (options) => {
          window.clarity('consent', false);
          options.requestReload();
          log('Clarity consent removed');
        }
      );

      consentManager.init({
        defaultToFullConsent: false,
      });

      log('Consent manager initialized');

      // Let outside dependencies know that we've fully initialized the consent manager
      setTimeout(() => {
        window.dispatchEvent(new Event('wellfound:consentManager:ready'));
        log('Consent manager ready event dispatched');
      }, 0);
    } else {
      log('ConsentManager not found');
    }
  }).catch((error) => {
    console.error('Error loading consent manager scripts:', error);
  });
})();

