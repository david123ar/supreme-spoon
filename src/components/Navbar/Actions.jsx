"use client";
import React from "react";
import { FaRandom, FaComments, FaBroadcastTower } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Actions({ isInSidebar, IsLoading }) {
  const router = useRouter(); // Initialize the router
  const handleNavigation = (data) => {
    IsLoading(data);
  };

  const handleRandomClick = () => {
    const randomId = Math.floor(Math.random() * 10000); // Generate random number
    router.push(`/random?rand=${randomId}`); // Push the route manually
  };

  return (
    <div
      className="nav-actions f-poppins text-light trans-c-03 grid items-center"
      style={
        isInSidebar
          ? {
              display: "flex",
              background: "var(--dark)",
              marginInline: "0px",
              borderRadius: "0px",
            }
          : {}
      }
    >
      <span>
        <Link href="/working" className="anchor" onClick={() => handleNavigation(true)}>
          <FaBroadcastTower size={20} />
          <p>Watch2gether</p>
        </Link>
      </span>
      <span onClick={() => handleRandomClick() & handleNavigation('true-random')} style={{ cursor: "pointer" }}>
        <FaRandom size={20} />
        <p>Random</p>
      </span>

      {!isInSidebar && (
        <span>
          <Link href="/working" className="anchor"  onClick={() => handleNavigation(true)}>
            <FaComments size={20} />
            <p>Community</p>
          </Link>
        </span>
      )}
    </div>
  );
}
