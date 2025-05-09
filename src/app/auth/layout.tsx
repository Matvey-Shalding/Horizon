"use client";

import { motion } from "framer-motion"; // Import framer-motion
import { useEffect } from "react"; // Import useEffect to manage overflow
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import Loader from "ui/Loader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const visible = useSelector((state: RootState) => state.auth.isPending);

  return (
    <div className="relative">
      <Loader visible={visible} />
      <div className="flex">
        <div className="max-tablet:pt-[10vh] max-tablet:pb-[10vh] grid w-full place-content-center bg-white pt-[14vh] pb-[14vh]">
          {children}
        </div>

        <motion.div
          className="bg-light-white laptop:pt-[14vh] laptop:place-content-start laptop:grid desktop:min-w-1/2 hidden min-w-4/10 place-content-center pl-3"
          initial={{ x: "100%" }} // Start from off-screen on the right
          animate={{ x: 0 }} // Animate to original position
          transition={{ type: "spring", stiffness: 50 }} // Add spring animation for smoother effect
        >
          <img src="/img/auth/bg.jpg" alt="" />
        </motion.div>
      </div>
    </div>
  );
}
