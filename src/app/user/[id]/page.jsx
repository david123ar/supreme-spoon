import React from "react";
import Slab from "@/components/Slab/Slab";
import Profito from "@/components/Profito/Profito";
// import MyComponent from "@/components/ContinueWatching/ContinueWatching";
// import WatchList from "@/components/WatchList/WatchList";
// import Settings from "@/components/Settings/Settings";
// import Notification from "@/components/Notification/Notification"

export async function generateMetadata({ params }) {
  const idd = "Anime";

  return {
    title: `Watch ${idd} English Sub/Dub online free on Animoon.me , free Anime Streaming`,
    description: `Animoon is the best site to watch
                      ${idd} SUB online, or you can even
                      watch ${idd} DUB in HD quality. You
                      can also watch under rated anime
                      on Animoon website.`,
  };
}


export default async function page({ params, searchParams }) {
  const param = (await params).id;
  const slabId = param.replace("-", " ");

  return (
    <>
      <div>
        <Slab slabId={slabId} />
      </div>
      {param === "profile" ? (
        <Profito
        />
      ) : (
        ""
      )}
      {/* {param === "continue-watching" ? <MyComponent /> : ""}
      {param === "watch-list" ? <WatchList type={searchParams.type} /> : ""}
      {param === "settings" ? <Settings /> : ""}
      {param === "notification" ? <Notification/> : ""} */}
    </>
  );
}
