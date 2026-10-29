import React, { useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import { toast } from 'sonner'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar'

export const SURVEY_INVITE_MESSAGE = [
  '🎓 Calling All WUP Alumni!',
  '',
  'Be part of WUP’s continued growth by completing the GATE Alumni Tracer Survey. Your participation helps improve university programs, support current students, and strengthen our alumni community.',
  '',
  '💼 Stay connected with university announcements and job opportunities through GATE!',
  '',
  '🔗 Access the link provided and complete the survey. Your experience matters, and your participation makes a difference!',
].join('\n')

/**
 * Copies text to the clipboard, falling back to execCommand for
 * non-secure contexts (e.g. plain HTTP on a LAN IP) where
 * navigator.clipboard is unavailable.
 */
async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    return
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(textarea)
  if (!ok) throw new Error('Copy command failed')
}

/**
 * CopySystemLinkButton
 *
 * Sidebar button that copies the alumni invitation message together
 * with the system link, ready to paste into chats / social media.
 */
export default function CopySystemLinkButton() {
  const [copied, setCopied] = useState(false)
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === 'collapsed' && !isMobile

  const handleCopy = async () => {
    const link = `${window.location.origin}/`
    const text = `${SURVEY_INVITE_MESSAGE}\n\n${link}`
    try {
      await copyToClipboard(text)
      setCopied(true)
      toast.success('Invitation message and link copied!', { duration: 2500 })
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error('Unable to copy. Please try again.')
    }
  }

  const Icon = copied ? Check : Link2

  return (
    <SidebarMenu>
      <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <SidebarMenuButton
          type="button"
          onClick={handleCopy}
          tooltip={isCollapsed ? 'Copy Survey Link' : undefined}
          className="[&>svg]:size-5 py-5 my-1 cursor-pointer border border-dashed border-current/30 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-none"
        >
          <Icon className="size-5 shrink-0" />
          <span className="group-data-[collapsible=icon]:sr-only">
            {copied ? 'Copied!' : 'Copy Survey Link'}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

