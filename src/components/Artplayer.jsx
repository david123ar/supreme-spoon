"use client";
import Artplayer, { html } from "artplayer";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";
import artplayerPluginChapter from "artplayer-plugin-chapter";
import Hls from "hls.js";
import React, { useRef, useEffect, useState } from "react";
import "@/components/artplayer.css";

function ArtPlayer(props) {
  const artRef = useRef(null);
  function getInstance() {
    (art) => console.info(art);
  }
  const [epSource, setEpSource] = useState(null);
  const [kpSource, setKpSource] = useState(null);
  const [uri, setUri] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [ingo, setIngo] = useState("");

  const filteredCaptions = props.subtitles
    ? props.subtitles.filter((sub) => sub.kind === "captions")
    : "";
  // Create the subtitle selector based on available subtitles

  const qualities =
    props.quality && props.quality.length
      ? props.quality?.map((source) => ({
          url: source.url,
          html: source.quality, // This will be displayed in the quality switch menu
          isM3U8: source.isM3U8,
          default: source.quality === "1080p", // Mark 1080p as the default quality
        }))
      : [];

  // Handle case where qualities array is empty
  const selectedUrl =
    qualities?.length > 0
      ? qualities.find((q) => q.default)?.url || qualities[0].url
      : ""; // Fallback to empty string if no sources available

  const finalUrl = selectedUrl || props.bhaiLink || "";

  if (finalUrl === "") {
    console.warn("No valid URL available.");
  }

  function playM3u8(video, url, art) {
    if (Hls.isSupported()) {
      if (art.hls) art.hls.destroy();
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      art.hls = hls;
      art.on("destroy", () => hls.destroy());
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else {
      art.notice.show = "Unsupported playback format: m3u8";
    }
  }
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
  let FinalUrl;
  FinalUrl = props.bhaiLink;
  console.log(FinalUrl);

  function setPlat() {
    ls.setItem(`newW-${props.epId}`, props.bhaiLink);
  }
  if (!ls.getItem(`newFa-${props.epId}`)) {
    setTimeout(setPlat, 10000);
  }
  ls.setItem(`subEp-${props.anId}`, props.subEp);
  ls.setItem(`dubEp-${props.anId}`, props.dubEp);
  ls.setItem(`epNumo-${props.anId}`, props.epNum);
  ls.setItem(`subLang-${props.anId}`, props.sub);
  ls.setItem(`subEp-${props.epId}`, props.sub);
  ls.setItem(`imgUra-${props.anId}`, props.imgUra);
  ls.setItem(`ratUra-${props.anId}`, props.ratUra);
  ls.setItem(`dura-${props.anId}`, props.durEp);
  ls.setItem(`nameUra-${props.anId}`, props.nameUra);
  ls.setItem(`subLang`, props.sub);

  console.log("1000$", props.bhaiLink);

  const dltt = ls.getItem("artplayer_settings");
  const obj = {};
  obj.anId = props.anId;
  obj.epId = props.epId;
  obj.epNum = props.epNum;
  obj.sub = props.sub;
  obj.duration = dltt
    ? JSON.parse(dltt).times[ls.getItem(`newW-${props.epId}`)]
      ? JSON.parse(dltt).times[ls.getItem(`newW-${props.epId}`)]
      : ""
    : "";

  const m3u8 = ls.getItem("recent-episodes")
    ? ls.getItem("recent-episodes").split(",")
    : [];

  if (dltt) {
    if (JSON.parse(dltt).times[props.bhaiLink]) {
      if (ls.getItem("recent-episodes")) {
        let vals = ls.getItem("recent-episodes").split(",");
        if (!vals.includes(props.epId)) {
          vals.push(props.epId);
          ls.setItem("recent-episodes", vals.join(","));
        }
      } else {
        ls.setItem("recent-episodes", props.epId);
      }
    }
  }

  if (ls.getItem("Recent-animes")) {
    let vals = ls.getItem("Recent-animes").split(",");
    if (vals.includes(props.anId)) {
      vals = vals.filter((val) => val !== props.anId);
    }
    vals.unshift(props.anId);
    ls.setItem("Recent-animes", vals.join(","));
  } else {
    ls.setItem("Recent-animes", props.anId);
  }

  if (dltt) {
    if (JSON.parse(dltt).times[props.bhaiLink]) {
      if (ls.getItem(props.anId.toString())) {
        console.log(ls.getItem(props.anId.toString()));
        let vals = ls.getItem(props.anId.toString()).split(",");
        ls.setItem(`Rewatch-${props.anId.toString()}`, props.epId);
        if (!vals.includes(props.epId.toString())) {
          vals.push(props.epId.toString());
          ls.setItem(props.anId.toString(), vals.join(","));
        }
      } else {
        ls.setItem(props.anId.toString(), props.epId.toString());
      }
    }
  }

  useEffect(() => {
    const art = new Artplayer({
      title: "hahahaha",
      container: ".artplayer-app",
      url: finalUrl,
      type: "m3u8",
      quality: qualities?.length > 0 ? qualities : [],
      plugins: [
        artplayerPluginHlsQuality({
          control: false,
          setting: true,
          getResolution: (level) => level.height + "P",
          title: "Quality",
          auto: "Auto",
        }),
      ],
      customType: {
        m3u8: playM3u8,
      },
      volume: 3,
      isLive: false,
      muted: false,
      autoplay: false,
      autoOrientation: true,
      pip: true,
      autoSize: false,
      lock: true,
      autoMini: false,
      screenshot: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: false,
      subtitleOffset: false,
      miniProgressBar: false,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: "#F5316F",
      whitelist: ["*"],
      moreVideoAttr: {
        crossOrigin: "anonymous",
      },
      subtitle: {
        url:
          filteredCaptions && filteredCaptions.length > 0
            ? filteredCaptions.find((sub) => sub.default)?.file || ""
            : "", // Set the default subtitle or first subtitle if default is not found,
        type: "srt",
        className: "subtitle-text",
        encoding: "utf-8",
      },

      settings: [
        {
          width: 200,
          html: "Subtitle",
          tooltip: "English",
          icon: '<img width="22" heigth="22" src="https://artplayer.org/assets/img/subtitle.svg">',
          selector: [
            {
              html: "Display",
              tooltip: "Show",
              switch: true,
              onSwitch: function (item) {
                item.tooltip = item.switch ? "Hide" : "Show";
                art.subtitle.show = !item.switch;
                return !item.switch;
              },
            },
            ...(filteredCaptions && filteredCaptions.length > 0
              ? filteredCaptions.map((sub) => ({
                  default: sub.default || false,
                  html: sub.label,
                  url: sub.file,
                }))
              : []),
          ],
          onSelect: function (item) {
            art.subtitle.switch(item.url, {
              name: item.html,
            });
            return item.html;
          },
        },
      ],

      highlight: [
        {
          time: parseInt(props.introd?.start) || 0,
          text: "Opening Start",
        },
        {
          time: parseInt(props.introd?.end) || 0,
          text: "Opening End",
        },
        {
          time: parseInt(props.outrod?.start) || 0,
          text: "Ending Start",
        },
        {
          time: parseInt(props.outrod?.end) || 0,
          text: "Ending End",
        },
      ],
      icons: {
        loading: '<img src="https://artplayer.org/assets/img/ploading.gif">',
        state:
          '<img width="150" height="150" src="https://artplayer.org/assets/img/state.svg">',
        indicator:
          '<img width="16" height="16" src="https://artplayer.org/assets/img/indicator.svg">',
      },
    });

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    const dltr = ls.getItem("artplayer_settings");
    if (dltr) {
      let currentT = JSON.parse(dltr).times[ls.getItem(`newW-${props.epId}`)]
        ? JSON.parse(dltr).times[ls.getItem(`newW-${props.epId}`)]
        : 0;
      art.on("ready", () => {
        art.currentTime = currentT;
        ls.setItem(`duran-${props.anId}`, art.duration);
        if (props.onn1 === "On") {
          art.play();
        } else {
          art.pause();
        }
      });
      art.on("video:timeupdate", () => {
        if (props.onn3 === "On") {
          if (
            art.currentTime > props.introd?.start &&
            art.currentTime < props.introd?.end
          ) {
            art.seek = props.introd?.end;
          }
          if (
            art.currentTime > props.outrod?.start &&
            art.currentTime < props.outrod?.end
          ) {
            art.seek = props.outrod?.end;
          }
        }
      });
      art.on("subtitleUpdate", (text) => {
        art.template.$subtitle.innerHTML = text;
      });
      art.on("resize", () => {
        art.subtitle.style({
          fontSize: art.height * 0.05 + "px",
        });
      });
      art.on("video:ended", () => {
        if (props.onn2 === "On") {
          props.getData("YES");
        }
      });
      let isPlaying = false;
      let errorOccurred = false;
      const timeoutDuration = 10000; // 10 seconds

      // Set a timeout to check if the video starts playing and has a valid duration
      const loadingTimeout = setTimeout(() => {
        if (!isPlaying && (art.duration === 0 || isNaN(art.duration))) {
          console.error(
            "The video is stuck loading or failed to play the HLS URL, and the duration is not available."
          );
          props.err("yes happened");
        }
      }, timeoutDuration);

      // Listen for the 'playing' event to detect if the video starts playing
      art.on("playing", () => {
        isPlaying = true;
        clearTimeout(loadingTimeout); // Clear the timeout if the video starts playing
      });

      // Listen for the 'error' event in case of any playback errors
      art.on("error", (event) => {
        errorOccurred = true;
        if (!isPlaying && (art.duration === 0 || isNaN(art.duration))) {
          console.error(
            "Failed to play the HLS URL and the duration is not available:",
            event
          );
        }
        clearTimeout(loadingTimeout); // Clear the timeout on error
      });
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, [props.bhaiLink, props.sub, props.epId, props.trutie]);

  return (
    <>
      <div
        className="artplayer-app md:h-[800px] h-[250px] w-full absolute top-0 left-0"
      ></div>
    </>
  );
}

// var art = new Artplayer({
// 	container: '.artplayer-app',
// 	url: '/assets/sample/video.mp4',
// });

// art.on('ready', () => {
// 	// Create a custom control element manually
// 	const customControl = document.createElement('div');
// 	customControl.innerHTML = 'Skip 10s';
// 	Object.assign(customControl.style, {
// 		position: 'absolute',
// 		right: '10px',
// 		top: 'calc(100% - 60px)', // Adjust the top position above the progress bar
// 		transform: 'translateY(-100%)', // Move it up above the progress bar
// 		zIndex: 1000, // Set a high z-index value to ensure it's above the video
// 		cursor: 'pointer',
// 		background: 'rgba(0, 0, 0, 0.7)',
// 		color: 'white',
// 		padding: '5px 10px',
// 		borderRadius: '5px',
// 		display: 'none', // Initially hidden
// 		pointerEvents: 'auto', // Ensure the control is clickable
// 	});

// 	// Append the custom control to the Artplayer container
// 	art.template.$player.appendChild(customControl);

// 	// Handle control click event
// 	customControl.addEventListener('click', () => {
// 		art.currentTime = Math.min(art.currentTime + 10, art.duration);
// 	});

// 	// Continuously check currentTime and show/hide control dynamically
// 	art.on('video:timeupdate', () => {
// 		const currentTime = art.currentTime;
// 		// Show custom control only between 10 and 20 seconds
// 		if (currentTime >= 10 && currentTime <= 20) {
// 			customControl.style.display = 'block'; // Show control
// 		} else {
// 			customControl.style.display = 'none'; // Hide control
// 		}
// 	});
// });

export default ArtPlayer;
