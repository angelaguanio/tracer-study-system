import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Link, usePage } from '@inertiajs/react'
import logo from '../assets/logotracer.png'

export default function SidebarAdmin({ navItems = [] }) {
  const {url} = usePage();

  return (
    <Sidebar collapsible='icon' className='transition-all'>
    {/* header */}
      <SidebarHeader className='flex justify-center items-center py-5 transition-all duration-300'>
        <img src={logo} className='aspect-square h-25 w-30 transition-all duration-300 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-15' />
        <h1 className=' truncate group-data-[collapsible=icon]:hidden font-bruno'> Alumni Connect </h1>
      </SidebarHeader>

    {/* menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item)=> (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton 
                  asChild 
                  isActive={
                    item.id === 'analytics' 
                      ? url.includes('/analytics')
                      : item.id === 'surveys'
                        ? url === item.href || (url.startsWith(item.href + '/') && !url.includes('/analytics'))
                        : url === item.href || url.startsWith(item.href + '/')
                  } 
                  className='[&>svg]:size-5 py-5 my-1'
                >
                  <Link href={item.href}>
                    <item.icon/>
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
