"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaBars, FaAngleRight } from "react-icons/fa";
import Actions from "./Actions";
import SocialLinks from "./SocialLinks";
import logo from "../../../public/logo.png";
import Image from "next/image";
import useAnime from "@/hooks/useAnime";
import "./navbar.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NavBar(props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchForm, setSearchForm] = useState({ name: "" });
  const [userData, setUserData] = useState(null);
  const [floatSearchIsVisible, setFloatSearchIsVisible] = useState(false);
  const [data, setData] = useState([]);
  const localStorageWrapper = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      return {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
        clear: () => localStorage.clear(),
      };
    } else {
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
      };
    }
  };
  const ls = localStorageWrapper();

  const { getSuggestSearch } = useAnime();
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fetchSuggestions = async () => {
    if (searchForm.name) {
      const results = await getSuggestSearch(searchForm.name);
      setData(results);
    }
  };

  useEffect(() => {
    const storedUser = ls.getItem("user-animoon");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser.user);
    }
  }, [session]);

  useEffect(() => {
    fetchSuggestions();
  }, [searchForm.name]);

  useEffect(() => {
    if (session?.user?.randomImage) {
      ls.setItem("user-animoon", JSON.stringify(session));
    }
  }, [session]);

  const handleInputChange = (e) => {
    setSearchForm({ ...searchForm, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    if (searchForm.name) {
      router.push(`/search?name=${searchForm.name}`);
      setSearchForm({ name: "" });
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter" && searchForm.name) handleSearch();
  };

  const toggleProfile = () => props.setProfiIsOpen(true);
  const toggleSidebar = () => props.setSidebarIsOpen(true);
  const toggleLogin = () => props.setLogIsOpen(true);
  const toggleFloatSearch = () => setFloatSearchIsVisible((prev) => !prev);

  return (
    <>
      <nav
        className={`navigation-bar a-center d-flex ${
          props.isScrolled ? "dark" : "transparent"
        } trans-03`}
      >
        <div className="menu-group a-center d-flex">
          <FaBars
            size={20}
            className="burger-icon trans-05"
            onClick={toggleSidebar}
          />
          <div className="logo-wrapper a-center d-flex">
            <Link href="/" passHref onClick={() => props.IsLoading(true)}>
              <div style={{ width: "auto", height: "40px" }}>
                <Image
                  width={0}
                  height={0}
                  sizes="3%"
                  style={{ width: "auto" }}
                  src={logo}
                  className="logo"
                  alt="logo"
                />
              </div>
            </Link>
          </div>
        </div>

        <div className="search-all">
          <div className="search-wrapper">
            <input
              type="text"
              className="search-text f-poppins trans-03"
              placeholder="Search anime..."
              name="name"
              value={searchForm.name}
              onChange={handleInputChange}
              onKeyDown={handleEnterPress}
              style={
                props.isScrolled
                  ? {
                      backgroundColor: "var(--grey-dark)",
                      color: "var(--theme)",
                    }
                  : { backgroundColor: "white", color: "black" }
              }
            />
            <FaSearch
              onClick={handleSearch}
              className="search-icon search-icons trans-03"
              size={20}
              style={{ color: props.isScrolled ? "var(--theme)" : "black" }}
            />
          </div>

          {searchForm.name && data.length > 0 && (
            <div className="raam-one flex flex-col gap-2">
              {data.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/${anime.id}`}
                  passHref
                  onClick={() => props.IsLoading(true)}
                >
                  <div
                    onClick={() => setSearchForm({ name: "" })}
                    className="suggestion-item flex gap-2"
                  >
                    <img
                      width={50}
                      src={anime.coverImage.large}
                      alt={anime.title.romaji}
                    />
                    <div>
                      <div className="goi">
                        {anime.title.english && anime.title.english.length < 30
                          ? anime.title.english
                          : anime.title.romaji && anime.title.romaji.length < 30
                          ? anime.title.romaji
                          : `${anime.title.romaji?.slice(0, 30)}...`}
                      </div>
                      <div className="uoi">
                        {anime.title.romaji.length < 30
                          ? anime.title.romaji
                          : `${anime.title.romaji.slice(0, 30)}...`}
                      </div>
                      <div className="flex gap-1 items-center">
                        <div className="uoi">{`${anime.startDate.day} ${
                          month[anime.startDate.month - 1]
                        }, ${anime.startDate.year}`}</div>
                        <div className="dotol">&#x2022;</div>
                        <div className="doi">{anime.format}</div>
                        <div className="dotol">&#x2022;</div>
                        <div className="uoi">{`${anime.duration}m`}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                href={`/search?name=${searchForm.name}`}
                passHref
                onClick={() => props.IsLoading(true)}
              >
                <div
                  className="vire flex items-center gap-2"
                  onClick={() => setSearchForm({ name: "" })}
                >
                  View All Results <FaAngleRight />
                </div>
              </Link>
            </div>
          )}
        </div>

        <SocialLinks />
        <Actions isInSidebar={false} IsLoading={props.IsLoading} />

        <div className="righty">
          <div className="user-profile-nots a-center j-center d-flex trans-c-03">
            <div className="floating">
              <FaSearch onClick={toggleFloatSearch} />
            </div>
          </div>
          {session ? (
            <img
              src={
                session.user.randomImage
                || userData?.randomImage
              }
              className="profile-ico"
              onClick={toggleProfile}
              alt={
                session.user.username || userData?.username ||
                "user"
              }
            />
          ) : (
            <div onClick={toggleLogin}>
              <div className="Lognn">LogIn</div>
            </div>
          )}
        </div>
      </nav>

      {floatSearchIsVisible && (
        <div className="floating-search-wrapper">
          <input
            type="text"
            className="search-text f-poppins"
            placeholder="Search anime..."
            name="name"
            value={searchForm.name}
            onChange={handleInputChange}
            onKeyDown={handleEnterPress}
          />
          <FaSearch
            onClick={handleSearch}
            className="search-icon search-icons"
            size={20}
            color="black"
          />
          {searchForm.name && data.length > 0 && (
            <div className="raam-one flex flex-col gap-2">
              {data.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/${anime.id}`}
                  passHref
                  onClick={() => props.IsLoading(true)}
                >
                  <div
                    onClick={() => setSearchForm({ name: "" })}
                    className="suggestion-item flex gap-2"
                  >
                    <img
                      width={50}
                      src={anime.coverImage.large}
                      alt={anime.title.romaji}
                    />
                    <div>
                      <div className="goi">
                        {anime.title.english && anime.title.english.length < 30
                          ? anime.title.english
                          : anime.title.romaji && anime.title.romaji.length < 30
                          ? anime.title.romaji
                          : `${anime.title.romaji?.slice(0, 30)}...`}
                      </div>
                      <div className="uoi">
                        {anime.title.romaji.length < 30
                          ? anime.title.romaji
                          : `${anime.title.romaji.slice(0, 30)}...`}
                      </div>
                      <div className="flex gap-1 items-center">
                        <div className="uoi">{`${anime.startDate.day} ${
                          month[anime.startDate.month - 1]
                        }, ${anime.startDate.year}`}</div>
                        <div className="dotol">&#x2022;</div>
                        <div className="doi">{anime.format}</div>
                        <div className="dotol">&#x2022;</div>
                        <div className="uoi">{`${anime.duration}m`}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                href={`/search?name=${searchForm.name}`}
                passHref
                onClick={() => props.IsLoading(true)}
              >
                <div
                  className="vire flex items-center gap-2"
                  onClick={() => setSearchForm({ name: "" })}
                >
                  View All Results <FaAngleRight />
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
