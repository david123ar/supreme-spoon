// pages/trending.js
import React from "react";
import Hero from "@/components/Hero/Hero";
import Trending from "@/components/Trending/Trending";
import Share from "@/components/Share/Share";
import Featured from "@/components/Featured/Featured";
import MainContainer from "@/components/MainContainer/MainContainer"; // Import MainContainer

const TrendingPage = async () => {
  // Fetch trending anime for Hero component
  const trendingRes = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          Page(perPage: 10) {
            media(sort: TRENDING_DESC, type: ANIME) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              bannerImage
              description
              episodes
              genres
               duration
            format
            averageScore
            isAdult
            }
          }
        }
      `,
    }),
    next:{revalidate: 3600}
  });

  const trendingData = await trendingRes.json();
  const trendingAnime = trendingData.data?.Page.media;

  // Fetch airing popular anime for Trending component
  const airingRes = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          Page(perPage: 10) {
            media(sort: POPULARITY_DESC, type: ANIME, status: RELEASING) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              episodes
              nextAiringEpisode {
                episode
              }
                 duration
            format
            averageScore
            isAdult
            }
          }
        }
      `,
    }),
    next:{revalidate: 3600},
  });

  const airingData = await airingRes.json();
  const airingAnime = airingData.data.Page.media;

  // Fetch recent anime episodes (recently aired episodes)
  const recentEpisodesRes = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          Page(perPage: 12) {
            media(sort: TRENDING_DESC, type: ANIME, status: RELEASING) {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                large
              }
              episodes
              nextAiringEpisode {
                airingAt
                episode
              }
                description
              episodes
              genres
               duration
            format
            averageScore
            isAdult
            favourites
            rankings {
              rank
              type
            }
              startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
              status
            }
          }
        }
      `,
    }),
    next:{revalidate: 3600},
  });

  const recentEpisodesData = await recentEpisodesRes.json();
  const recentEpisodesAnime = recentEpisodesData.data.Page.media;

  // Fetch upcoming anime (not yet aired)
  const upcomingRes = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          Page(perPage: 12) {
            media(sort: POPULARITY_DESC, type: ANIME, status: NOT_YET_RELEASED) {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                large
              }
                nextAiringEpisode {
                airingAt
                episode
              }
              description
              episodes
              genres
               duration
            format
            averageScore
            isAdult
            favourites
            rankings {
              rank
              type
            }
              startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
              status
            }
          }
        }
      `,
    }),
    next:{revalidate: 3600},
  });

  const upcomingData = await upcomingRes.json();
  const upcomingAnime = upcomingData.data.Page.media;

  // Fetch new anime (recently released or added anime)
  const newAnimeRes = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          Page(perPage: 12) {
            media(sort: START_DATE_DESC, type: ANIME, status: RELEASING) {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                large
              }
                nextAiringEpisode {
                airingAt
                episode
              }
              description
              episodes
              genres
               duration
            format
            averageScore
            isAdult
            favourites
            rankings {
              rank
              type
            }
              startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
              status
            }
          }
        }
      `,
    }),
    next:{revalidate: 3600}
  });

  const newAnimeData = await newAnimeRes.json();
  const newAnime = newAnimeData.data.Page.media;

  // Fetch most popular, favorite, and completed anime for Featured component
  const popularRes = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
          query {
            airing: Page(perPage: 5) {
              media(sort: POPULARITY_DESC,type: ANIME, status: RELEASING) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                description
              episodes
              genres
               duration
                 nextAiringEpisode {
                airingAt
                episode
              }
            format
            averageScore
            isAdult
              }
            }
            popular: Page(perPage: 5) {
              media(sort: POPULARITY_DESC, type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                episodes
                 duration
                 nextAiringEpisode {
                airingAt
                episode
              }
            format
            averageScore
            isAdult
              }
            }
            favorite: Page(perPage: 5) {
              media(sort: FAVOURITES_DESC, type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                episodes
                 duration
                 nextAiringEpisode {
                airingAt
                episode
              }
            format
            averageScore
            isAdult
              }
            }
            completed: Page(perPage: 5) {
              media(type: ANIME, status: FINISHED) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                episodes
                 duration
                 nextAiringEpisode {
                airingAt
                episode
              }
            format
            averageScore
            isAdult
              }
            }
          }
        `,
    }),
    next:{revalidate: 3600},
  });

  const popularData = await popularRes.json();
  const dataAir = popularData.data.airing.media;
  const dataPopu = popularData.data.popular.media;
  const dataFav = popularData.data.favorite.media;
  const dataComp = popularData.data.completed.media;

  // Fetch all available genres from AniList
  const genreRes = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
      query {
        GenreCollection
      }
    `,
    }),
    next:{revalidate: 3600}
  });

  const data = await genreRes.json();
  const genres = data.data.GenreCollection;

  // Pass the data to MainContainer separately
  return (
    <div>
      <Hero trendingAnime={trendingAnime} />
      <Trending data={airingAnime} />
      <Share ShareUrl="https://animoon.me/" />
      <Featured
        dataAir={dataAir}
        dataPopu={dataPopu}
        dataFav={dataFav}
        dataComp={dataComp}
      />
      {/* Pass fetched data separately to MainContainer */}
      <MainContainer
        recentEpisodesAnime={recentEpisodesAnime}
        upcomingAnime={upcomingAnime}
        newAnime={newAnime}
        genres={genres}
      />
    </div>
  );
};

export default TrendingPage;
