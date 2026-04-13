export const CONTENT_LINKS_KEY = "goTeach.publishedLinks";
export const CONTENT_MEDIA_KEY = "goTeach.publishedMedia";
export const LEARNING_PATH_KEY = "goTeach.learningPath";

export const defaultPublishedLinks = [
  {
    id: "seed-link-1",
    label: "Road safety handbook",
    url: "https://gov.go.ke/road-safety",
    source: "GoDomain Studio",
    addedAt: "2026-04-13T08:00:00.000Z",
    status: "Published",
  },
  {
    id: "seed-link-2",
    label: "Mock test prep",
    url: "https://learner.godomain.africa/mock-test",
    source: "GoDomain Studio",
    addedAt: "2026-04-12T16:30:00.000Z",
    status: "Published",
  },
  {
    id: "seed-link-3",
    label: "Defensive driving basics",
    url: "https://youtube.com/defensive-driving-basics",
    source: "GoDomain Studio",
    addedAt: "2026-04-11T11:10:00.000Z",
    status: "Published",
  },
];

export const defaultPublishedMedia = [];

export function createStudioId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function readStudioCollection(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeStudioCollection(key, items) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(items));
}

export function formatFileSize(sizeInBytes) {
  if (!Number.isFinite(sizeInBytes) || sizeInBytes <= 0) {
    return "0 KB";
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeInBytes / 1024))} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatPublishedDate(isoValue) {
  if (!isoValue) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoValue));
}
