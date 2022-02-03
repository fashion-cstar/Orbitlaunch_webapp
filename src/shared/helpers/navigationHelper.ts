import { useRouter } from "next/router";

export const useRouteMatch = (path: string) => {
  const router = useRouter();
  return router.pathname === path;
};
