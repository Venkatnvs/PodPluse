import PodCastCard from "@/components/PodCastCard";
import Layout from "../Layouts/Layout";
import { podcastData } from "./poddata";
import { useEffect, useState } from "react";
import { getTrendingPodcastsApi } from "@/apis/PodCast";

const Main = () => {
  const [trendingPodcasts, setTrendingPodcasts] = useState([]);
  useEffect(() => {
    document.title = "PodPluse - Home";
    try {
      getTrendingPodcastsApi().then((res) => {
        setTrendingPodcasts(res.data);
        console.log("Trending podcasts:", res.data);
      });
    } catch (error) {
      console.error("Error fetching trending podcasts:", error);
    }
  }, []);
  return (
    <Layout>
      <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
        <section className="flex flex-col gap-5">
          <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
          <div className="podcast_grid">
            {
              trendingPodcasts.map((podcast, index) => (
                <PodCastCard
                  key={index}
                  imgURL={podcast.image.full_image_url}
                  title={podcast.title}
                  description={podcast.description}
                  id={podcast.uuid}
                />
              ))
            }
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Main;