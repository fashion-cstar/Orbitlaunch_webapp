import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  SIDEBAR_ITEMS,
  SIDEBAR_ICON_MAP,
  SIDEBAR_ROUTES,
} from "./LayoutConstants";

export default function Layout() {

  const router = useRouter();
  const routeMatch = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className="flex space-x-6 justify-center p-2">

      {Object.keys(SIDEBAR_ITEMS).map((key, index) => {
        const Icon = SIDEBAR_ICON_MAP[key];
        const isActive = routeMatch(SIDEBAR_ROUTES[key]);
        return (
          <div key={key}>
            <div key={key}>
              <Link href={SIDEBAR_ROUTES[key]} passHref>
                <a
                  key={key}
                  className={clsx(
                    "tracking-[0.5px] rounded transition duration-300",
                    {
                      "text-app-primary": isActive
                    }
                  )}
                >
                  <Icon active={isActive} />
                </a>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
