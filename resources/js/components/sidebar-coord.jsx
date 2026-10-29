import React, { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar
} from './ui/sidebar'
import { Link, usePage } from '@inertiajs/react'
import logo from '../assets/logotracer.webp'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { cn } from '@/lib/utils'
import CopySystemLinkButton from './CopySystemLinkButton'

export default function SidebarCoord({ navItemsCoord = [] }) {
  const { url, props } = usePage();
  const systemSettings = props?.system_settings || {};
  const appLogo = systemSettings.app_logo || logo;
  const appName = systemSettings.app_name || 'Alumni Connect';
  const path = url.split('?')[0];
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === 'collapsed' && !isMobile;

  const normalizePath = (href) => {
    if (!href || href === '#') return '';
    try {
      return new URL(href, window.location.origin).pathname;
    } catch {
      return href.split('?')[0];
    }
  };

  const isSubItemActive = (href) => {
    const target = normalizePath(href);
    if (!target) return false;
    return path === target || (target !== '/' && path.startsWith(target + '/'));
  };

  const isItemActive = (item) => {
    if (item.subItems) {
      return item.subItems.some(sub => isSubItemActive(sub.href));
    }
    if (item.href) {
      return isSubItemActive(item.href);
    }
    return false;
  };

  const [openItems, setOpenItems] = useState(() => {
    const initialOpen = {};
    navItemsCoord.forEach(item => {
      if (item.subItems) {
        initialOpen[item.id] = item.subItems.some(subItem => isSubItemActive(subItem.href));
      }
    });
    return initialOpen;
  });

  const toggleItem = (id) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Sidebar collapsible='icon' className='transition-all'>
      {/* header */}
      <SidebarHeader className='flex justify-center items-center py-5 transition-all duration-300'>
        <img src={appLogo} alt={appName} className='aspect-square h-20 w-auto object-contain transition-all duration-300 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-auto' />
        <h1 className='text-center px-2 truncate max-w-full group-data-[collapsible=icon]:hidden font-bruno text-sm font-semibold'> {appName} </h1>
      </SidebarHeader>

      {/* menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItemsCoord.map((item) => (
              <SidebarMenuItem key={item.id} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                {item.subItems ? (
                  isCollapsed ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          isActive={isItemActive(item)}
                          className='[&>svg]:size-5 py-5 my-1 justify-center cursor-pointer group-data-[collapsible=icon]:p-0 data-[state=open]:bg-white/20 data-[state=open]:backdrop-blur-md'
                        >
                          <item.icon className="size-5 shrink-0" />
                          <span className="sr-only">{item.name}</span>
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="right"
                        align="start"
                        sideOffset={12}
                        className="w-56 bg-white/95 text-slate-800 border border-slate-200 shadow-2xl backdrop-blur-md p-1.5 rounded-xl z-50 animate-in fade-in-50 zoom-in-95"
                      >
                        <DropdownMenuLabel className="font-bold text-slate-400 px-3 py-2 text-xs uppercase tracking-wider">
                          {item.name}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-100 my-1" />
                        {item.subItems.map((subItem) => {
                          const active = isSubItemActive(subItem.href);
                          return (
                            <DropdownMenuItem
                              key={subItem.name}
                              asChild
                              className={cn(
                                "cursor-pointer px-3 py-2 text-sm text-slate-600 rounded-lg transition-colors my-0.5 focus:bg-blue-50 focus:text-blue-600 hover:bg-blue-50 hover:text-blue-600",
                                active && "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                              )}
                            >
                              <Link href={subItem.href} className="w-full flex items-center justify-between">
                                <span>{subItem.name}</span>
                              </Link>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <>
                      <SidebarMenuButton
                        onClick={() => toggleItem(item.id)}
                        isActive={isItemActive(item)}
                        className='[&>svg]:size-5 py-5 my-1 justify-between cursor-pointer'
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="size-5 shrink-0" />
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
                                isActive={isSubItemActive(subItem.href)}
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
                  )
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={isCollapsed ? item.name : undefined}
                    isActive={isItemActive(item)}
                    className='[&>svg]:size-5 py-5 my-1 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center'
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5 shrink-0" />
                      <span className="group-data-[collapsible=icon]:sr-only">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <CopySystemLinkButton />
      </SidebarFooter>
    </Sidebar>
  );
}
