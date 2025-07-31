import SidebarIcon from 'components/icons/sidebar/Sidebar';

interface ToggleButtonProps {
  onClick: () => void;
}

const ToggleButton = ({ onClick }: ToggleButtonProps) => (
  <button onClick={onClick}>
    <SidebarIcon
      width={24}
      height={24}
      className="text-light-gray fill-light-gray cursor-pointer"
    />
  </button>
);

export default ToggleButton;
