"use client";

import { useClickOutside, useMediaQuery } from "@react-hookz/web";
import clsx from "clsx";
import Plus from "components/icons/main/home/plus";
import Sidebar from "components/icons/sidebar/Sidebar";
import { MENU_STATUSES, MenuStatus } from "constants/MenuStatuses";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MAIN_ROUTES } from "routes";
import { MEDIA_QUERIES } from "settings/MediaQueries";
import { RootState } from "state/store";
import { CardList } from "../connect-bank/CardList";
import { CategorySection } from "./section/CategorySection";

interface RightSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeTab: number;
}

export default function RightSidebar({
  isCollapsed,
  setIsCollapsed,
  activeTab,
}: RightSidebarProps) {
  const user = useSelector((state: RootState) => state.user.user);
  const banks = useSelector((state: RootState) => state.bank.banks);
  const router = useRouter();
  const [menuStatus, setMenuStatus] = useState<MenuStatus>(
    MENU_STATUSES.DEFAULT,
  );
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isRightSidebarFixed = useMediaQuery("(max-width: 1150px)", {});
  const isMobile = useMediaQuery(`(max-width:${MEDIA_QUERIES.MOBILE})`);

  useEffect(() => {
    setIsCollapsed(!!isRightSidebarFixed);
  }, [isRightSidebarFixed]);

  const animation = useMemo(() => {
    if (isRightSidebarFixed) {
      return {
        initial: { x: "100%" },
        animate: {
          x: 0,
          transition: { duration: 0.4, ease: "easeInOut" },
        },
        exit: {
          x: "100%",
          transition: { duration: 0.4, ease: "easeInOut" },
        },
      };
    }
    return {
      initial: { width: 0 },
      animate: {
        width:
          !isCollapsed && !isRightSidebarFixed
            ? isMobile
              ? "100vw"
              : "450px"
            : undefined,
        transition: { duration: 0.4, ease: "easeInOut" },
      },
      exit: {
        width: 0,
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    };
  }, [isCollapsed, isRightSidebarFixed, isMobile]);

  // Prevent immediate closure by checking if the click is on the toggle
  useClickOutside(sidebarRef, (event) => {
    const toggleButton = document.querySelector(".toggle-button");
    if (isRightSidebarFixed && event.target !== toggleButton) {
      setIsCollapsed(true);
    }
  });

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.maxHeight = window.innerHeight + "px";
    }
  });

  return (
    <Fragment>
      {isCollapsed && (
        <div
          onClick={() => void setIsCollapsed(false)}
          className="toggle-button absolute top-4 right-1.5 flex gap-x-1 p-2 pr-0"
        >
          <div className="bg-border rounded-l-main h-10 w-1.25"></div>
        </div>
      )}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            ref={sidebarRef}
            {...animation}
            className={clsx(
              "shrink-0 w-98 overflow-x-hidden overflow-y-scroll bg-white pt-8",
              isRightSidebarFixed && "fixed top-0 right-0 z-30",
              isMobile && "w-full",
            )}
          >
            <div className={`flex flex-col`}>
              <div className="basis-full px-6 max-[450px]:px-4">
                <div className="flex h-full basis-full flex-col gap-y-8">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-dark text-2xl font-semibold">
                        {user?.firstName + " " + user?.lastName}
                      </span>
                      <span className="text-gray">{user?.email}</span>
                    </div>
                    <button onClick={() => setIsCollapsed(!isCollapsed)}>
                      <Sidebar
                        width={24}
                        height={24}
                        className="text-light-gray fill-light-gray cursor-pointer"
                      />
                    </button>
                  </div>
                  <div className="-mx-1.5 flex flex-col gap-y-6">
                    <div className="border-border flex justify-between border-b border-solid pb-1.5">
                      <span className="text-dark text-lg font-semibold">
                        My banks
                      </span>
                      <div
                        onClick={() =>
                          void router.push(MAIN_ROUTES.CONNECT_BANK)
                        }
                        className="text-gray flex cursor-pointer items-center gap-x-2"
                      >
                        <Plus className="fill-gray stroke-gray" />
                        <span className="text-sm font-semibold">Add bank</span>
                      </div>
                    </div>
                    <CardList
                      cardsToShow={isMobile ? 1 : 3}
                      banks={banks}
                      user={user}
                      activeTab={activeTab}
                    />
                  </div>
                  <CategorySection
                    status={menuStatus}
                    setStatus={setMenuStatus}
                    activeTab={activeTab}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
}
