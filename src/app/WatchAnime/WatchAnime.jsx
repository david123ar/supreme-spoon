"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import "./watch-anime.css";
import RecommendedTopTen from "@/layouts/RecommendedTopTen";
import Share from "@/components/Share/Share";
import Link from "next/link";
import { AiFillAudio } from "react-icons/ai";
import loading from "../../../public/placeholder.gif";
import {
  FaBackward,
  FaClosedCaptioning,
  FaForward,
  FaPlus,
} from "react-icons/fa";
import Comments from "@/components/Comments/Comments";
import { HiOutlineSignal } from "react-icons/hi2";
import ArtPlayer from "@/components/Artplayer";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loadingSpinner";
import Image from "next/image";
export default function WatchAnime(props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const IsLoading = (data) => {
    if (data) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, [20000]);
    }
  };
  const handleNavigation = () => {
    IsLoading(true);
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

  const [clickedId, setClickedId] = useState(props.epId);
  const [serverName, setServerName] = useState("GogoCdn");
  const [descIsCollapsed, setDescIsCollapsed] = useState(true);
  // const [quality, setQuality] = useState("");
  const [subIsSelected, setSubIsSelected] = useState(
    props.gogoDub && props.gogoDub?.sources
      ? ls.getItem("subordub") === "true"
      : true
  );
  const [quality, setQuality] = useState(() => {
    // Determine whether to use sub or dub based on subIsSelected
    // const isSubSelected = ls.getItem("subordub") === "true"; // 'true' means Sub is selected
    // const selectedSources = isSubSelected ? props.gogoSub : props.gogoDub;

    // Check if the selected source (sub or dub) has any sources available
    if (subIsSelected) {
      return (
        props.gogoSub.sources
      );
    } else {
      return (
        props.gogoDub.sources
      );
    }

    // Default to an empty string if no sources are available
    // return "";
  });

  const [selectedServer, setSelectedServer] = useState(0);

  const [bhaiLink, setBhaiLink] = useState(() => {
    // Determine whether to use sub or dub based on subIsSelected
    const isSubSelected = ls.getItem("subordub") === "true"; // 'true' means Sub is selected
    // const selectedSources = isSubSelected ? props.gogoSub : props.gogoDub;

    // Check if the selected source (sub or dub) has any sources available
    if (isSubSelected) {
      return (
        props.gogoSub.sources.find((source) =>
          ["1080p", "720p", "480p", "360p", "backup"].includes(source.quality)
        )?.url || ""
      );
    } else {
      return (
        props.gogoDub.sources.find((source) =>
          ["1080p", "720p", "480p", "360p", "backup"].includes(source.quality)
        )?.url || ""
      );
    }

    // Default to an empty string if no sources are available
    // return "";
  });

  const [introd, setIntrod] = useState("");
  const [outrod, setOutrod] = useState("");
  const [subtitles, setSubtitles] = useState("");
  const [onn1, setOnn1] = useState(
    ls.getItem("Onn1") ? ls.getItem("Onn1") : "Off"
  );
  const [onn2, setOnn2] = useState(
    ls.getItem("Onn2") ? ls.getItem("Onn2") : "Off"
  );
  const [onn3, setOnn3] = useState(
    ls.getItem("Onn3") ? ls.getItem("Onn3") : "Off"
  );
  ls.setItem(`Rewo-${props.anId}`, props.epId);

  let epiod = props.epiod;

  const handleOn1 = () => {
    if (onn1 === "Off") {
      ls.setItem("Onn1", "On");
      ls.setItem("autoPlay", "true");
      setOnn1("On");
    }
    if (onn1 === "On") {
      ls.setItem("Onn1", "Off");
      ls.setItem("autoPlay", "false");
      setOnn1("Off");
    }
  };

  const handleOn2 = () => {
    if (onn2 === "Off") {
      ls.setItem("Onn2", "On");
      ls.setItem("autoNext", "true");
      setOnn2("On");
    }
    if (onn2 === "On") {
      ls.setItem("Onn2", "Off");
      ls.setItem("autoNext", "false");
      setOnn2("Off");
    }
  };

  ls.setItem(`Epnum-${props.anId}`, epiod.toString());

  const getData = (data) => {
    if (data) {
      if (epiod < props.data.episodes.length) {
        setEpNumb(props.data.episodes[epiod].number);
        router.push(`/watch/${props.data.episodes[epiod].episodeId}`);
        setClickedId(props.data.episodes[epiod].episodeId);
      }
    }
  };

  const handleOn3 = () => {
    if (onn3 === "Off") {
      ls.setItem("Onn3", "On");
      ls.setItem("autoSkipIntro", "true");
      setOnn3("On");
    }
    if (onn3 === "On") {
      ls.setItem("Onn3", "Off");
      ls.setItem("autoSkipIntro", "false");
      setOnn3("Off");
    }
  };
  const sub = subIsSelected ? "sub" : "dub";

  /**
   * Based on the inforamtion from useAnimeInfo hook, the episodes array is stored in a variable
   * with 'id' of each episode
   */

  if (ls.getItem(`Watched-${props.anId.toString()}`)) {
    // split the existing values into an array
    let vals = localStorage
      .getItem(`Watched-${props.anId.toString()}`)
      .split(",");

    // if the value has not already been added
    if (!vals.includes(props.epId.toString())) {
      // add the value to the array
      vals.push(props.epId).toString();

      // sort the array

      // join the values into a delimeted string and store it
      ls.setItem(`Watched-${props.anId.toString()}`, vals.join(","));
    }
  } else {
    // the key doesn't exist yet, add it and the new value
    ls.setItem(`Watched-${props.anId.toString()}`, props.epId.toString());
  }

  const episodeList = (() => {
    // If "sub" is selected, use episodes from gogoPSub
    if (subIsSelected) {
      return props.gogoPSub?.episodes?.length > 0
        ? props.gogoPSub.episodes
        : null;
    }

    // If "dub" episodes are available in stats, return episodes from gogoPDub
    return props.gogoPDub?.episodes?.length > 0
      ? props.gogoPDub?.episodes
      : null;
  })();

  const [epNumb, setEpNumb] = useState(epiod);
  const backward = () => {
    router.push(`/watch/${props.data.episodes[epiod - 2]?.episodeId}`);
    setEpNumb(props.data.episodes[epiod - 2].number);
  };
  const forward = () => {
    router.push(`/watch/${props.data.episodes[epiod]?.episodeId}`);
    setEpNumb(props.data.episodes[epiod].number);
  };

  ls.setItem("subordub", subIsSelected ? "true" : "false");

  const episodeButtons = episodeList?.map((el, idx) => {
    return (
      <Link
        href={`/watch/${props.anId}?ep=${el.id}`}
        className={`${
          episodeList.length <= 24 ? "episode-tile" : `episode-tile-blocks`
        } ${idx === epiod - 1 ? "selected" : ""} ${
          episodeList.length <= 24
            ? episodeList.length % 2 === 0
              ? idx % 2 === 0
                ? ""
                : "evenL"
              : idx % 2 === 0
              ? "evenL"
              : ""
            : `${el.isFiller ? "fillero" : "evenL"}`
        } ${
          ls.getItem(`Watched-${props.anId.toString()}`)
            ? localStorage
                .getItem(`Watched-${props.anId.toString()}`)
                .split(",")
                .includes(el.id)
              ? "idk"
              : "common"
            : "common"
        }`}
        key={el.id}
        style={
          episodeList.length <= 24
            ? { minWidth: "100%", borderRadius: 0 }
            : null
        }
        onClick={() => setEpNumb(el.number) & setClickedId(el.id)}
      >
        <div>
          {episodeList.length <= 24 ? (
            <div className="eptile">
              {" "}
              <div className="epnumb">{el.number}</div>{" "}
              <div className="eptit">
                {props.episodes.find((ile) => el.number === ile.mal_id)
                  ? props.episodes.find((ile) => el.number === ile.mal_id)
                      ?.title.length < 20
                    ? props.episodes.find((ile) => el.number === ile.mal_id)
                        ?.title
                    : props.episodes
                        .find((ile) => el.number === ile.mal_id)
                        ?.title.slice(0, 20) + "..."
                  : `Episode of ${
                      props.datao?.title.english?.slice(0, 10) ||
                      props.datao?.title.romaji?.slice(0, 10)
                    }`}
              </div>
            </div>
          ) : (
            el.number
          )}
        </div>
      </Link>
    );
  });

  const err = (data) => {
    if (data) {
      if (serverName === "Vidstreaming") {
        const foundLink = props.dataj.results.streamingInfo.find((info) => {
          const isSubOrRaw =
            info.value.decryptionResult?.type === "sub" ||
            info.value.decryptionResult?.type === "raw";
          const isServerHD2 = info.value.decryptionResult.server === "Vidcloud";

          if (subIsSelected) {
            return isSubOrRaw && isServerHD2;
          } else {
            return info.value.decryptionResult?.type === "dub" && isServerHD2;
          }
        });

        setBhaiLink(foundLink?.value.decryptionResult.source.sources[0].file);
        setSelectedServer(1);
        setServerName("Vidcloud");
      }
    }
  };

  let trutie = clickedId === props.epId ? "yaso yaso" : "";
  useEffect(() => {
    if (trutie) {
      if (props.dataj) {
        setBhaiLink(
          subIsSelected
            ? props.dataj.results.streamingInfo.find(
                (info) =>
                  (info.value.decryptionResult?.type === "sub" ||
                    info.value.decryptionResult?.type === "raw") &&
                  info.value.decryptionResult.server === "Vidstreaming"
              )?.value.decryptionResult.source.sources[0].file
            : props.dataj.results.streamingInfo.find(
                (info) =>
                  info.value.decryptionResult?.type === "dub" &&
                  info.value.decryptionResult.server === "Vidstreaming"
              )?.value.decryptionResult.source.sources[0].file
        );
        setSubtitles(
          subIsSelected
            ? props.subPrio ||
                props.dataj.results.streamingInfo.find(
                  (info) =>
                    (info.value.decryptionResult?.type === "sub" ||
                      info.value.decryptionResult?.type === "raw") &&
                    info.value.decryptionResult.server === "Vidstreaming"
                )?.value.decryptionResult.source.tracks
            : ""
        );
        setIntrod(
          subIsSelected
            ? props.dataj.results.streamingInfo.find(
                (info) =>
                  (info.value.decryptionResult?.type === "sub" ||
                    info.value.decryptionResult?.type === "raw") &&
                  info.value.decryptionResult.server === "Vidstreaming"
              )?.value.decryptionResult.source.intro
            : props.dataj.results.streamingInfo.find(
                (info) =>
                  info.value.decryptionResult?.type === "dub" &&
                  info.value.decryptionResult.server === "Vidstreaming"
              )?.value.decryptionResult.source.intro
        );
        setOutrod(
          subIsSelected
            ? props.dataj.results.streamingInfo.find(
                (info) =>
                  (info.value.decryptionResult?.type === "sub" ||
                    info.value.decryptionResult?.type === "raw") &&
                  info.value.decryptionResult.server === "Vidstreaming"
              )?.value.decryptionResult.source.outro
            : props.dataj.results.streamingInfo.find(
                (info) =>
                  info.value.decryptionResult?.type === "dub" &&
                  info.value.decryptionResult.server === "Vidstreaming"
              )?.value.decryptionResult.source.outro
        );
      }
    }
  }, [trutie]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div style={{ marginTop: "65px" }} className="watch-container">
            <div className="flex gap-1 items-center pecif">
              <Link href={"/"} onClick={handleNavigation}>
                <div className="omo">Home</div>
              </Link>
              <div className="otoi">&#x2022;</div>
              <div className="omo">{props.datao?.anime?.info.stats.type}</div>
              <div className="oto">&#x2022;</div>
              <div className="amo">
                Watching {props.datao?.anime?.info?.name}
              </div>
            </div>
            <div className="d-flex new-con">
              <img
                className="watch-container-background"
                src={props.datao?.anime?.info?.poster}
                alt="pop"
              />
              <div className="media-center d-flex">
                <div
                  className={`${
                    episodeList?.length <= 24
                      ? "episode-container"
                      : "episode-container-blocks"
                  }`}
                >
                  <p>List of Episodes:</p>
                  <div
                    className={`${
                      episodeList?.length <= 24
                        ? "episode-tiles-wrapper"
                        : "episode-tiles-wrapper-blocks"
                    } d-flex a-center`}
                  >
                    {episodeButtons}
                  </div>
                </div>
                <div className="video-player">
                  <div className="hls-container">
                    {clickedId === props.epId ? (
                      <ArtPlayer
                        data={props.data}
                        epId={props.epId}
                        anId={props.anId}
                        epNumb={epNumb}
                        bhaiLink={bhaiLink}
                        trutie={trutie}
                        epNum={epiod}
                        selectedServer={selectedServer}
                        // gogoSub={props.gogoSub}
                        // gogoDub={props.gogoDub}
                        onn1={onn1}
                        onn2={onn2}
                        onn3={onn3}
                        getData={getData}
                        err={err}
                        subtitles={subtitles}
                        introd={introd}
                        outrod={outrod}
                        durEp={props.datao.duration}
                        subEp={props.gogoPSub?.episodes?.length}
                        dubEp={props.gogoPDub?.episodes?.length}
                        ratUra={props.datao.averageScore}
                        imgUra={props.datao.coverImage.large}
                        nameUra={
                          props?.datao?.title.english ||
                          props?.datao?.title.romaji
                        }
                        quality={
                          quality
                        }
                        sub={sub}
                        IsLoading={IsLoading}
                      />
                    ) : (
                      <div
                        className="d-flex a-center j-center"
                        style={{ height: "100%" }}
                      >
                        <Image
                          src={loading}
                          style={{
                            display: "block",
                            height: 100,
                            width: 100,
                            margin: "auto",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="server-container d-flex-fd-column">
                    <div className="server-tile-wrapper d-flex-fd-column">
                      <div className="flex items-center allum">
                        <div className="flex gap-x-3 flex-wrap">
                          <div className="flex gap-2">
                            <div className="autoo flex gap-1">
                              <span>Auto</span>
                              <span>Play</span>
                            </div>
                            <div
                              onClick={handleOn1}
                              className={`ress ${
                                onn1 === "On" ? "ressOn" : "ressOff"
                              }`}
                            >
                              {onn1}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="autoo flex gap-1">
                              <span>Auto</span>
                              <span>Next</span>
                            </div>
                            <div
                              onClick={handleOn2}
                              className={`ress ${
                                onn2 === "On" ? "ressOn" : "ressOff"
                              }`}
                            >
                              {onn2}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="autoo flex gap-1">
                              <span>Auto</span>
                              <span>Skip</span>
                              <span>OP/ED</span>
                            </div>
                            <div
                              onClick={handleOn3}
                              className={`ress ${
                                onn3 === "On" ? "ressOn" : "ressOff"
                              }`}
                            >
                              {onn3}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 items-center">
                          <Link
                            href={`/watch/${
                              props.gogoPSub.episodes[epiod - 2]?.id
                            }`}
                          >
                            <div
                              className="backw"
                              onClick={() =>
                                backward() &
                                setClickedId(
                                  props.gogoPSub.episodes[epiod - 2]?.id
                                )
                              }
                            >
                              <FaBackward />
                            </div>
                          </Link>
                          <Link
                            href={`/watch/${props.gogoPSub.episodes[epiod]?.id}`}
                          >
                            <div
                              className="fordw"
                              onClick={() =>
                                forward() &
                                setClickedId(props.gogoPSub.episodes[epiod]?.id)
                              }
                            >
                              <FaForward />
                            </div>
                          </Link>
                          <div className="plusa">
                            <FaPlus />
                          </div>
                          <div className="signo">
                            <HiOutlineSignal />
                          </div>
                        </div>
                      </div>
                      <div className="flex compIno">
                        <div className="flex flex-col items-center epIno containIno flex-wrap">
                          <div className="ino1">You are watching</div>
                          <div className="ino2">{`${
                            props.data?.episodes[epiod]?.isFiller === true
                              ? "Filler"
                              : ""
                          } Episode ${epiod}`}</div>
                          <div className="ino3">
                            If current server doesn't work please try other
                            servers beside.
                          </div>
                        </div>
                        <div className="flex flex-col serves">
                          <>
                            <div
                              className={`serveSub ${
                                props.gogoDub && props.gogoDub?.sources
                                  ? "borderDot"
                                  : ""
                              } flex gap-5 items-center`}
                            >
                              <div className="subb flex gap-1 items-center">
                                <div>SUB</div>
                                <div>:</div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {props.gogoSub && props.gogoSub.sources && (
                                  <div
                                    className={`subDub ${
                                      subIsSelected && selectedServer === 0
                                        ? "selected"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      setSelectedServer(0);
                                      setSubIsSelected(true);
                                      setServerName("GogoCdn");
                                      setBhaiLink(
                                        (
                                          props.gogoSub.sources.find((source) =>
                                            [
                                              "1080p",
                                              "720p",
                                              "480p",
                                              "360p",
                                              "backup",
                                            ].includes(source.quality)
                                          ) || {}
                                        ).url
                                      );
                                      setQuality(props.gogoSub.sources);
                                      setSubtitles("");
                                      setIntrod("");
                                      setOutrod("");
                                    }}
                                  >
                                    GogoCdn
                                  </div>
                                )}
                              </div>
                            </div>

                            {props.gogoDub && props.gogoDub?.sources && (
                              <div className="serveSub flex gap-5 items-center">
                                <div className="subb flex gap-1 items-center">
                                  <div>DUB</div>
                                  <div>:</div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {props.gogoDub.sources && (
                                    <div
                                      className={`subDub ${
                                        !subIsSelected && selectedServer === 0
                                          ? "selected"
                                          : ""
                                      }`}
                                      onClick={() => {
                                        setSelectedServer(0);
                                        setSubIsSelected(false);
                                        setServerName("GogoCdn");
                                        setBhaiLink(
                                          (
                                            props.gogoDub.sources.find(
                                              (source) =>
                                                [
                                                  "1080p",
                                                  "720p",
                                                  "480p",
                                                  "360p",
                                                  "backup",
                                                ].includes(source.quality)
                                            ) || {}
                                          ).url
                                        );
                                        setQuality(props.gogoDub.sources);
                                        setSubtitles("");
                                        setIntrod("");
                                        setOutrod("");
                                      }}
                                    >
                                      GogoCdn
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        </div>
                      </div>

                      {props?.datao?.relations?.edges?.length > 0 ? (
                        <>
                          <div className="seasonal-advice">
                            Watch more seasons of this anime:
                          </div>
                          <div className="seasonal">
                            {props?.datao?.relations.edges?.map((sea) => (
                              <>
                                <Link
                                  href={`/${sea.node.id}`}
                                  onClick={handleNavigation}
                                >
                                  <div
                                    className={`season h-[70px] ${
                                      sea.isCurrent === true ? "currento" : ""
                                    }`}
                                  >
                                    <img
                                      className="seasonal-background"
                                      src={sea.node.coverImage?.large}
                                      alt="pop"
                                    />
                                    {sea.node.title?.english
                                      ? sea.node.title?.english?.length < 15
                                        ? sea?.node.title.english
                                        : sea?.node.title.english.slice(0, 15) +
                                          "..."
                                      : sea.node.title?.romaji?.length < 15
                                      ? sea?.node.title.romaji
                                      : sea?.node.title.romaji.slice(0, 15) +
                                        "..."}
                                  </div>
                                </Link>
                              </>
                            ))}
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="current-anime-details ">
                <img
                  className="details-container-background"
                  src={props.datao.coverImage.large || "NA"}
                  alt="pop"
                />
                <div className="anime-details d-flex-fd-column">
                  <img
                    className="anime-details-poster"
                    src={props.datao.coverImage.large || "NA"}
                    alt="pop"
                  />

                  <div className="anime-details-content d-flex-fd-column">
                    <h1
                      style={{ textAlign: "center" }}
                      className={
                        props?.datao?.title.english
                          ? props?.datao?.title?.english?.length < 30
                          : props?.datao?.title?.romaji?.length < 30
                          ? `title-large`
                          : `title-large-long`
                      }
                    >
                      {props?.datao?.title.english
                        ? props?.datao?.title.english.length < 50
                          ? props?.datao?.title.english
                          : props?.datao?.title.english.slice(0, 50) + "..."
                        : props?.datao?.title.romaji.length < 50
                        ? props?.datao?.title.romaji
                        : props?.datao?.title.romaji.slice(0, 50) + "..."}
                    </h1>

                    <div className="flex m-auto gap-2 items-center">
                      <div className="flex gap-1">
                        {" "}
                        <div className="rat">{props.datao.averageScore}</div>
                        <div className="qual">{"HD"}</div>
                        <div className="subE">
                          <FaClosedCaptioning size={14} />{" "}
                          {props.datao.episodes || "Unknown"}
                        </div>
                        {/* {props.datao?.anime?.info?.stats.episodes.dub ? (
                          <div className="dubE">
                            {" "}
                            <AiFillAudio size={14} />{" "}
                            {props.datao.anime.info.stats.episodes.dub ||
                              "Unknown"}
                          </div>
                        ) : (
                          ""
                        )} */}
                      </div>
                      <div className="doto">&#x2022;</div>
                      <div className="typo">{props.datao.format}</div>
                      <div className="doto">&#x2022;</div>
                      <div className="duran">{props.datao.duration + "m"}</div>
                    </div>

                    <p className="descp">
                      {descIsCollapsed
                        ? props.datao.description?.slice(0, 150) + "..."
                        : props.datao.description}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => setDescIsCollapsed((prev) => !prev)}
                      >
                        [ {descIsCollapsed ? "More" : "Less"} ]
                      </span>
                    </p>
                    <p>
                      Animoon is the best site to watch{" "}
                      {props.datao.title.english || props.datao.title.romaji}{" "}
                      SUB online, or you can even watch{" "}
                      {props.datao.title.english || props.datao.title.romaji}{" "}
                      DUB in HD quality. You can also find{" "}
                      {
                        props.datao.studios.edges.find((edge) => edge.isMain)
                          ?.node.name
                      }{" "}
                      anime on Animoon website.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Share
            style={{
              paddingInline: 20,
            }}
            ShareUrl={props.ShareUrl}
            arise={props.arise}
          />

          <Comments
            epiod={props.epiod}
            epId={props.epId}
            anId={props.anId}
            firstName={props.firstName}
            userName={props.userName}
            imageUrl={props.imageUrl}
            emailAdd={props.emailAdd}
            IsLoading={IsLoading}
          />

          <RecommendedTopTen
            doIt={"doit"}
            datap={props.datao}
            genres={props.genres}
            uiui={props.datao}
            recommendations={props.recommendations}
            data={props.datapp}
            isInGrid={"true"}
            IsLoading={IsLoading}
          />
        </div>
      )}
    </>
  );
}
