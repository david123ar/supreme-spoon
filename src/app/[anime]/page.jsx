import React from "react";
import RecommendedTopTen from "@/layouts/RecommendedTopTen";

const ANILIST_API_URL = "https://graphql.anilist.co";

// Function to fetch anime info from AniList by ID
async function fetchAnimeInfo(id) {
  const query = `
  query ($id: Int) {
    Media(id: $id) {
      id
      title {
        romaji
        english
        native
        userPreferred
      }
      coverImage {
        large
        medium
        color
      }
      bannerImage
      nextAiringEpisode {
        airingAt
        episode
        timeUntilAiring
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
      trailer {
        id
        site
        thumbnail
      }
      season
      seasonYear
      synonyms
     characters {
        edges {
          node {
            id
            name {
              full
              native
            }
            image {
              large
            }
          }
            role
        }
      }
      studios {
        edges {
          node {
            id
            name
          }
            isMain
        }
      }

      relations {
        edges {
        relationType
          node {
            id
            title {
              romaji
              english
            }
            coverImage {
              medium
              large
            }
            type
          }
        }
      }
      recommendations {
        edges {
          node {
            mediaRecommendation {
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
      }
    }
  }`;

  const variables = { id: parseInt(id, 10) }; // Ensure ID is an integer

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const { data } = await response.json();
    console.log("API Response:", data); // Log full API response
    return data?.Media;
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return []; // Return null if an error occurs
  }
}

// Function to fetch recommended anime
async function fetchRecommendedAnime() {
  const query = `
  query {
    Page(page: 1, perPage: 10) {
      media(type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
      }
    }
  }`;

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();
    return data?.Page?.media || []; // Return an empty array if no data
  } catch (error) {
    console.error("Error fetching recommended anime:", error);
    return []; // Return an empty array if an error occurs
  }
}

// Metadata generation using AniList API
export async function generateMetadata({ params }) {
  const parama = (await params).anime
  const animeInfo = await fetchAnimeInfo(parama);

  return {
    title: `Watch ${
      animeInfo?.title?.english || animeInfo?.title?.romaji
    } English Sub/Dub online free on Animoon.me`,
    description: `Animoon is the best site to watch ${
      animeInfo?.title?.english || animeInfo?.title?.romaji
    } SUB online, or you can even watch ${
      animeInfo?.title?.english || animeInfo?.title?.romaji
    } DUB in HD quality. You can also watch underrated anime on the Animoon website.`,
  };
}

// Main page component
export default async function Page({ params }) {
  const parama = (await params).anime

  console.log("Anime ID:", parama); // Log the anime ID

  // Fetch genre collection
  const genreRes = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
      query {
        GenreCollection
      }`,
    }),
    next:{revalidate:3600}
  });

  const genreData = await genreRes.json();
  const genres = genreData?.data?.GenreCollection || []; // Fallback if genres are not fetched

  const animeId = parama;

  // Fetch anime info and recommended anime
  const animeInfo = await fetchAnimeInfo(animeId);

  const recommendations = animeInfo.recommendations.edges.map((edge) => {
    return edge.node.mediaRecommendation; // Get the recommended media
  });
  console.log("Anime Info:", animeInfo); // Log the anime info for debugging

  const recommendedAnime = await fetchRecommendedAnime();

  const ShareUrl = `https://animoon.me/${animeId}`;
  const arise = "this Anime";

  return (
    <div>
      {/* Render the recommended top ten component with the fetched data */}
      <RecommendedTopTen
        uiui={animeInfo} // Anime info from AniList
        genres={genres}
        recommendations={recommendations}
        data={recommendedAnime} // Recommended anime from AniList
        ShareUrl={ShareUrl}
        arise={arise}
      />
    </div>
  );
}
