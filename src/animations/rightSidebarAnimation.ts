
/**
 * Generates animation configuration for the right sidebar based on its state.
 * @param isCollapsed - Whether the sidebar is collapsed.
 * @param isRightSidebarFixed - Whether the sidebar is fixed (based on media query).
 * @param isMobile - Whether the viewport is mobile-sized.
 * @returns Animation configuration object for Framer Motion.
 */
export const generateRightSidebarAnimation = (
  isCollapsed: boolean,
  isRightSidebarFixed: boolean,
  isMobile: boolean
) => ({
  initial: isRightSidebarFixed ? { x: '100%' } : { width: 0 },
  animate: {
    ...(isRightSidebarFixed
      ? { x: 0 }
      : { width: !isCollapsed ? (isMobile ? '100vw' : '450px') : 0 }),
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
  exit: isRightSidebarFixed ? { x: '100%' } : { width: 0, transition: { duration: 0.4, ease: 'easeInOut' } },
});
