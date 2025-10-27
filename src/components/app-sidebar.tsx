import * as React from "react"
import { ChevronRight } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {useLocation} from "react-router";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Candles Panel",
      url: "/candles",
      items: [
        {
          title: "Add new candle",
          url: "/candles/new",
        },
        {
          title: "All candles",
          url: "/candles",
        },
      ],
    },
    {
      // title: "Products Panel",
      // url: "#",
      // items: [
      //   {
      //     title: "All Product",
      //     url: "#",
      //   },
      // ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const location = useLocation()
    return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items?.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                                    <a href={item.url}>{item.title}</a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
