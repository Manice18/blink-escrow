"use client";

import React, { Dispatch, SetStateAction, useRef, useState } from "react";

import { motion } from "framer-motion";
import Link from "next/link";

const SlideTabs = () => {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="absolute left-1/2 top-1/2 mx-auto flex w-fit -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-b from-[#B0ADFF] to-[#060633] p-[0.7px] font-dmsans shadow-xl dark:bg-gradient-to-br"
    >
      <div className="flex rounded-full bg-white px-8 py-1 text-sm text-white dark:bg-gradient-to-br dark:from-[#0C0C3A] dark:to-[#04000E]">
        <Tab setPosition={setPosition}>Create Escrow</Tab>
        <Tab setPosition={setPosition}>On-going</Tab>

        <Cursor position={position} />
      </div>
    </ul>
  );
};

const Tab = ({
  children,
  setPosition,
}: {
  children: string;
  setPosition: Dispatch<SetStateAction<Position>>;
}) => {
  const ref = useRef<null | HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs text-black hover:text-white dark:text-white md:px-5 md:py-2.5 md:text-base"
    >
      <Link
        href={`${children.toLowerCase() === "create escrow" ? "/" : children.toLowerCase()}`}
      >
        {children}
      </Link>
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-7 rounded-full bg-black dark:bg-[#29225B] md:h-11"
    />
  );
};

type Position = {
  left: number;
  width: number;
  opacity: number;
};

export default SlideTabs;
