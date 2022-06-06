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
  PLAY,
}

export const SIDEBAR_ROUTES = {
  [SidebarItem.DASHBOARD]: "/",
  [SidebarItem.PAD]: "/pad",
  [SidebarItem.ANALYTICS]: "/analytics",
  [SidebarItem.FUND]: "/fund",
  [SidebarItem.EXCHANGE]: "/exchange",
  [SidebarItem.PLAY]: "/play",
};

export const SIDEBAR_ITEMS = {
  [SidebarItem.DASHBOARD]: "Dashboard",
  [SidebarItem.PAD]: "OrbitPad",
  [SidebarItem.ANALYTICS]: "OrbitAnalytics",
  [SidebarItem.FUND]: "OrbitFund",
  [SidebarItem.EXCHANGE]: "OrbitExchange",
  [SidebarItem.PLAY]: "OrbitPlay",
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
  [SidebarItem.PLAY]: ({ active }: { active?: boolean }) => (
    <ExchangeIcon fill={active ? colors.app.primary : "#BAB8CC"} />
  ),
};
