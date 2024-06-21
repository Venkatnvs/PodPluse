import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import Logo from '.././assets/icons/logo.svg';
import { sidebarLinks } from './../pages/SideBarLinks';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { logout } from '@/store/actions/authActions';

const LeftSideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user)

  return (
    <section className="left_sidebar h-[calc(100vh-5px)]">
      <nav className="flex flex-col gap-6">
        <Link href="/" className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center">
          <img src={Logo} alt="logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden">PodPluse</h1>
        </Link>

        {
          sidebarLinks.map((link, index) => {
            const isActive = location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href));

            return (
              <Link key={index} to={link.href} className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start",
                {"bg-nav-focus border-r-4 border-orange-1" : isActive}
              )}>
                <img src={link.imgURL} alt={link.title} width={20} height={20} />
                <p>{link.title}</p>
            </Link>
            )
          })
        }

      </nav>

      {
        user && (
          <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
            <Button className="text-16 w-full bg-orange-1 font-extrabold" onClick={() => {
              dispatch(logout())
              window.location.reload()
            }}>
              Log Out
            </Button>
          </div>
        )
      }
    </section>
  )
}

export default LeftSideBar