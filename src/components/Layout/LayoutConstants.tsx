import ChartIcon from "@app/components/svgs/ChartIcon";
import DashboardIcon from "@app/components/svgs/DashboardIcon";
import DexIcon from "@app/components/svgs/DexIcon";
import FeedIcon from "@app/components/svgs/FeedIcon";
import HedgeIcon from "@app/components/svgs/HedgeIcon";
import LaunchpadIcon from "@app/components/svgs/LaunchpadIcon";
import MultiChartIcon from "@app/components/svgs/MultiChartIcon";
import OnChainIcon from "@app/components/svgs/OnChainIcon";
import StakeIcon from "@app/components/svgs/StakeIcon";
import SwapIcon from "@app/components/svgs/SwapIcon";
import WalletIcon from "@app/components/svgs/WalletIcon";
import { colors } from "@app/components/token/colors";

export enum SidebarItem {
  DASHBOARD,
  LAUNCHPAD,
  ON_CHAIN,
  DEX,
  HEDGEFUND,
}

export const SIDEBAR_ROUTES = {
  [SidebarItem.DASHBOARD]: "/",
  [SidebarItem.LAUNCHPAD]: "/coming-soon", // "/portfolio",
  [SidebarItem.ON_CHAIN]: "/coming-soon", // "/feed",
  [SidebarItem.DEX]: "/coming-soon", // "/chart",
  [SidebarItem.HEDGEFUND]: "/coming-soon",
};

export const SIDEBAR_ITEMS = {
  [SidebarItem.DASHBOARD]: "Dashboard",
  [SidebarItem.LAUNCHPAD]: "Launchpad",
  [SidebarItem.ON_CHAIN]: "On Chain",
  [SidebarItem.DEX]: "Dex",
  [SidebarItem.HEDGEFUND]: "Hedgefund",
};

export const SIDEBAR_ICON_MAP = {
  [SidebarItem.DASHBOARD]: ({ active }: { active?: boolean }) => (
    <DashboardIcon fill={active ? colors.app.primary : "#BAB8CC"} />
  ),
  [SidebarItem.LAUNCHPAD]: ({ active }: { active?: boolean }) => (
    <LaunchpadIcon fill={active ? colors.app.primary : "#BAB8CC"} />
  ),
  [SidebarItem.ON_CHAIN]: ({ active }: { active?: boolean }) => (
    <OnChainIcon fill={active ? colors.app.primary : "#BAB8CC"} />
  ),
  [SidebarItem.DEX]: ({ active }: { active?: boolean }) => (
    <DexIcon fill={active ? colors.app.primary : "#BAB8CC"} />
  ),
  [SidebarItem.HEDGEFUND]: ({ active }: { active?: boolean }) => (
    <HedgeIcon fill={active ? colors.app.primary : "#BAB8CC"} />
  ),
};
