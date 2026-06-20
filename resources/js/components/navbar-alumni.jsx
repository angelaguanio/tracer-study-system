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
import {User, Mail, LogOut} from 'lucide-react'

const navBtns = [
  { id: "questionnaire", name: "Questionnaire", href:"/alumna/questionnaire" },
  { id: "announcements", name: "Announcements", href: "/alumna/announcements" },
  { id: "home", name: "Home", href:"/alumna/home" },
  { id: "about", name: "About", href:"/alumna/about" },
  { id: "contact", name: "Contact us", href:"/alumna/contact" }
]

// FIX: Added { children } to the arguments
export default function NavbarAlumni({ children }) { 
  const { auth } = usePage().props
  const { url } = usePage()
  const user = auth?.user
  const currentPath = url.split('?')[0]

  return (
    <>
      <header className="flex justify-between items-center px-6 py-5 z-50 bg-navbar">
        <div className='flex items-center space-x-3'>
          <img src={logo} className='h-12' alt="Alumni Connect logo" />
          <p>Alumni Connect</p>
        </div>

        <nav>
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
                <DropdownMenuItem asChild>
                  <Link href={route('alumna.association')}>Alumni Association</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={route('alumna.office')}>Alumni Office</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ul>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="nav" className="py-6 ">
              <ProfileTemp user={user} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* profile */}
            <DropdownMenuItem asChild>
              <Link
                href={route('alumna.profile')}
                className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
            </Link>
            </DropdownMenuItem>
              {/* inquiries */}
            <DropdownMenuItem asChild>
              <Link href={route('alumna.inquiries.index')}
              className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Inquiries</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href={route('alumna.logout')} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* FIX: Added this main tag to render the page content */}
      <main>
        {children}
      </main>
    </>
  )
}