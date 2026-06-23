import { useState } from 'react'
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
  ClipboardList, Megaphone, Home, Info, Phone, Users, Building2, ChevronRight
} from 'lucide-react'

const navBtns = [
  { id: "questionnaire", name: "Questionnaire", href: "/alumna/questionnaire", icon: ClipboardList },
  { id: "announcements", name: "Announcements", href: "/alumna/announcements", icon: Megaphone },
  { id: "home", name: "Home", href: "/alumna/home", icon: Home },
  { id: "about", name: "About", href: "/alumna/about", icon: Info },
  { id: "contact", name: "Contact us", href: "/alumna/contact", icon: Phone },
]

const affairsBtns = [
  { id: "association", name: "Alumni Association", href: route('alumna.association'), icon: Users },
  { id: "office", name: "Alumni Office", href: route('alumna.office'), icon: Building2 },
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
  const currentPath = url.split('?')[0]
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="relative flex justify-between items-center px-5 md:px-6 py-4 md:py-5 z-50 bg-navbar">
        <div className='flex items-center space-x-3'>
          <img src={logo} className='h-10 md:h-12' alt="Alumni Connect logo" />
          <p className="font-bruno lg:text-md text-sm">Alumni Connect</p>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-5">
            {navBtns.map((navigation) => {
              const isActive = currentPath === navigation.href
              return (
                <li key={navigation.id}>
                  <Link
                    href={navigation.href}
                    className={`text-navbar-text py-2 px-2 rounded-sm hover:bg-bluehover-btn hover:text-white transition ${isActive ? 'font-semibold' : ''}`}
                  >
                    {navigation.name}
                  </Link>
                </li>
              )
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="nav">Alumni Affairs</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {affairsBtns.map((item) => (
                  <DropdownMenuItem key={item.id} asChild>
                    <Link href={item.href}>{item.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </ul>
        </nav>

        {/* Profile dropdown - desktop only */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="nav" className="hidden md:flex py-6">
              <ProfileTemp user={user} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {accountBtns.map((item) => {
              const Icon = item.icon
              return (
                <DropdownMenuItem key={item.id} asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hamburger - mobile only, right side */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 mr-2 text-navbar-text cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile full-screen overlay menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-white overflow-y-auto">
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-4 bg-navbar">
            <div className='flex items-center gap-3'>
              <img src={logo} className="h-10" alt="Alumni Connect logo" />
              <p className="font-bruno text-sm">Alumni Connect</p>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className=" bg-gray-300/40 rounded-full p-2 transition mr-2 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 " />
            </button>
          </div>

          {/* Profile card */}
          <Link
            href={route('alumna.profile')}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-5 py-4 border-b border-gray-100"
          >
            <div className="h-11 w-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {getInitials(user?.first_name, user?.last_name)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-[15px]">{user?.first_name} {user?.last_name}</p>
              <p className="text-sm text-gray-500">{user?.courses}</p>
            </div>
          </Link>

          {/* MAIN section */}
          <div className="px-5 pt-5 pb-1">
            <p className="text-xs font-semibold tracking-wide text-gray-400">MAIN</p>
          </div>
          <div className="px-2">
            {[...navBtns, ...affairsBtns].map((item) => {
              const Icon = item.icon
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

          <div className="border-t border-gray-100 my-3" />

          {/* ACCOUNT section */}
          <div className="px-5 pt-2 pb-1">
            <p className="text-xs font-semibold tracking-wide text-gray-400">ACCOUNT</p>
          </div>
          <div className="px-2 pb-6">
            {accountBtns.map((item) => {
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
      )}

      <main>
        {children}
      </main>
    </>
  )
}