export function useIsFirstRender() {
  let isFirstRender = true;
  return () => {
    if (!isFirstRender) return false;
    isFirstRender = false;
    return true;
  };
}
