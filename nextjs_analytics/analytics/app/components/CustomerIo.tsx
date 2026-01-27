import { AnalyticsBrowser } from "@customerio/cdp-analytics-browser";

const cioanalytics = AnalyticsBrowser.load({ writeKey: "<YOUR_WRITE_KEY>" });

cioanalytics.identify("hello world");

document.body?.addEventListener("click", () => {
  cioanalytics.track("document body clicked!");
});
