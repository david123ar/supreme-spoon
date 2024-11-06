import React from "react";
import WatchAnime from "@/app/WatchAnime/WatchAnime";

const ANILIST_API_URL = "https://graphql.anilist.co";

async function fetchAnimeInfo(id) {
  const query = `
  query ($id: Int) {
    Media(id: $id) {
      id
      idMal
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
      next: { revalidate: 3600 },
    });

    const { data } = await response.json();
    // console.log("API Response:", data); // Log full API response
    console.log(data?.Media);
    return data?.Media;
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return []; // Return null if an error occurs
  }
}

async function fetchAllEpisodes(animeId) {
  let episodes = [];
  let currentPage = 1;
  let lastPage = 1;

  try {
    // Fetch the first page to get the last visible page
    const firstResponse = await fetch(
      `https://api.jikan.moe/v4/anime/${animeId}/episodes?page=${currentPage}`,
      { next: { revalidate: 3600 } }
    );
    const firstData = await firstResponse.json();
    episodes = episodes.concat(firstData.data);
    lastPage = firstData.pagination.last_visible_page;
    // Fetch remaining pages until the last visible page
    while (currentPage < lastPage) {
      currentPage++;
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/episodes?page=${currentPage}`,
        { next: { revalidate: 3600 } }
      );
      const data = await response.json();
      episodes = episodes.concat(data.data);
    }

    console.log("Total Episodes Fetched:", episodes.length);
    return episodes;
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return [];
  }
}

async function fetchEpisodes(title) {
  try {
    const encodedTitle = encodeURIComponent(title);
    const gogoTP = await fetch(
      `https://newgogoking.vercel.app/${encodedTitle}?page=1`,
      { cache: "no-store" }
    );
    const response = await gogoTP.json();

    // Check if the response contains results
    if (!response || !response.results || response.results.length === 0) {
      console.log(`No episodes found for title: ${title}`);
      return null; // Return null if no episodes are found
    }

    return response; // Return the full response object
  } catch (error) {
    console.log(`Error fetching episodes for title: ${title}`, error);
    return null;
  }
}

async function fetchEpisodesWithFallbacks(animeInfo, kitsuTitle) {
  let gogoEP = null;

  // Array of potential title options for fallbacks
  const titleCandidates = [
    animeInfo.title.english,
    animeInfo.title.native,
    animeInfo.title.romaji,
    kitsuTitle,
  ].filter(Boolean); // Filters out any undefined values

  for (const title of titleCandidates) {
    console.log(`Attempting to fetch episodes for title: ${title}`);
    try {
      gogoEP = await fetchEpisodes(title);

      if (gogoEP && gogoEP.results.length > 0) {
        console.log(`Episodes found for title: ${title}`);
        break; // Stop the loop if episodes are found
      } else {
        console.log(
          `No episodes found for title: ${title}, trying next fallback.`
        );
      }
    } catch (error) {
      console.error(`Failed to fetch episodes for title: ${title}`, error);
    }
  }

  if (!gogoEP) {
    console.log("No episodes found for any title variant.");
  }

  return gogoEP;
}

