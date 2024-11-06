"use client"
import React from "react";
import { FaChevronLeft, FaComments } from "react-icons/fa";
import Link from "next/link";
import "./nav-sidebar.css";
import Actions from "../Navbar/Actions";
export default function NavSidebar(props) {
  return (
    <div
      className="navigation-sidebar f-poppins"
      style={{ zIndex: props.sidebarIsOpen ? 100 : -1 }}
      onClick={() => props.setSidebarIsOpen(false)}
    >
      <div
        className="navigation-list d-flex"
        style={{
          transform: props.sidebarIsOpen
            ? "translateX(250px)"
            : "translateX(-250px)",
        }}
      >
        <div className="button-group d-flex-fd-column">
          <div
            className="d-flex a-center j-center close-menu"
            style={{ width: "60%" }}
            onClick={() => props.setSidebarIsOpen(false)}
          >
            <FaChevronLeft size={12} />
            Close Menu
          </div>
          <Actions isInSidebar={true} />
          <a href="/" className="d-flex a-center j-center">
            <FaComments size={14} />
            Community
          </a>
        </div>

        <div className="navigation-link-list">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/grid?name=most-popular&heading=Most Popular">
                Most Popular
              </Link>
            </li>
            <li>
              <Link href="/grid?name=movie&heading=Movies">Movies</Link>
            </li>
            <li>
              <Link href="/grid?name=tv&heading=TV Series">TV Series</Link>
            </li>
            <li>
              <Link href="/grid?name=ova&heading=OVAs">OVAs</Link>
            </li>
            <li>
              <Link href="/grid?name=ona&heading=ONAs">ONAs</Link>
            </li>
            <li>
              <Link href="/grid?name=special&heading=Specials">Specials</Link>
              <Link href="/grid?name=completed&heading=Completed">
                Completed
              </Link>
              <Link href="/grid?name=dubbed-anime&heading=Dubbed Anime">
                Dubbed Anime
              </Link>
              <Link href="/grid?name=subbed-anime&heading=Subbed Anime">
                Subbed Anime
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
