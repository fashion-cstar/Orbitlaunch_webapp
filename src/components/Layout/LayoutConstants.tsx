import DashboardIcon from "@app/components/svgs/slidebar/DashboardIcon";
import ExchangeIcon from "@app/components/svgs/slidebar/ExchangeIcon";
import FundIcon from "@app/components/svgs/slidebar/FundIcon";
import PadIcon from "@app/components/svgs/slidebar/PadIcon";
import AnalyticsIcon from "@app/components/svgs/slidebar/AnalyticsIcon";
import { colors } from "@app/components/token/colors";

export enum SidebarItem {
  DASHBOARD,
  PAD,
  ANALYTICS,
  FUND,
  EXCHANGE,
}

export const SIDEBAR_ROUTES = {
  [SidebarItem.DASHBOARD]: "/",
  [SidebarItem.PAD]: "/coming-soon", // "/pad",
  [SidebarItem.ANALYTICS]: "/coming-soon", // "/analytics",
  [SidebarItem.FUND]: "/coming-soon", // "/fund",
  [SidebarItem.EXCHANGE]: "/coming-soon", // "/exchange",
};

export const SIDEBAR_ITEMS = {
  [SidebarItem.DASHBOARD]: "Dashboard",
  [SidebarItem.PAD]: "OrbitPad",
  [SidebarItem.ANALYTICS]: "OrbitAnalytics",
  [SidebarItem.FUND]: "OrbitFund",
  [SidebarItem.EXCHANGE]: "OrbitExchange",
};

export const SIDEBAR_ICON_MAP = {
  [SidebarItem.DASHBOARD]: ({ active }: { active?: boolean }) => (
    <DashboardIcon fill={active ? colors.app.primary : "#BAB8CC"} />
  ),
  [SidebarItem.PAD]: ({ active }: { active?: boolean }) => (
    <PadIcon fill={active ? colors.app.primary : "#BAB8CC"} />
  ),
  [SidebarItem.ANALYTICS]: ({ active }: { active?: boolean }) => (
    <AnalyticsIcon fill={active ? colors.app.primary : "#BAB8CC"} />
  ),
  [SidebarItem.FUND]: ({ active }: { active?: boolean }) => (
    <FundIcon fill={active ? colors.app.primary : "#BAB8CC"} />
  ),
  [SidebarItem.EXCHANGE]: ({ active }: { active?: boolean }) => (
    <ExchangeIcon fill={active ? colors.app.primary : "#BAB8CC"} />
  ),
};
