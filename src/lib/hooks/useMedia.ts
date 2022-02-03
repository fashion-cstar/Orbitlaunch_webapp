import { useCallback, useState } from "react";
import useIsomorphicEffect, { canUseDOM } from "./useIsomorphicEffect";

const numeratePixel = (pixelValue: string) =>
  Number(pixelValue?.replace(/px/g, "") ?? "");

const screens = {
  xxs: "280px",
  xs: "320px",
  sm: "600px",
  md: "960px",
  lg: "1280px",
  xl: "1920px",
};

const getMediaQuery = () => {
  const deviceWidth = typeof window !== "undefined" && window.innerWidth;

  return {
    matchesLargeDesktop: deviceWidth >= numeratePixel(screens.lg),
    matchesDesktop: deviceWidth >= numeratePixel(screens.md),
    matchesLargeTablet:
      deviceWidth >= numeratePixel(screens.sm) &&
      deviceWidth < numeratePixel(screens.md),
    matchesSmallTablet:
      deviceWidth >= numeratePixel(screens.sm) &&
      deviceWidth < numeratePixel(screens.md),
    matchesTablet:
      deviceWidth >= numeratePixel(screens.sm) &&
      deviceWidth < numeratePixel(screens.md),
    matchesMobile: deviceWidth < numeratePixel(screens.sm),
  };
};

const useMedia = () => {
  const [media, setMedia] = useState(getMediaQuery());

  const updateBreakpoints = useCallback(() => setMedia(getMediaQuery()), []);

  useIsomorphicEffect(() => {
    if (canUseDOM) {
      window.addEventListener("resize", updateBreakpoints);
      updateBreakpoints();
    }
    return () => {
      if (canUseDOM) {
        return window.removeEventListener("resize", updateBreakpoints);
      }
    };
  }, [updateBreakpoints]);

  return media;
};

export default useMedia;
