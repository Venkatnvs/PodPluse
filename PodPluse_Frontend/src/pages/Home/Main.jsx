import PodCastCard from "@/components/PodCastCard";
import Layout from "../Layouts/Layout";
import { podcastData } from "./poddata";

const Main = () => {
  return (
    <Layout>
      <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
        <section className="flex flex-col gap-5">
          <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
          <div className="podcast_grid">
            {
              podcastData.map((podcast, index) => (
                <PodCastCard key={index} podcast={podcast} />
              ))
            }
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Main;