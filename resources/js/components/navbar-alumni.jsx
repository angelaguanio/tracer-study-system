import { useState, useEffect } from 'react'
import logo from '../assets/logotracer.png'
import { Link, usePage } from '@inertiajs/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Button } from './ui/button'
import ProfileTemp from './profile-temp'
import {
  User, Mail, LogOut, Menu, X,
  ClipboardList, Megaphone, Home, Info, Phone, Users, Building2, ChevronRight, ChevronDown
} from 'lucide-react'
import NotificationBell from './NotificationBell'
import { useNotifications } from '@/hooks/useNotifications';

const mainNav = [
  { id: "home", name: "Home", href: "/alumna/home", icon: Home },
  { id: "announcements", name: "Announcements", href: "/alumna/announcements", icon: Megaphone },
  { 
    id: "questionnaire", 
    name: "Questionnaire", 
    icon: ClipboardList,
    subItems: [
      { id: "tracer", name: "Tracer Study Survey", href: "/alumna/questionnaire?tab=tracer-study" },
      { id: "cect", name: "Alumni Forms", href: "/alumna/questionnaire?tab=cect-surveys" },
    ]
  },
  { 
    id: "affairs", 
    name: "Alumni Affairs", 
    icon: Building2,
    subItems: [
      { id: "association", name: "Alumni Association", href: route('alumna.association') },
      { id: "office", name: "Alumni Office", href: route('alumna.office') },
    ]
  },
  { id: "about", name: "About", href: "/alumna/about", icon: Info },
  { id: "contact", name: "Contact us", href: "/alumna/contact", icon: Phone },
]

const accountBtns = [
  { id: "profile", name: "Profile", href: route('alumna.profile'), icon: User },
  { id: "inquiries", name: "Inquiries", href: route('alumna.inquiries.index'), icon: Mail },
  { id: "logout", name: "Logout", href: route('alumna.logout'), icon: LogOut },
]

function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

