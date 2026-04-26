const FAVORITES_KEY = "mateoStorybookFavorites";
const PROGRESS_KEY = "mateoStorybookProgress";
const READING_MODE_KEY = "mateoStorybookReadingMode";
const SLEEP_MODE_KEY = "mateoStorybookSleepMode";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson(key, fallback) {
  if (!canUseStorage()) return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!canUseStorage()) return value;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return value;
  }

  return value;
}

export function getFavoriteStories() {
  return readJson(FAVORITES_KEY, []);
}

export function saveFavoriteStories(storyIds) {
  return writeJson(FAVORITES_KEY, storyIds);
}

export function getLastProgress() {
  return readJson(PROGRESS_KEY, {});
}

export function saveLastProgress(storyId, sceneIndex) {
  const currentProgress = getLastProgress();
  const nextProgress = {
    ...currentProgress,
    [storyId]: {
      sceneIndex,
      updatedAt: new Date().toISOString(),
    },
  };

  return writeJson(PROGRESS_KEY, nextProgress);
}

export function getReadingMode() {
  if (!canUseStorage()) return "narrated";

  const value = window.localStorage.getItem(READING_MODE_KEY);
  return value === "parent" ? "parent" : "narrated";
}

export function saveReadingMode(mode) {
  if (!canUseStorage()) return mode;

  window.localStorage.setItem(
    READING_MODE_KEY,
    mode === "parent" ? "parent" : "narrated"
  );
  return mode;
}

export function getSleepMode() {
  if (!canUseStorage()) return false;

  return window.localStorage.getItem(SLEEP_MODE_KEY) === "true";
}

export function saveSleepMode(enabled) {
  if (!canUseStorage()) return enabled;

  window.localStorage.setItem(SLEEP_MODE_KEY, enabled ? "true" : "false");
  return enabled;
}
