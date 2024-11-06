import React from "react";
import ContentList from "./ContentList";

export default function Featured(props) {
  return (
    <div className="featured-container d-flex">
      <ContentList
        heading="Top Airing"
        data={props.dataAir}
        filterName="top-airing"
      />
      <ContentList
        heading="Most Popular"
        data={props.dataPopu}
        filterName="most-popular"
      />
      <ContentList
        heading="Most Favorite"
        data={props.dataFav}
        filterName="most-favorite"
      />
      <ContentList
        heading="Latest Completed"
        data={props.dataComp}
        filterName="completed"
      />
    </div>
  );
}
