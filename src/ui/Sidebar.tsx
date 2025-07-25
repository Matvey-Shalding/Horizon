import { useClickOutside, useMediaQuery } from "@react-hookz/web";
import clsx from "clsx";
import Log_out from "components/icons/sidebar/Log_out";
import SidebarIcon from "components/icons/sidebar/Sidebar";
import { menuItems } from "data/menuItems";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AUTH_ROUTES } from "routes";
import { MEDIA_QUERIES } from "settings/MediaQueries";
import { RootState } from "state/store";
import { Logo } from "ui/Logo";
import { Input } from "./Input";

// Memoize the component to prevent re-renders on unchanged props
const Sidebar = ({ isLoading }: { isLoading: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);
  const banks = useSelector((state: RootState) => state.bank.banks);

  const isLargeScreen = useMediaQuery(
    `(min-width:${MEDIA_QUERIES.LARGE_DESKTOPS})`,
  );
  const isSmallScreen = useMediaQuery(
    `(max-width:${MEDIA_QUERIES.SMALL_DESKTOPS})`,
  );
  const isMobile = useMediaQuery(`(max-width:${MEDIA_QUERIES.MOBILE})`);

  const [isSidebarOpen, setIsSidebarOpen] = useState(isLargeScreen);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePageHide = (event: PageTransitionEvent) => {
      const dataToSend = { userData: user, userBanks: banks };
      const blob = new Blob([JSON.stringify(dataToSend)], {
        type: "application/json",
      });
      const success = navigator.sendBeacon("/api/home", blob);

      if (!success) {
        console.warn("sendBeacon failed to queue the data for sending.");
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [user, banks]);

  if (isLoading) return null;

  useClickOutside(sidebarRef, () => {
    if (isSmallScreen) {
      setIsSidebarOpen(false);
    }
  });

  // Small screens (max-width: SMALL_DESKTOPS)
  if (isSmallScreen) {
    return (
      <Fragment>
        <div
          className="fixed top-4 left-0 z-40 flex gap-x-1 p-2 pl-0"
          onClick={() => setIsSidebarOpen(true)}
        >
          <div className="bg-border rounded-r-main h-10 w-1"></div>
        </div>
        <motion.div
          ref={sidebarRef}
          className="fixed z-30 h-screen w-80 shrink-0 flex-col justify-between overflow-hidden bg-white pt-8 pb-5"
          initial={{ x: "-100%" }}
          animate={{
            x: isSidebarOpen ? 80 : "-100%",
            transition: { duration: 0.4, ease: "easeInOut" },
          }}
          exit={{
            x: "-100%",
            transition: { duration: 0.4, ease: "easeInOut" },
          }}
        >
          <div className="flex basis-full flex-col items-center">
            <div className="flex w-full flex-col gap-y-6">
              <div className="flex items-end justify-between self-stretch px-6">
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Logo />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <SidebarIcon
                    width={24}
                    height={24}
                    className="text-light-gray fill-light-gray cursor-pointer"
                  />
                </button>
              </div>
              <div className="w-full px-4">
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <Input placeholder="Search..." />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <nav
              className={clsx(
                "text-dark-gray fill-light-gray mb-6 flex basis-full flex-col self-stretch px-4 font-semibold",
                !isSidebarOpen ? "items-center justify-center px-0" : "mt-4",
              )}
            >
              {menuItems.map((item, index) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <motion.button
                    key={index}
                    onClick={() => router.push(item.path)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={clsx(
                      "rounded-main flex items-center gap-x-2 px-4 py-4 transition-colors duration-500 hover:text-white",
                      !isSidebarOpen && "justify-center",
                      !isSidebarOpen && !isActive && "hover:fill-blue",
                      isSidebarOpen && "hover:bg-light-blue hover:fill-white",
                      isActive &&
                        "bg-[linear-gradient(90deg,#0179fe_0%,#4893ff_100%)] fill-white text-white",
                    )}
                  >
                    <item.icon />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </nav>
            <div className="border-border flex items-center justify-center gap-x-4 self-stretch border-t px-2 pt-4">
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-col gap-y-0.5">
                      <span className="text-dark-gray text-sm font-semibold">
                        {user
                          ? `${user.firstName?.trim()} ${user.lastName?.trim()}`
                          : "Loading..."}
                      </span>
                      <span className="text-sm">
                        {user ? user.email?.trim() : ""}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Log_out
                onClick={() => signOut({ callbackUrl: AUTH_ROUTES.LOGIN })}
                width={20}
                height={20}
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          className="border-border fixed z-20 h-screen w-20 shrink-0 flex-col justify-between overflow-hidden border-r bg-white pt-8 pb-5"
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex basis-full flex-col items-center">
            <div className="flex w-full flex-col gap-y-4">
              <div className="border-border flex items-center justify-center self-stretch border-b px-0 pb-4">
                <Logo />
              </div>
            </div>
            <nav className="text-dark-gray fill-light-gray mb-6 flex basis-full flex-col items-center justify-center px-0 font-semibold">
              {menuItems.map((item, index) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <motion.button
                    key={index}
                    onClick={() => router.push(item.path)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={clsx(
                      "rounded-main flex items-center justify-center gap-x-2 px-4 py-4 transition-colors duration-500 hover:text-white",
                      !isActive && "hover:fill-blue",
                      isActive &&
                        "bg-[linear-gradient(90deg,#0179fe_0%,#4893ff_100%)] fill-white text-white",
                    )}
                  >
                    <item.icon />
                  </motion.button>
                );
              })}
            </nav>
            <div className="border-border flex items-center justify-center gap-x-4 self-stretch border-t px-2 pt-4">
              <Log_out
                onClick={() => signOut({ callbackUrl: AUTH_ROUTES.LOGIN })}
                width={20}
                height={20}
              />
            </div>
          </div>
        </motion.div>
      </Fragment>
    );
  }

  // Large screens (min-width: LARGE_DESKTOPS)
  if (isLargeScreen) {
    return (
      <motion.div
        ref={sidebarRef}
        className="border-border z-30 flex h-screen shrink-0 grow-1 flex-col justify-between overflow-hidden border-r bg-white pt-8 pb-5"
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex basis-full flex-col items-center">
          <div className="flex w-full flex-col gap-y-4">
            <div
              className={clsx(
                "flex items-center justify-between self-stretch px-6",
                !isSidebarOpen &&
                  "border-border justify-center border-b border-solid px-0 pb-4",
              )}
            >
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Logo />
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <SidebarIcon
                  width={24}
                  height={24}
                  className="text-light-gray fill-light-gray cursor-pointer"
                />
              </button>
            </div>
            <div className="w-full px-4">
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <Input placeholder="Search..." />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <nav
            className={clsx(
              "text-dark-gray fill-light-gray mb-6 flex basis-full flex-col self-stretch px-4 font-semibold",
              !isSidebarOpen ? "items-center justify-center px-0" : "mt-4",
            )}
          >
            {menuItems.map((item, index) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <motion.button
                  key={index}
                  onClick={() => router.push(item.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={clsx(
                    "rounded-main flex items-center gap-x-2 px-4 py-4 transition-colors duration-500 hover:text-white",
                    !isSidebarOpen && "justify-center",
                    !isSidebarOpen && !isActive && "hover:fill-blue",
                    isSidebarOpen && "hover:bg-light-blue hover:fill-white",
                    isActive &&
                      "bg-[linear-gradient(90deg,#0179fe_0%,#4893ff_100%)] fill-white text-white",
                  )}
                >
                  <item.icon />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </nav>
          <div className="border-border flex items-center justify-center gap-x-4 self-stretch border-t px-2 pt-4">
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col gap-y-0.5">
                    <span className="text-dark-gray text-sm font-semibold">
                      {user
                        ? `${user.firstName?.trim()} ${user.lastName?.trim()}`
                        : "Loading..."}
                    </span>
                    <span className="text-sm">
                      {user ? user.email?.trim() : ""}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <Log_out
              onClick={() => signOut({ callbackUrl: AUTH_ROUTES.LOGIN })}
              width={20}
              height={20}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  // Medium screens (SMALL_DESKTOPS < screen < LARGE_DESKTOPS)
  function SmallSidebar() {
    return (
      <div
        ref={sidebarRef}
        className="border-border static z-30 flex h-screen w-20 shrink-0 grow-1 flex-col justify-between overflow-hidden border-r bg-white pt-8 pb-5"
      >
        <div className="flex basis-full flex-col items-center">
          <div className="flex w-full flex-col gap-y-4">
            <div
              className={clsx(
                "flex items-center justify-between self-stretch px-6",

                "border-border justify-center border-b border-solid px-0 pb-4",
              )}
            >
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <SidebarIcon
                  width={24}
                  height={24}
                  className="text-light-gray fill-light-gray cursor-pointer"
                />
              </button>
            </div>
          </div>
          <nav
            className={clsx(
              "text-dark-gray fill-light-gray mb-6 flex basis-full flex-col self-stretch px-4 font-semibold",
              "items-center justify-center px-0",
            )}
          >
            {menuItems.map((item, index) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <motion.button
                  key={index}
                  onClick={() => router.push(item.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={clsx(
                    "rounded-main flex min-h-6 min-w-6 items-center gap-x-2 px-4 py-4 transition-colors duration-500 hover:text-white",
                    "justify-center",
                    !isActive && "hover:fill-blue",
                    isActive &&
                      "bg-[linear-gradient(90deg,#0179fe_0%,#4893ff_100%)] fill-white text-white",
                  )}
                >
                  <item.icon />
                </motion.button>
              );
            })}
          </nav>
          <div className="border-border flex items-center justify-center gap-x-4 self-stretch border-t px-2 pt-4">
            <Log_out
              onClick={() => signOut({ callbackUrl: AUTH_ROUTES.LOGIN })}
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SmallSidebar />
      <motion.div
        ref={sidebarRef}
        className={clsx(
          "border-border fixed z-30 flex h-screen w-80 shrink-0 grow-1 -translate-x-full flex-col justify-between overflow-hidden border-r bg-white pt-8 pb-5 transition-transform duration-500",
          isSidebarOpen && "translate-x-0",
        )}
      >
        <div className="flex basis-full flex-col items-center">
          <div className="flex w-full flex-col gap-y-4">
            <div
              className={clsx(
                "flex items-center justify-between self-stretch px-6",
              )}
            >
              <Logo />

              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <SidebarIcon
                  width={24}
                  height={24}
                  className="text-light-gray fill-light-gray cursor-pointer"
                />
              </button>
            </div>
            <div className="w-full px-4">
              <motion.div className="w-full">
                <Input placeholder="Search..." />
              </motion.div>
            </div>
          </div>
          <nav
            className={clsx(
              "text-dark-gray fill-light-gray mb-6 flex basis-full flex-col self-stretch px-4 font-semibold",
              "mt-4",
            )}
          >
            {menuItems.map((item, index) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <motion.button
                  key={index}
                  onClick={() => router.push(item.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={clsx(
                    "rounded-main flex items-center gap-x-2 px-4 py-4 transition-colors duration-500 hover:text-white",
                    isSidebarOpen && "hover:bg-light-blue hover:fill-white",
                    isActive &&
                      "bg-[linear-gradient(90deg,#0179fe_0%,#4893ff_100%)] fill-white text-white",
                  )}
                >
                  <item.icon />

                  <motion.span className="overflow-hidden whitespace-nowrap">
                    {item.label}
                  </motion.span>
                </motion.button>
              );
            })}
          </nav>
          <div className="border-border flex items-center justify-center gap-x-4 self-stretch border-t px-2 pt-4">
            <div className="flex flex-col gap-y-0.5">
              <span className="text-dark-gray text-sm font-semibold">
                {user
                  ? `${user.firstName?.trim()} ${user.lastName?.trim()}`
                  : "Loading..."}
              </span>
              <span className="text-sm">{user ? user.email?.trim() : ""}</span>
            </div>
            <Log_out
              onClick={() => signOut({ callbackUrl: AUTH_ROUTES.LOGIN })}
              width={20}
              height={20}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};

// Export as memoized component
export default React.memo(Sidebar);
