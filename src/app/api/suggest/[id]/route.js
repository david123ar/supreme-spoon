import { NextResponse } from "next/server";

const ANILIST_API_URL = "https://graphql.anilist.co";

export async function GET(req, { params }) {
  // Define the GraphQL query to search for an anime by title, limiting results to 5
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 5) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          description
          coverImage {
            large
          }
          status
          episodes
          format
          duration 
          startDate { 
            year
            month
            day
          }
        }
      }
    }
  `;

  // Set the variables for the query
  const variables = {
    search: params.id,  // Use params.id for the search term
  };

  try {
    // Make the request to the AniList API
    const resp = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await resp.json();

    // Check for errors in the response
    if (data.errors) {
      return NextResponse.json({ error: "No data found or an error occurred." }, { status: 404 });
    }

    // Return the data if found
    return NextResponse.json(data.data?.Page.media);
  } catch (error) {
    console.error("Error fetching data from AniList:", error);
    return NextResponse.json({ error: "Failed to fetch data." }, { status: 500 });
  }
}

// Set the revalidation time
export const revalidate = 18000;
