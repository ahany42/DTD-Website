import { useState, useEffect } from "react";

const queries = {
  superLargeDesktop: "(min-width: 1280px)",
  desktop: "(min-width: 1025px) and (max-width: 1279px)",
  tablet: "(min-width: 651px) and (max-width: 1024px)",
  mobile: "(max-width: 650px)",
};

const getMatchedBreakpoint = () => {
  if (window.matchMedia(queries.superLargeDesktop).matches)
    return "superLargeDesktop";
  if (window.matchMedia(queries.desktop).matches) return "desktop";
  if (window.matchMedia(queries.tablet).matches) return "tablet";
  return "mobile";
};

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() => getMatchedBreakpoint());

  useEffect(() => {
    const mediaQueryLists = Object.entries(queries).map(([key, query]) => [
      key,
      window.matchMedia(query),
    ]);

    const handler = () => {
      const matched = mediaQueryLists.find(([, mql]) => mql.matches);
      if (matched) {
        const next = matched[0];
        setBreakpoint((prev) => (prev !== next ? next : prev));
      }
    };

    mediaQueryLists.forEach(([, mql]) =>
      mql.addEventListener("change", handler)
    );
    handler(); // Run once on mount

    return () => {
      mediaQueryLists.forEach(([, mql]) =>
        mql.removeEventListener("change", handler)
      );
    };
  }, []);

  return breakpoint;
};

export default useBreakpoint;
