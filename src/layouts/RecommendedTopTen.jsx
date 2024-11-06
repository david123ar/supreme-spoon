"use client";
import React, { useState } from "react";
import AnimeCollection from "@/components/MainContainer/AnimeCollection";
import Genre from "@/components/Genre/Genre";
import Details from "@/components/AnimeInfo/AnimeInfoRandom";
import "./recom.css";
import LoadingSpinner from "@/components/loadingSpinner";
import Link from "next/link";

export default function RecommendedTopTen(props) {
  const initialVisibleItems = 3;
  const [visibleItems, setVisibleItems] = useState(initialVisibleItems);

  // Function to show more items
  const showMoreItems = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 10); // Increase by 10 items each time
  };
  const showLessItems = () => {
    setVisibleItems(initialVisibleItems); // Reset to initial visible count
  };

  const initialVisibleCharacterItems = 3;
  const [visibleCharacterItems, setVisibleCharacterItems] = useState(initialVisibleCharacterItems);

  // Function to show more items
  const showMoreCharacterItems = () => {
    setVisibleCharacterItems((prevVisibleItems) => prevVisibleItems + 10); // Increase by 10 items each time
  };
  const showLessCharacterItems = () => {
    setVisibleCharacterItems(initialVisibleCharacterItems); // Reset to initial visible count
  };
  return (
    <>
      <>
        {props.doIt ? (
          ""
        ) : (
          <Details
            animeData={props.uiui}
            rand={props.rand}
            ShareUrl={props.ShareUrl}
            arise={props.arise}
          />
        )}

        {props.uiui && props.uiui.relations.edges.length > 0 ? (
          <>
            <div className="hdf">Related</div>
            <div class="flex-container">
              {props.uiui.relations.edges.slice(0, visibleItems).map((sea) => (
                <div key={sea.node.id} className="seakong">
                  <div className="kemono">
                    <img
                      src={sea.node?.coverImage.large}
                      alt={sea.node.title.english || sea.node.title.romaji}
                    />
                  </div>
                  <div className="kemono-wr">
                    <div className="kemono-rel">{sea.relationType.replace('_',' ')}</div>
                    <div>{sea.node.title.english || sea.node.title.romaji}</div>
                    <div className="kemono-rl">{sea.node.type}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More button */}
            {visibleItems < props.uiui.relations.edges.length && (
              <button
                onClick={showMoreItems}
                className="mt-4 p-2 bg-blue-500 text-white rounded ml-5 btoi"
              >
                Show More
              </button>
            )}
            {visibleItems > initialVisibleItems && (
              <button
                onClick={showLessItems}
                className="p-2 bg-gray-500 text-white rounded ml-5 btoi"
              >
                Show Less
              </button>
            )}
          </>
        ) : (
          ""
        )}

        {props.uiui && props.uiui.characters.edges.length > 0 ? (
          <>
            <div className="hdf">Characters</div>
            <div class="flex-container">
              {props.uiui.characters.edges.slice(0, visibleCharacterItems).map((sea) => (
                <div key={sea.node.id} className="seakong">
                  <div className="kemono">
                    <img
                      src={sea.node?.image.large}
                      alt={sea.node.name.full || sea.node.name.native}
                    />
                  </div>
                  <div className="kemono-wr">
                    {/* <div className="kemono-rel">{sea.relationType}</div> */}
                    <div>{sea.node.name.full || sea.node.name.native}</div>
                    <div className="kemono-rl">{sea.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More button */}
            {visibleCharacterItems < props.uiui.characters.edges.length && (
              <button
                onClick={showMoreCharacterItems}
                className="mt-4 p-2 bg-blue-500 text-white rounded ml-5 btoi"
              >
                Show More
              </button>
            )}
            {visibleCharacterItems > initialVisibleCharacterItems && (
              <button
                onClick={showLessCharacterItems}
                className="p-2 bg-gray-500 text-white rounded ml-5 btoi"
              >
                Show Less
              </button>
            )}
          </>
        ) : (
          ""
        )}

        <div className=" main-container jik d-flex">
          <div className="sidebar-wrapper d-flex-fd-column">
            <Genre data={props.genres} />
          </div>
          <div className=" collections-wrapper jik d-flex  ">
            <AnimeCollection
              collectionName="Recommended for you"
              data={props.recommendations}
              isInGrid={"true"}
            />
          </div>
        </div>
      </>
    </>
  );
}
