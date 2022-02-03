import { useEffect, useLayoutEffect } from "react";

export const canUseDOM = typeof window !== "undefined";

const useIsomorphicEffect = canUseDOM ? useLayoutEffect : useEffect;

export default useIsomorphicEffect;
