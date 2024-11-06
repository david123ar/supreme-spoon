import AnimeCollection from "./AnimeCollection";
import MainSidebar from "./MainSidebar";

export default function MainContainer(props) {
  return (
    <div className="main-container d-flex">
      <>
        {/* Sidebar */}
        <div className="sidebar-wrapper">
          <MainSidebar
            data={props.genres} // Pass the sidebar data
            IsLoading={props.IsLoading}
          />
        </div>

        {/* Anime Collections */}
        <div className="collections-wrapper d-flex-fd-column a-center ">
          {/* Latest Episodes */}
          <AnimeCollection
            collectionName="Latest Episodes"
            data={props.recentEpisodesAnime} // Use recentEpisodesAnime from props
            filterName="recently-updated"
            IsLoading={props.IsLoading}
          />

          {/* New on Animoon */}
          <AnimeCollection
            collectionName="New on Animoon"
            data={props.newAnime} // Use newAnime from props
            filterName="recently-added"
            IsLoading={props.IsLoading}
          />

          {/* Top Upcoming */}
          <AnimeCollection
            collectionName="Top Upcoming"
            data={props.upcomingAnime} // Use upcomingAnime from props
            filterName="top-upcoming"
            IsLoading={props.IsLoading}
          />
        </div>
      </>
    </div>
  );
}
