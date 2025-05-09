import Banks from "components/icons/sidebar/nav/Banks";
import Card from "components/icons/sidebar/nav/Card";
import Home from "components/icons/sidebar/nav/Home";
import Transaction from "components/icons/sidebar/nav/Transactions";
import Transfer from "components/icons/sidebar/nav/Transfer";
import type { ComponentType, SVGProps } from "react";
import { MAIN_ROUTES } from "routes";

/**
 * Represents a single item in the sidebar menu.
 */
interface MenuItem {
  /** React component for the icon (e.g., SVG) */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Label to be displayed in the sidebar */
  label: string;
  /** Route path to navigate to */
  path: string;
}

/**
 * Sidebar menu configuration.
 */
export const menuItems: MenuItem[] = [
  { icon: Home, label: "Home", path: MAIN_ROUTES.HOME },
  { icon: Banks, label: "My banks", path: MAIN_ROUTES.BANKS },
  {
    icon: Transaction,
    label: "Transaction History",
    path: MAIN_ROUTES.TRANSACTIONS,
  },
  {
    icon: Transfer,
    label: "Payment Transfer",
    path: MAIN_ROUTES.TRANSFER,
  },
  {
    icon: Card,
    label: "Connect Bank",
    path: MAIN_ROUTES.CONNECT_BANK,
  },
];