export default function NavbarAlumni({ children }) {
  const { auth } = usePage().props
  const { url } = usePage()
  const user = auth?.user
  const notifications = useNotifications(user.user_role, user.id);
  const currentPath = url.split('?')[0]
  const isTracerLocked = auth?.user?.is_tracer_locked || false;

  const filteredMainNav = isTracerLocked ? [] : mainNav;
  const filteredAccountBtns = isTracerLocked 
    ? accountBtns.filter(item => item.id === 'logout') 
    : accountBtns;
  
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSubMenus, setOpenSubMenus] = useState({
      questionnaire: false,
      affairs: false
  })
  
  const isTransparentHeader = currentPath === '/alumna/home' || currentPath === '/alumna/about'

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleSubMenu = (id) => {
      setOpenSubMenus(prev => ({
          ...prev,
          [id]: !prev[id]
      }))
  }

  return (
    <>
      <header className={`flex justify-between items-center px-5 md:px-6 py-4 md:py-5 z-50 transition-all duration-500 ease-in-out ${
        isTransparentHeader && !isScrolled
          ? 'fixed top-0 w-full bg-white/0 backdrop-blur-none shadow-none border-b border-transparent text-white'
          : `${isTransparentHeader ? 'fixed' : 'sticky'} top-0 w-full bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-100/50 text-navbar-text`
      }`}>
        <div className='flex items-center space-x-3'>
          <img src={logo} className='h-12 md:h-14' alt="Alumni Connect logo" />
          <p className="font-bruno lg:text-lg text-base">Alumni Connect</p>
        </div>

        {/* Right side: Bell and Hamburger (Visible on all screen sizes) */}
        <div className="flex items-center gap-3">
          {!isTracerLocked && (
            <NotificationBell 
              className={`transition-colors duration-500 ${isTransparentHeader && !isScrolled ? 'text-white hover:bg-white/20' : 'text-navbar-text hover:bg-gray-200'}`} 
              notifications={notifications} 
              iconSize={26}
            />
          )}
          <button
            onClick={() => setMobileOpen(true)}
            className={`p-2 cursor-pointer transition-colors duration-500 rounded-full ${isTransparentHeader && !isScrolled ? 'text-white hover:bg-white/20' : 'text-navbar-text hover:bg-gray-200'}`}
            aria-label="Open menu"
          >
            <Menu size={30} />
          </button>
        </div>
      </header>

      {/* Overlay Background */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Slide-out drawer menu */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Profile card with Close Button */}
        <div
            className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0"
        >
            <div className="h-11 w-11 rounded-full overflow-hidden bg-blue-500 shrink-0 flex items-center justify-center">
            {user?.profile_picture ? (
                <img
                src={user.profile_picture}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-full h-full object-cover"
                />
            ) : (
                <span className="text-white font-semibold text-sm">
                {getInitials(user?.first_name, user?.last_name)}
                </span>
            )}
            </div>

            <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-[15px] truncate">
                {user?.first_name} {user?.last_name}
            </p>

            <p className="text-sm text-gray-500 truncate">
                {user?.courses}
            </p>
            </div>

            <button
                onClick={() => setMobileOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition cursor-pointer"
                aria-label="Close menu"
            >
                <X className="h-5 w-5 text-gray-600" />
            </button>
        </div>

        {/* Scrollable Links Area */}
        <div className="flex-1 overflow-y-auto pb-6">
            {!isTracerLocked && (
                <>
                    {/* MAIN section */}
                    <div className="px-5 pt-5 pb-1">
                    <p className="text-xs font-semibold tracking-wide text-gray-400">MAIN</p>
                    </div>
                    <div className="px-2">
                    {filteredMainNav.map((item) => {
                const Icon = item.icon
                
                if (item.subItems) {
                    const isOpen = openSubMenus[item.id]
                    return (
                        <div key={item.id}>
                            <button
                                onClick={() => toggleSubMenu(item.id)}
                                className="w-full flex items-center justify-between px-3 py-3 mx-1 rounded-md transition text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="h-5 w-5 text-gray-400" />
                                    <span className="text-[15px]">{item.name}</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isOpen && (
                                <div className="ml-11 mr-2 mt-1 mb-2 space-y-1">
                                    {item.subItems.map((subItem) => {
                                        const isSubActive = url === subItem.href || (subItem.href.includes('?') && url.includes(subItem.href.split('?')[1]))
                                        return (
                                            <Link
                                                key={subItem.id}
                                                href={subItem.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`block px-3 py-2 text-sm rounded-md transition ${
                                                    isSubActive
                                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                {subItem.name}
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                }

                const isActive = currentPath === item.href
                return (
                <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 mx-1 rounded-md transition border-l-[3px] ${
                    isActive
                        ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                        : 'border-transparent text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span className="text-[15px]">{item.name}</span>
                </Link>
                )
            })}
            </div>
            
            <div className="border-t border-gray-100 my-3 mx-3" />
            </>
            )}

            {/* ACCOUNT section */}
            {!isTracerLocked && (
                <div className="px-5 pt-2 pb-1">
                <p className="text-xs font-semibold tracking-wide text-gray-400">ACCOUNT</p>
                </div>
            )}
            <div className="px-2">
            {filteredAccountBtns.map((item) => {
                const Icon = item.icon
                return (
                <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 mx-1 rounded-md text-gray-700 hover:bg-gray-50 transition border-l-[3px] border-transparent"
                >
                    <Icon className="h-5 w-5 text-gray-400" />
                    <span className="text-[15px]">{item.name}</span>
                </Link>
                )
            })}
            </div>
        </div>
      </div>

      <main>
        {isTracerLocked && (
            <div className="bg-red-500 text-white text-center py-3 px-4 font-semibold shadow-md flex items-center justify-center gap-2 z-40 relative">
                <Info className="w-5 h-5" />
                Action Required: You must complete the active Tracer Study Survey before you can access the rest of the portal.
            </div>
        )}
        {(usePage().props.flash?.justCompleted && usePage().props.flash?.completedSurveyType !== 'cect') && (
            <div className="bg-green-500 text-white text-center py-3 px-4 font-semibold shadow-md flex items-center justify-center gap-2 z-40 relative">
                <Info className="w-5 h-5" />
                Success! You may now access the rest of the portal.
            </div>
        )}
        {children}
      </main>
    </>
  )
}