// Helper function to fetch data with force-cache and revalidate options
async function fetchDataFromAPI(url, revalidate) {
  try {
    const response = await fetch(url, {
      cache: "force-cache", // Cache the response forcefully
      next: { revalidate },
    });
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from API: `, error);
    return null;
  }
}

// Generate metadata dynamically based on the anime info
export async function generateMetadata({ params }) {
  const animeId = (await params).id;
  const animeInfo = await fetchAnimeInfo(animeId);
  try {
    return {
      title: `Watch ${
        animeInfo.title.english || animeInfo.title.romaji
      } English Sub/Dub online free on Animoon.me`,
      description: `Animoon is the best site to watch ${
        animeInfo.title.english || animeInfo.title.romaji
      } SUB online, or you can even watch underrated anime on Animoon.`,
    };
  } catch (error) {
    console.error("Error fetching metadata: ", error);
    return {
      title: "Watch Anime Online Free on Animoon.me",
      description:
        "Animoon is the best site to watch anime in high quality with both sub and dub options.",
    };
  }
}

// Main page component
export default async function page({ params, searchParams }) {
  // Fetch anime info and recommended anime
  const animeId = (await params).id;
  const animeInfo = await fetchAnimeInfo(animeId);

  const recommendations = animeInfo?.recommendations?.edges.map((edge) => {
    return edge.node.mediaRecommendation; // Get the recommended media
  });
  // console.log("Anime Info:", animeInfo); // Log the anime info for debugging
  const epis = (await searchParams).ep;
  // const episodeIdParam = epis ? `${params.id}?ep=${epis}` : null;

  // Fetch anime info with force-cache and revalidation

  // Fetch episodes with force-cache and revalidation
  // const data = await fetchDataFromAPI(
  //   `https://api.jikan.moe/v4/anime/${animeInfo.malId}/episodes`,
  //   3600 // Revalidate after 1 hour
  // );

  // Determine the episode ID
  // const epId = episodeIdParam || data?.episodes[0]?.episodeId;

  // Find the episode number
  // let episodeNumber = 0;
  // if (data?.episodes?.length) {
  //   const currentEpisode = data.episodes.find((ep) => ep.episodeId === epId);
  //   episodeNumber = currentEpisode ? currentEpisode.number : 0;
  // }

  // Fetch stream data (real-time, no caching)
  // let dataj = [];
  // try {
  //   const respStream = await fetch(
  //     `https://vimalking.vercel.app/api/stream?id=${epId}`,
  //     { cache: "no-store" } // No cache for real-time streaming data
  //   );
  //   dataj = await respStream.json();
  // } catch (error) {
  //   console.error("Error fetching stream data: ", error);
  //   dataj = [];
  // }

  // let datau = [];
  // try {
  //   const respS = await fetchDataFromAPI(
  //     `https://aniwatch-api-8fti.onrender.com/anime/search/suggest?q=${params.id}`,
  //     18000
  //   );
  //   datau = respS;
  // } catch (error) {
  //   datau = [];
  // }

  // let jname = "";
  // datau &&
  //   datau.suggestions &&
  //   datau?.suggestions?.map((i) => {
  //     if (i.id === params.id) {
  //       jname = i.jname;
  //     }
  //   });

  let kitsuO = [];
  try {
    const gogoTP = await fetch(
      `https://kitsu.io/api/edge/anime?filter[text]=${
        animeInfo.title.english || animeInfo.title.romaji
      }`,
      { next: { revalidate: 3600 } }
    );
    kitsuO = await gogoTP.json();
    console.log(kitsuO);
  } catch (error) {
    kitsuO = [];
  }
  console.log(kitsuO);

  // Example usage in the main function
  const kitsuTitle = kitsuO?.data?.[0]?.attributes?.titles?.en || "";
  const gogoEP = await fetchEpisodesWithFallbacks(animeInfo, kitsuTitle);

  if (gogoEP.length === 0) {
    console.warn("No episodes found for any title variant.");
  }

  let gogoPSub = [];
  try {
    const gogoTP = await fetch(
      `https://newgogoking.vercel.app/info/${gogoEP.results[0].id}`,
      { next: { revalidate: 3600 } }
    );
    gogoPSub = await gogoTP.json();
    // console.log(gogoPSub);
  } catch (error) {
    gogoPSub = [];
  }

  let gogoPDub = [];
  try {
    // Find the episode where subOrDub is "dub" and title includes the title of the first result
    const dubEpisode = gogoEP.results.find(
      (item) =>
        item.subOrDub === "dub" && item.title.includes(gogoEP.results[0].title)
    );

    if (dubEpisode) {
      const gogoTP = await fetch(
        `https://newgogoking.vercel.app/info/${dubEpisode.id}`,
        { next: { revalidate: 3600 } }
      );
      gogoPDub = await gogoTP.json();
    }
  } catch (error) {
    console.log("Error fetching the dub episode:", error);
    gogoPDub = [];
  }

  let epiod = 1;
  let epId = "";
  let i = 0;

  if (epis && !epis.includes("-dub")) {
    for (i = 0; i < gogoPSub.episodes?.length; i++) {
      if (gogoPSub?.episodes[i].id.includes(epis?.toString())) {
        epId = gogoPSub.episodes[i].id;
        epiod = gogoPSub.episodes[i].number;
        break; // Exit the loop once a match is found
      }
    }
  } else {
    for (i = 0; i < gogoPDub.episodes?.length; i++) {
      if (gogoPDub?.episodes[i].id.includes(epis?.toString())) {
        epId = gogoPDub.episodes[i].id;
        epiod = gogoPDub.episodes[i].number;
        break; // Exit the loop once a match is found
      }
    }
  }

  // const caseEP = gogoEP?.results?.length > 0 ? gogoEP.results[0]?.id : "";
  // let gogoId =
  //   "/" +
  //   (
  //     caseEP.replace(":", "").toLocaleLowerCase().replaceAll(" ", "-") +
  //     `-dub-episode-${epiod}`
  //   ).replace(/[^a-zA-Z0-9\-]/g, "");
  // let caseId =
  //   "/" +
  //   (
  //     caseEP.replace(":", "").toLocaleLowerCase().replaceAll(" ", "-") +
  //     `-episode-${epiod}`
  //   ).replace(/[^a-zA-Z0-9\-]/g, "");
  // Example data from your `datao` object

  // Example gogoData (with sub and dub information)

  let gogoSub = [];
  try {
    let gogoSC = await fetch(
      `https://newgogoking.vercel.app/watch/${
        epis ? epis : gogoPSub.episodes[0].id
      }`,
      { next: { revalidate: 3600 } }
    );
    gogoSub = await gogoSC.json();
  } catch (error) {
    gogoSub = [];
  }
  // console.log(gogoPSub);

  let gogoDub = [];
  try {
    let gogoSC = await fetch(
      `https://newgogoking.vercel.app/watch/${
        epis && epis.includes("-dub")
          ? epis
          : epis
          ? gogoPDub.episodes[epiod - 1].id
          : gogoPDub.episodes[0].id
      }`,
      { next: { revalidate: 3600 } }
    );
    gogoDub = await gogoSC.json();
  } catch (error) {
    gogoDub = [];
  }
  console.log("sub", gogoSub);

  const episodes = await fetchAllEpisodes(animeInfo.idMal);
  // console.log(episodes);

  // let subPri = [];
  // try {
  //   let gogoMC = await fetch(
  //     `https://hianimes.vercel.app/anime/episode-srcs?id=${epId}&serverId=4&category=sub`,
  //     {
  //       cache: "force-cache",
  //     }
  //   );
  //   subPri = await gogoMC.json();
  // } catch (error) {
  //   subPri = [];
  // }

  // const subPrio = subPri && subPri.tracks ? subPri.tracks : "";

  // Fetch homepage data with force-cache and revalidation
  // const datapp = await fetchDataFromAPI(
  //   "https://hianimes.vercel.app/anime/home",
  //   3600 // Revalidate after 1 hour
  // );

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
    next: { revalidate: 3600 },
  });

  const genreData = await genreRes.json();
  const genres = genreData?.data?.GenreCollection || []; // Fallback if genres are not fetched

  // Share URL and title for the current episode
  const ShareUrl = `https://animoon.me/watch/${epId}`;
  const arise = "this Episode";

  // Render WatchAnime component
  return (
    <div>
      <WatchAnime
        // data={data}
        anId={animeId}
        // subPrio={subPrio}
        datao={animeInfo}
        episodes={episodes}
        epiod={epiod}
        epId={epis ? epis : epId}
        epis={epis}
        recommendations={recommendations}
        // dataj={dataj}
        // datapp={datapp}
        gogoPDub={gogoPDub}
        gogoPSub={gogoPSub}
        genres={genres}
        gogoDub={gogoDub}
        gogoSub={gogoSub}
        ShareUrl={ShareUrl}
        arise={arise}
      />
    </div>
  );
}
