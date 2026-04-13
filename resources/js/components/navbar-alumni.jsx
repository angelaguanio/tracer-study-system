import React from 'react'
import logo from '../assets/logotracer.png';
import { Link, usePage, router } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "../components/ui/dropdown-menu"
import { Button } from './ui/button';


const navBtns = [
    {
        id: "home",
        name: "Home",
        href:"/alumna/home"
    },
    {
        id: "announcements",
        name: "Announcements",
        href: "/alumna/announcements"
    },
    {
        id: "questionnaire",
        name: "Questionnaire",
        href:"/alumna/questionnaire"
    },
    {
        id: "about",
        name: "About",
        href:"/alumna/about"
    },
    {
        id: "contact",
        name: "Contact us",
        href:"/alumna/contact"
    }
]
export default function NavbarAlumni({ children }) { 
    const { auth } = usePage().props
    const { url } = usePage()
    const user = auth?.user
    const currentPath = url.split('?')[0]

    function ProfileTemp() {
        if (!user) return null;
        return (
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
                    {user.initials}
                </div>
                <span>{user.first_name}</span>
            </div>
        )
    }

    return (
        <>
        <header className="flex justify-between items-center px-6 py-5 z-50 bg-navbar">
            {/* logo */}
            <div className='flex items-center space-x-3'>
                <img src={logo} className='h-12'/>
                <p className=''>Alumni Connect</p>
            </div>

            <nav>
                <ul className="flex items-center gap-5">
                    {navBtns.map((navigation) => {
                        const isActive = currentPath === navigation.href
                        return(
                            <li key={navigation.id}>
                                <Link href={navigation.href} 
                                    className={`text-navbar-text py-2 px-2 rounded-sm hover:bg-bluehover-btn hover:text-white transition ${isActive && 'font-semibold'}`}>
                                    {navigation.name}
                                </Link>
                            </li>
                        )
                    })}

                
                {/* dropdown option */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="nav">Alumni Affairs</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                        {/* currently static, add navigation func in link */}
                              <Link href={route('alumna.association')}>Alumni Association</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('alumna.office')}>Alumni Office</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ul>
        </nav>


            {/* profile */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="nav" className="py-6">
                        <ProfileTemp/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <Link>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.post(route('alumna.logout'))}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>

        
        </>
    )
}

