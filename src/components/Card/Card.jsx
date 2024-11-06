"use client";
import React, { useEffect, useState } from "react";
import "./card.css";
import Link from "next/link";
import MouseOverCard from "./MouseOverCard";
import { FaClosedCaptioning, FaPlayCircle } from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import Image from "next/image";

export default function Card({
  data,
  collectionName,
  IsLoading,
  keepIt,
  itsMe,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { id, name, poster, rating, episodes, duration, Secds, epNo } =
    data || {};
  const totalSeconds = duration || 0;
  const totalSecondsTimo = Secds || 0;

  const formatTime = (total) => {
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const percentage = totalSecondsTimo
    ? (totalSecondsTimo / totalSeconds) * 100
    : 0;

  const handleNavigation = () => {
    IsLoading(true);
  };

  return (
    <div
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      className="anime-card-wrapper"
    >
      <Link
        href={`${
          collectionName !== "Top Upcoming" ? `/watch/${id}` : `/${id}`
        }`}
        prefetch
        onClick={handleNavigation}
        className="anime-card d-flex"
      >
        <div className="anime-card-img-wrapper">
          {screenWidth > 1150 && isHovered && (
            <div className="img-blur d-flex a-center j-center">
              <FaPlayCircle color="white" size={70} />
            </div>
          )}
          {data?.isAdult && (
            <span className="rating">
              {data.isAdult === "R" ? "18+" : data.isAdult}
            </span>
          )}
          <div className="tick-item">
            <span
              className={`episode-count ${episodes?.dub > 0 ? "borO" : "borR"}`}
            >
              <FaClosedCaptioning size={14} />{" "}
              {data?.nextAiringEpisode
                ? data.nextAiringEpisode.episode - 1
                : data?.episodes || "?"}
            </span>
            {episodes?.dub > 0 && (
              <span className="episode-count-dub d-flex a-center j-center">
                <AiFillAudio size={14} /> {episodes?.dub || "?"}
              </span>
            )}
          </div>
          <img
            src={data?.coverImage.large}
            alt="anime-card"
            className="anime-card-img"
          />
        </div>
        <div className="card-details">
          <span className="card-title">
            {data?.title.english?.length > 15
              ? `${data?.title.english.slice(0, 15)}...`
              : data?.title.english || data?.title.romaji?.length > 15
              ? `${data?.title.romaji.slice(0, 15)}...`
              : data?.title.romaji}
          </span>
          {keepIt ? (
            <div className="card-statK">
              <div className="timoInfo">
                <div className="epnt">
                  <div>EP</div>
                  <div>{epNo}</div>
                </div>
                <div className="durnt">
                  <div className="durntS">{formatTime(totalSecondsTimo)}</div>
                  <div className="durntM">/</div>
                  <div className="durntL">{formatTime(totalSeconds)}</div>
                </div>
              </div>
              <div className="scaling">
                <div
                  className="inlino"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="card-statistics">
              <span>
                {data?.duration?.length > 7
                  ? data?.duration.slice(0, 7)
                  : data?.duration + "m" || "23m"}
              </span>
              <div className="dot"></div>
              <span>{data?.format || "TV"}</span>
            </div>
          )}
        </div>
      </Link>
      {screenWidth > 1150 && isHovered && data && <MouseOverCard data={data} />}
    </div>
  );
}
