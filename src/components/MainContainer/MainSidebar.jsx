import React from "react";
import Genre from "../Genre/Genre";

export default function MainSidebar(props) {
  return (
    <div className="d-flex-fd-column">
      <Genre isInNavbar={false} data={props.data} IsLoading={props.IsLoading}/>
    </div>
  );
}