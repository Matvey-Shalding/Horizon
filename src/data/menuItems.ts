import Banks from 'components/icons/sidebar/nav/Banks';
import Card from 'components/icons/sidebar/nav/Card';
import Home from 'components/icons/sidebar/nav/Home';
import Transaction from 'components/icons/sidebar/nav/Transactions';
import Transfer from 'components/icons/sidebar/nav/Transfer';
import { MAIN_ROUTES } from 'routes';
import MenuItem from 'types/MenuItem.interface';

/**
 * Sidebar menu configuration.
 * @constant
 */
export const menuItems: MenuItem[] = [
  { icon: Home, label: 'Home', path: MAIN_ROUTES.HOME },
  { icon: Banks, label: 'My Banks', path: MAIN_ROUTES.BANKS },
  { icon: Transaction, label: 'Transaction History', path: MAIN_ROUTES.TRANSACTIONS },
  { icon: Transfer, label: 'Payment Transfer', path: MAIN_ROUTES.TRANSFER },
  { icon: Card, label: 'Connect Bank', path: MAIN_ROUTES.CONNECT_BANK },
];
