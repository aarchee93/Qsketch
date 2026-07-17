// Plain in-memory flags scoped to the current page load. Deliberately NOT
// using localStorage/sessionStorage — this is purely a JS module variable,
// so it resets the moment the tab is refreshed or closed. Used to show
// onboarding "once per visit" without tracking anything durably.

const seenOnboarding = {
  simulator: false,
  game: false,
};

export const hasSeenOnboarding = (key) => !!seenOnboarding[key];

export const markOnboardingSeen = (key) => {
  seenOnboarding[key] = true;
};
