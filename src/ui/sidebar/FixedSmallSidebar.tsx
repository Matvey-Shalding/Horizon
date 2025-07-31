import { motion } from 'framer-motion';
import LogoHeader from './LogoHeader';
import Menu from './Menu';
import UserSection from './UserSection';

interface FixedSmallSidebarProps {
  items: any[]; // Adjust type based on menuItems structure
  pathname: string;
  router: any; // Adjust type based on useRouter return
  onLogout: () => void;
}

const FixedSmallSidebar = ({ items, pathname, router, onLogout }: FixedSmallSidebarProps) => (
  <motion.div
    className="border-border fixed z-20 h-screen w-20 shrink-0 flex-col justify-between overflow-hidden border-r bg-white pt-8 pb-5"
    initial={{ x: 0 }}
    animate={{ x: 0 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    style={{ display: 'flex', height: '100vh' }} // Ensure full viewport height
  >
    <LogoHeader />
    <Menu
      items={items}
      showLabels={false}
      pathname={pathname}
      router={router}
    />
    <UserSection
      user={null}
      showInfo={false}
      onLogout={onLogout}
    />
  </motion.div>
);

export default FixedSmallSidebar;
