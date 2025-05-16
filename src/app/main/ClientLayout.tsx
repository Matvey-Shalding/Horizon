"use client";

import Log_out from "components/icons/sidebar/Log_out";
import Sidebar from "components/icons/sidebar/Sidebar";
import { SearchInput } from "components/main/SearchInput";
import { menuItems } from "data/menuItems";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AUTH_ROUTES } from "routes";
import { RootState } from "state/store";
import Loader from "ui/Loader";
import { Logo } from "ui/Logo";

export default function ClientLayout({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading: boolean;
}) {
  const user = useSelector((state: RootState) => state.user.user);
  const banks = useSelector((state: RootState) => state.bank.banks);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUnload = () => {
      const dataToSend = { userData: user, userBanks: banks };
      const blob = new Blob([JSON.stringify(dataToSend)], {
        type: "application/json",
      });

      const success = navigator.sendBeacon("/api/home", blob);

      if (!success) {
        console.warn("sendBeacon failed to queue the data for sending.");
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [user, banks]);

  if (isLoading) {
    return <Loader visible={isLoading} />;
  }

  return (
    <div className="flex h-screen overflow-y-hidden">
      {/* Sidebar */}
      <motion.div
        className="border-border flex h-screen flex-col justify-between overflow-hidden border-r-1 pt-8 pb-5"
        initial={{ flexBasis: "280px", minWidth: "280px" }}
        animate={
          isSidebarOpen
            ? { flexBasis: "280px", minWidth: "280px" }
            : { flexBasis: "80px", minWidth: "80px" }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Top section */}
        <div className={`flex basis-full flex-col items-center`}>
          {/* Logo + Toggle */}
          <div className="flex w-full flex-col gap-y-6">
            <div
              className={`flex items-end justify-between self-stretch px-6 ${
                !isSidebarOpen &&
                "border-border justify-center border-b border-solid px-0 pb-4"
              }`}
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
                <Sidebar
                  width={24}
                  height={24}
                  className="text-light-gray fill-light-gray cursor-pointer"
                />
              </button>
            </div>

            {/* Search */}
            <div className="self-center">
              {" "}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mx-6 w-full"
                  >
                    <SearchInput />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Menu items */}
          <nav
            className={`text-dark-gray fill-light-gray mb-6 flex basis-full flex-col self-stretch px-4 font-semibold ${
              !isSidebarOpen ? "items-center justify-center px-0" : "mt-6"
            }`}
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => router.push(item.path)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${
                  isSidebarOpen && "gradient_hover hover:fill-white"
                } rounded-main hover:fill-blue flex items-center gap-x-2 px-4 py-4 transition-colors duration-500 hover:text-white`}
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
            ))}
          </nav>

          {/* Bottom user section */}
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

      {/* Main content */}
      {children}
    </div>
  );
}
