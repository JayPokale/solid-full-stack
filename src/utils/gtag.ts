export const GA_TRACKING_ID = "G-0XLHW0KX3P";

declare const window: Window &
  typeof globalThis & {
    gtag: any;
  };

export const pageview = (url: string) => {
  if (window?.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }: any) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
