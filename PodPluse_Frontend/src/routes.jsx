import HomeMain from './pages/Home/Main';
import CreatePodCast from './pages/Podcast/CreatePodCast';
import DiscoverMain from './pages/Discover/Main';
import PodCastDetails from './pages/Podcast/PodCastDetails';

const routes = [
  {
    name: "root",
    path: "/",
    element: HomeMain,
  },
  {
    name: 'podcast',
    path: '/create-podcast',
    element: CreatePodCast,
  },
  {
    name: 'podcast-details',
    path: '/podcast/:id',
    element: PodCastDetails,
  },
  {
    name: 'discover',
    path: '/discover',
    element: DiscoverMain,
  }
];

export default routes;
