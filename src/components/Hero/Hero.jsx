"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ImFire } from "react-icons/im";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import {
  FaCalendar,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaPlayCircle,
  FaClosedCaptioning,
} from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import "./hero.css";

export default function Hero({ trendingAnime }) {
  const [localStorageData, setLocalStorageData] = useState({});

  useEffect(() => {
    // Retrieve all relevant localStorage data
    const storageData = {};
    trendingAnime?.forEach((anime) => {
      storageData[anime.id] = localStorage.getItem(`Rewo-${anime.id}`);
    });
    setLocalStorageData(storageData);
  }, [trendingAnime]);

  const removeHtmlTags = (str) => {
    return str.replace(/<[^>]*>/g, ""); // Remove HTML tags
  };

  const getOrdinalSuffix = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = number % 100;

    return (
      suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]
    );
  };

  const heroSlide =
    trendingAnime &&
    trendingAnime.map((anime, idx) => {
      const storedId = localStorageData[anime.id];
      const title = anime.title.english || anime.title.romaji || "Untitled";
      const description =
        anime.description?.slice(0, 160) + "..." || "No description available";

      return (
        <SwiperSlide key={anime.id}>
          <div className={`carousel-item after:top-0 after:right-0`}>
            <div className="anime-info">
              <div className="anime-info-content">
                <span className="rank">
                  <ImFire /> {idx + 1}
                  {getOrdinalSuffix(idx + 1)} on Spotlight
                </span>

                <h1 className="anime-title">
                  {title.length < 58 ? title : title.slice(0, 58) + "..."}
                </h1>
                <p className="description">{removeHtmlTags(description)}</p>
                <div className="anime-statistics">
                  {anime.genres.map((genre, index) => (
                    <span key={index} className="anime-st-item genre-item">
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="button-wrapper">
                  <Link
                    href={
                      storedId ? `/watch/${storedId}` : `/watch/${anime.id}`
                    }
                    className="btn-primary hero-button"
                  >
                    <FaPlayCircle size={15} /> Watch Now
                  </Link>
                  <Link
                    href={`/${anime.id}`}
                    className="btn-secondary hero-button"
                  >
                    Details <FaChevronRight size={12} />
                  </Link>
                </div>
              </div>
              <div className="posterImg">
                <img src={anime.coverImage.large} alt={anime.title} />
              </div>
            </div>
            <img className="carousel-img previ" src={anime.bannerImage || anime.coverImage.large} alt={title} />
            <img className="carousel-img afteri" src={anime.coverImage.large} alt={title} />
          </div>
        </SwiperSlide>
      );
    });

  return (
    <div className="carousel slide" style={{ position: "relative" }}>
      <Swiper
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        direction="horizontal"
        loop={true}
        autoplay={true}
        modules={[Pagination, Navigation, Autoplay]}
        navigation={{
          nextEl: ".carousel-control-next",
          prevEl: ".carousel-control-prev",
        }}
        className="carousel slide"
      >
        {heroSlide}
      </Swiper>
      <div className="carousel-controls-wrapper">
        <button
          className="carousel-controls carousel-control-next trans-03"
          type="button"
        >
          <FaChevronRight size={15} />
        </button>
        <button
          className="carousel-controls carousel-control-prev trans-03"
          type="button"
        >
          <FaChevronLeft size={15} />
        </button>
      </div>
    </div>
  );
}
