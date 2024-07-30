"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import Logo from "@/components/Common/Logo";
import WalletConnectButton from "@/components/Wallet/wallet-connect-button";
import SlideTabs from "./slide-tabs";

const Navbar = () => {
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="fixed top-0 z-[99999] flex w-full items-center px-6 py-3"
      ref={menuRef}
    >
      <div className="relative mx-auto flex w-full max-w-c-1390 items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        <SlideTabs />

        <div className="flex items-center justify-end gap-x-2 md:ml-32">
          <ModeToggle />
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
