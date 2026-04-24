import { defaultContent } from "./defaultContent";

export const CMS_STORAGE_KEY = "faruk_automation_content_v1";

export function getContent() {
  if (typeof window === "undefined") {
    return defaultContent;
  }

  const stored = window.localStorage.getItem(CMS_STORAGE_KEY);
  if (!stored) {
    return defaultContent;
  }

  try {
    const parsed = JSON.parse(stored);
    return { ...defaultContent, ...parsed };
  } catch {
    return defaultContent;
  }
}

export function saveContent(content) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(content));
}

export function resetContent() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(CMS_STORAGE_KEY);
}
