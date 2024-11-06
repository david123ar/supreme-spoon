"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaStar, FaPlayCircle, FaChevronRight } from "react-icons/fa";
import LoadingSpinner from "@/components/loadingSpinner";
import Link from "next/link";
import { FaEye, FaHeart, FaMedal } from "react-icons/fa";
import "./mouse-over-card.css";

export default function MouseOverCard(props) {
  const [hoverAnime, setHoverAnime] = useState(props.data);

  const genre = props.data?.genres?.map((genre, idx) => (
    <Link className="genreo-button" key={idx} href={`/${genre}`}>
      {genre}
    </Link>
  ));

  const removeHtmlTags = (str) => {
    return str.replace(/<[^>]*>/g, ""); // Remove HTML tags
  };

  return (
    <div className="mouse-over-card-wrapper d-flex-fd-column">
      {!props.data ? (
        <LoadingSpinner />
      ) : (
        <>
          <h1 className="greatN">
            {props.data.title.english || props.data.title.romaji}
          </h1>
          <div className="d-flex anime-st">
            <span className="d-flex a-center j-center">
              <FaStar color="yellow" />
              {(props.data.averageScore/ 10).toFixed(1) || "?"}
            </span>
            <div className="anime-statistics-tiles-wrapper d-flex a-center">
              <span className="anime-statistics-tile d-flex a-center j-center">
                {/* {props.data.info.stats?.rating?.length > 6
                  ? props.data.info.stats.rating.slice(0, 6)
                  : props.data.info.stats.rating || "?"} */}
              </span>
              <span className="anime-statistics-tile medal-tile d-flex a-center j-center">
                <FaMedal /> {" "}
                {props.data.rankings && props.data.rankings.length > 0
                  ? props.data.rankings[0].rank
                  : "NA"}
              </span>
              <span className="anime-statistics-tile dil-tile d-flex a-center j-center">
                <FaHeart /> {props.data.favourites}
              </span>
              <span className="anime-statistics-tile eye-tile d-flex a-center j-center">
                <FaEye /> {"NA"}
              </span>
              <span className="anime-statistics-tile qual-tile d-flex a-center j-center">
                {"HD"}
              </span>
            </div>
            <span className="typop">{props.data.format || "?"}</span>
          </div>
          <p style={{ marginBottom: 0 }} className="description">
            <span className="ligty">
              {props.data.description
                ? props.data.description.length > 90
                  ? removeHtmlTags(props.data.description.slice(0, 90)) + "..."
                  : removeHtmlTags(props.data.description)
                : "?"}
            </span>
          </p>
          <div
            style={{ marginBottom: 0, paddingBottom: "10px" }}
            className="details-header-statistics"
          >
            <p>
              <b>Japanese: </b>{" "}
              <span className="ligt">
                {props.data.title.native
                  ? props.data.title.native.length > 20
                    ? props.data.title.native.slice(0, 20) + "..."
                    : props.data.title.native
                  : "?"}
              </span>
            </p>
            <p>
              <b>Aired: </b>
              <span className="ligt">
                {props.data.startDate?.day +
                  "-" +
                  props.data.startDate?.month +
                  "-" +
                  props.data.startDate?.year || "?"}
              </span>
            </p>
            <p>
              <b>Status:</b>{" "}
              <span className="ligt">{props.data.status || "?"}</span>
            </p>
          </div>
          <div className="anime-st-genreo"></div>
          <div className="anime-st-genre">
            <div className="anime-st-genrep">
              <div>Genre: </div>
              <div className="Jonty">{genre}</div>
            </div>
          </div>
          <div className="anime-st-genreo"></div>
          <div className="tits-btn">
            <Link href={`/watch/${props.data.id}`} className="tit-bt-w"><FaPlayCircle size={15} /> Watch Now</Link>
            <Link href={`/${props.data.id}`} className="tit-bt-d">Details <FaChevronRight size={12} /></Link>
          </div>
        </>
      )}
    </div>
  );
}
