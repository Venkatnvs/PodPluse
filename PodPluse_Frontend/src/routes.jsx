import HomeMain from './pages/Home/Main';
import PodcastMain from './pages/Podcast/Main';
import DiscoverMain from './pages/Discover/Main';

const routes = [
  {
    name: "root",
    path: "/",
    element: HomeMain,
  },
  {
    name: 'podcast',
    path: '/create-podcast',
    element: PodcastMain,
  },
  {
    name: 'discover',
    path: '/discover',
    element: DiscoverMain,
  }
];

export default routes;
