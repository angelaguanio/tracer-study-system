import React, { useState } from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from './ui/sidebar'
import { Link, usePage } from '@inertiajs/react'
import logo from '../assets/logotracer.webp'
import { ChevronDown } from 'lucide-react'

export default function SidebarAdmin({ navItems = [] }) {
  const {url} = usePage();
  const path = url.split('?')[0];
  const [openItems, setOpenItems] = useState({ analytics: true });

  const toggleItem = (id) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Sidebar collapsible='icon' className='transition-all'>
      {/* header */}
      <SidebarHeader className='flex justify-center items-center py-5 transition-all duration-300'>
        <img src={logo} className='aspect-square h-25 w-30 transition-all duration-300 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-15' />
        <h1 className=' truncate group-data-[collapsible=icon]:hidden font-bruno'> Alumni Connect </h1>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                {item.subItems ? (
                  <>
                    <SidebarMenuButton
                      onClick={() => toggleItem(item.id)}
                      isActive={
                        item.id === 'analytics'
                          ? path.includes('/analytics')
                          : path.startsWith(item.href)
                      }
                      className='[&>svg]:size-5 py-5 my-1 justify-between'
                    >
                      <div className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openItems[item.id] ? 'rotate-180' : ''}`} />
                    </SidebarMenuButton>
                    {openItems[item.id] && (
                      <SidebarMenuSub className="border-none">
                        {item.subItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={path === subItem.href}
                            >
                              <Link href={subItem.href}>
                                <span>{subItem.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </>
                ) : (
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.id === 'analytics'
                        ? path.includes('/analytics')
                        : item.id === 'surveys'
                          ? path === item.href || (path.startsWith(item.href + '/') && !path.includes('/analytics'))
                          : path === item.href || path.startsWith(item.href + '/')
                    }
                    className='[&>svg]:size-5 py-5 my-1'
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
