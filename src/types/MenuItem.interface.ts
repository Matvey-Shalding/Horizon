import { ComponentType, SVGProps } from 'react';

/**
 * Represents a single item in the sidebar menu.
 * @interface MenuItem
 */
export interface MenuItem {
  /**
   * The React component for the menu item's icon, typically an SVG.
   * @example
   * ```tsx
   * import { ReactComponent as HomeIcon } from './home.svg';
   * const item: MenuItem = { icon: HomeIcon, label: 'Home', path: '/' };
   * ```
   */
  icon: ComponentType<SVGProps<SVGSVGElement>>;

  /**
   * The display label for the menu item shown in the sidebar.
   * @example 'Dashboard'
   */
  label: string;

  /**
   * The route path to navigate to when the menu item is clicked.
   * @example '/dashboard'
   */
  path: string;
}

export default MenuItem;
