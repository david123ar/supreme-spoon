"use client";
import React, { useState } from "react";
import NavBar from "@/components/Navbar/Navbar";
import NavSidebar from "@/components/NavigationSidebar/NavSidebar";
import Advertize from "@/components/Advertize/Advertize";
import { usePathname, useParams } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Profilo from "@/components/Profilo/Profilo";
import LoadingSpinner from "@/components/loadingSpinner";
import SignInSignUpModal from "@/components/SignSignup/SignInSignUpModal";
import { SessionProvider } from "next-auth/react";

export default function Nav({ children, session }) {
  const params = useParams(); // Fetch the dynamic params
  const pathname = usePathname(); // Get the current URL path
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [profiIsOpen, setProfiIsOpen] = useState(false);
  const [logIsOpen, setLogIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to control loading state
  const IsLoading = (data) => {
    if (data) {
      if (data === "true-random") {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 10000); // Delay for 10 seconds
      } else {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000); // Delay for 2 seconds
      }
    }
  };

  return (
    <SessionProvider session={session}>
      <div className="app-container f-poppins">
        {/* Conditionally render NavBar only if not on the homepage */}
        {pathname !== "/" && (
          <NavBar
            isScrolled={isScrolled}
            sidebarIsOpen={sidebarIsOpen}
            setSidebarIsOpen={setSidebarIsOpen}
            setProfiIsOpen={setProfiIsOpen}
            profiIsOpen={profiIsOpen}
            IsLoading={IsLoading}
            setLogIsOpen={setLogIsOpen}
            logIsOpen={logIsOpen}
            session={session}
          />
        )}
        <Profilo
          setProfiIsOpen={setProfiIsOpen}
          profiIsOpen={profiIsOpen}
          IsLoading={IsLoading}
        />
        <NavSidebar
          sidebarIsOpen={sidebarIsOpen}
          setSidebarIsOpen={setSidebarIsOpen}
          IsLoading={IsLoading}
        />
        <Advertize />
        <SignInSignUpModal setLogIsOpen={setLogIsOpen} logIsOpen={logIsOpen} />
        {isLoading ? <LoadingSpinner /> : children}
        <Footer IsLoading={IsLoading} />
      </div>
    </SessionProvider>
  );
}
