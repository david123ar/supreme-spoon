"use client";
import React, { useEffect, useState, useRef } from "react";
import "./AnimeInfo.css";
import Link from "next/link";
import {
  FaClosedCaptioning,
  FaPlay,
  FaPlayCircle,
  FaPlus,
  FaStar,
} from "react-icons/fa";
import Share from "@/components/Share/Share";
import { AiFillAudio } from "react-icons/ai";

export default function Details(props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const localStorageWrapper = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      return {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
        clear: () => localStorage.clear(),
      };
    } else {
      // Handle the case when localStorage is not available
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
      };
    }
  };

  // Usage
  const ls = localStorageWrapper();

  const handleNavigation = () => {
    props.IsLoading(true);
  };

  const handleOptionClick = (option) => {
    console.log(`Selected option: ${option}`);
    setIsOpen(false);

    const newObj = {
      id: props.animeData.id,
      poster: props.animeData.coverImage.large,
      duration: props.animeData.duration,
      episodes: {
        sub: props.animeData.episodes,
      },
      name: props.animeData.title.english
        ? props.animeData.title.english
        : props.animeData.title.romaji,
      timestamp: new Date().toISOString(),
    };

    const options = [
      "Watching",
      "On-Hold",
      "Plan to Watch",
      "Dropped",
      "Completed",
    ];

    options.forEach((opt) => {
      const key = `animeData_${opt}`;
      let data = JSON.parse(localStorage.getItem(key)) || [];
      data = data.filter((item) => item.id !== newObj.id);
      localStorage.setItem(key, JSON.stringify(data));
    });

    const currentKey = `animeData_${option}`;
    let currentData = JSON.parse(localStorage.getItem(currentKey)) || [];

    const index = currentData.findIndex((item) => item.id === newObj.id);

    if (index !== -1) {
      currentData[index] = newObj;
    } else {
      currentData.push(newObj);
    }

    localStorage.setItem(currentKey, JSON.stringify(currentData));
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const animeData = props.animeData;

  const [descIsCollapsed, setDescIsCollapsed] = useState(true);
  const genre = animeData?.genres?.map((genre) => {
    return (
      <Link
        className="genre-button"
        key={genre}
        href={`/genre?id=${genre}&name=${genre}`}
        onClick={handleNavigation}
      >
        {genre}
      </Link>
    );
  });

  const producers = animeData?.studios?.edges?.map((studio) => {
    return (
      <Link
        key={studio.node.id}
        href={`/studio?name=${studio.node.name}`}
        onClick={handleNavigation}
      >
        {studio.node.name + ", "}
      </Link>
    );
  });

  const removeHtmlTags = (str) => {
    return str.replace(/<[^>]*>/g, ""); // Remove HTML tags
  };

  const synonyms = animeData?.synonyms?.join(", ") || "N/A";

  return (
    <div className="details-container">
      <div className="details-header">
        <div className="details-header-primary">
          <img
            className="details-container-background"
            src={animeData?.coverImage.large}
            alt={animeData?.title.romaji}
          />
          <div className="anime-details d-flex">
            <img
              className="anime-details-poster"
              src={animeData?.coverImage.large}
              alt={animeData?.title.romaji}
            />

            <div className="anime-details-content d-flex-fd-column">
              <div className="flex gap-1 items-center specif">
                <Link href={"/"} onClick={handleNavigation}>
                  <div className="homo">Home</div>
                </Link>
                <div className="dotoi">&#x2022;</div>
                <div className="homo">{animeData?.format}</div>
                <div className="doto">&#x2022;</div>
                <div className="namo">
                  {animeData?.title.english || animeData?.title.romaji}
                </div>
              </div>
              <h1 className="title-large">
                {animeData?.title.english || animeData?.title.romaji}
              </h1>

              <div className="flex gap-1 items-center">
                <div className="flex gap-1">
                  <div className="rat flex items-center gap-1">
                    <FaStar color="black" />
                    {(animeData.averageScore / 10).toFixed(1) || "N/A"}
                  </div>
                  <div className="qual">{"HD" || "Unknown"}</div>
                  <div className="subE">
                    <FaClosedCaptioning size={14} />{" "}
                    {animeData?.episodes || "Unknown"}
                  </div>
                  {/* {animeData.hasDub && (
                    <div className="dubE">
                      <AiFillAudio size={14} /> Dubbed
                    </div>
                  )} */}
                </div>
                <div className="dotoi">&#x2022;</div>
                <div className="typo">{animeData?.format}</div>
                <div className="doto">&#x2022;</div>
                <div className="duran">
                  {animeData?.duration + "m" || "Unknown"}
                </div>
              </div>
              <div className="button-wrapper">
                <Link
                  href={`${
                    ls.getItem(`Rewo-${animeData?.id}`)
                      ? `/watch/${ls.getItem(`Rewo-${animeData?.id}`)}`
                      : `/watch/${animeData?.id}`
                  }`}
                  className="btn-primary hero-button"
                  onClick={handleNavigation}
                >
                  <FaPlay size={12} /> Watch Now
                </Link>
                <div className="dropdown-container" ref={dropdownRef}>
                  <button
                    className="btn-secondary hero-button"
                    onClick={toggleDropdown}
                  >
                    {props.rand ? "Details" : "Add to List"}
                    <FaPlus size={12} />
                  </button>
                  {isOpen && (
                    <ul className="dropdown-menu">
                      {[
                        "Watching",
                        "On-Hold",
                        "Plan to Watch",
                        "Dropped",
                        "Completed",
                      ].map((option) => (
                        <li
                          key={option}
                          onClick={() => handleOptionClick(option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <p>
                {descIsCollapsed
                  ? removeHtmlTags(animeData?.description?.slice(0, 350)) +
                    "..."
                  : removeHtmlTags(animeData?.description)}
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setDescIsCollapsed((prev) => !prev)}
                >
                  [ {descIsCollapsed ? "More" : "Less"} ]
                </span>
              </p>
              <p>
                Animoon is the best site to watch {animeData?.title.romaji} SUB
                online, or you can even watch {animeData?.title.romaji} DUB in
                HD quality.You can also find{" "}
                {animeData?.studios.edges
                  .map((studio) => studio.node.name)
                  .join(", ")}{" "}
                anime on Animoon.
              </p>
              <Share
                style={{ padding: 0, margin: 0 }}
                ShareUrl={props.ShareUrl}
                arise={props.arise}
              />
            </div>
          </div>
        </div>

        <div className="details-header-secondary">
          <div className="details-header-statistics">
            <p>
              <b>Japanese:</b> {animeData?.title.native}
            </p>
            <p>
              <b>Synonyms:</b> {synonyms}
            </p>
            <p>
              <b>Aired:</b> {animeData?.startDate.year || "?"}
            </p>
            <p>
              <b>Duration:</b> {animeData?.duration || "NA"} min/ep
            </p>
            <p>
              <b>Score:</b> {animeData?.averageScore || "N/A"}
            </p>
            <p>
              <b>Status:</b> {animeData?.status}
            </p>
            <p>
              <b>Premiered:</b> {animeData?.season || "Unknown"}{" "}
              {animeData?.startDate.year}
            </p>
          </div>
          <div className="details-header-genre">
            <p>
              <b>Genres: </b>
              {genre}
            </p>
          </div>
          <p>
              <b>Studio: </b>
              {animeData.studios.edges
                .filter((studio) => studio.isMain) // Filter for the main studio
                .map((studio) => studio.node.name) // Extract the main studio's name
                .join(", ")}{" "}
            </p>
            <p>
              <b>Producers: </b>
              {producers}
            </p>
        </div>
      </div>
    </div>
  );
}
