import { useEffect,useContext } from "react";

export function useBeforeUnload(shouldBlock = true, message = "Changes you made may not be saved.") {
  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message; // Chrome requires returnValue
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldBlock, message]);
}
export function useBlockBackNavigation(shouldBlock = true, message = "You have unsaved changes. Are you sure you want to go back?") {
  useEffect(() => {
    if (!shouldBlock) return;

    const handlePopState = (event: PopStateEvent) => {
      const confirmLeave = window.confirm(message);
      if (!confirmLeave) {
        // Push current page back into history to cancel the back navigation
        window.history.pushState(null, document.title, window.location.href);
      }
    };

    // Add a dummy history state to prevent immediate back
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [shouldBlock, message]);
}