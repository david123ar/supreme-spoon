import React from "react";

export default function useAnime() {
  async function getSuggestSearch(id) {
    try {
      let data = await fetch(location.origin + "/api/suggest/" + id, {
        cache: "force-cache",
      });
      let json = await data.json();

      console.log(json);
      return json;
    } catch (error) {
      return [];
    }
  }
  async function getAnimeInfo(id) {
    const data = await fetch(
      `https://hianimes.vercel.app/anime/info?id=${id}`,
      {
        cache: "force-cache", // Force cache the response
        next: { revalidate: 18000 }, // Revalidate after 5 hours (18000 seconds)
      }
    );
    let json = await data.json();
    console.log(json);
    return json;
  }

  async function getZoroBroStream(id) {
    let data = await fetch(location.origin + `/api/anime/zoroBroStream/` + id, {
      cache: "no-store",
    });
    let json = await data.json();
    console.log(json);
    return json;
  }
  async function getUsers() {
    const data = await fetch(location.origin + "/api/anime/users", {
      cache: "no-store",
    });
    let json = await data.json();
    console.log(json);
    return json;
  }
  async function getEpiZoro(id) {
    const resp = await fetch(
      `https://aniwatch-api-8fti.onrender.com/anime/episodes/${id}`
    );
    const data = await resp.json();
    console.log(data);
    return data;
  }
  async function getSuggest(id) {
    const respu = await fetch(
      `https://aniwatch-api-8fti.onrender.com/anime/search/suggest?q=${id}`,
      { cache: "force-cache" }
    );
    const datau = await respu.json();
    return datau;
  }
  async function getZoroStream(episo, server, sub) {
    const resp = await fetch(
      `https://aniwatch-api-8fti.onrender.com/anime/episode-srcs?id=${episo}&serverId=${server}&category=${sub}`,
      { cache: "force-cache" }
    );
    const data = await resp.json();
    console.log(data);
    return data;
  }
  async function getRandomAnime() {
    const data = await fetch(location.origin + "/api/anime/random", {
      cache: "no-store",
    });
    let json = await data.json();
    console.log(json);
    return json;
  }
  return {
    getAnimeInfo,
    getEpiZoro,
    getSuggest,
    getZoroStream,
    getZoroBroStream,
    getSuggestSearch,
    getUsers,
    getRandomAnime,
  };
}
