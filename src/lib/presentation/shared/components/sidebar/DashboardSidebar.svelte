<script lang="ts">
  import Sidebar from './Sidebar.svelte';
  import SidebarBrand from './SidebarBrand.svelte';
  import SidebarBranchSwitcher from './SidebarBranchSwitcher.svelte';
  import SidebarNav from './SidebarNav.svelte';
  import SidebarGroup from './SidebarGroup.svelte';
  import SidebarItem from './SidebarItem.svelte';
  import SidebarExpandable from './SidebarExpandable.svelte';
  import SidebarProfile from './SidebarProfile.svelte';
  import {
    navigationConfig,
    type NavigationExpandable,
    type NavigationItem
  } from '../../configs/navigation';
  import { page } from '$app/state';

  interface Branch {
    id: string;
    name: string;
    short: string;
    color: string;
  }

  interface Company {
    id: string;
    name: string;
    short: string;
    color: string;
    branches: Branch[];
  }

  interface UserProfile {
    name: string;
    role: string;
    initials: string;
  }

  let {
    isCollapsed = $bindable(false),
    companies = [],
    activeBranch = $bindable(),
    user,
    onProfileClick = () => {},
    onLogoutClick = () => {}
  } = $props<{
    isCollapsed?: boolean;
    companies?: Company[];
    activeBranch?: Branch;
    user: UserProfile;
    onProfileClick?: () => void;
    onLogoutClick?: () => void;
  }>();

  // Helper to check if an expandable group contains the active subitem
  function isGroupActive(item: NavigationExpandable): boolean {
    return item.subItems.some(
      (sub) =>
        page.url.pathname === sub.href ||
        page.url.pathname.includes(sub.href) ||
        page.url.hash.includes(sub.href.replace('#', ''))
    );
  }

  // Helper to determine if a regular item is active
  function isItemActive(href: string): boolean {
    if (href === '/') {
      return page.url.pathname === '/';
    }
    return page.url.pathname.startsWith(href) || page.url.hash.includes(href.replace('#', ''));
  }

  // Helper to check if an item is expandable
  function isExpandable(item: NavigationItem | NavigationExpandable): item is NavigationExpandable {
    return 'subItems' in item;
  }
</script>

<Sidebar bind:isCollapsed>
  <SidebarBrand />
  {#if companies.length > 0}
    <SidebarBranchSwitcher {companies} bind:activeBranch />
  {/if}

  <SidebarNav>
    {#each navigationConfig as node, i (('title' in node ? node.title : node.label) || i)}
      {#if 'title' in node}
        <SidebarGroup title={node.title}>
          {#each node.items as item (item.label)}
            {#if isExpandable(item)}
              <SidebarExpandable label={item.label} icon={item.icon} isActive={isGroupActive(item)}>
                {#each item.subItems as sub (sub.label)}
                  <SidebarItem
                    label={sub.label}
                    isSubItem
                    href={sub.href}
                    isActive={isItemActive(sub.href)}
                  />
                {/each}
              </SidebarExpandable>
            {:else}
              <SidebarItem
                label={item.label}
                icon={item.icon}
                href={item.href}
                isActive={isItemActive(item.href)}
              />
            {/if}
          {/each}
        </SidebarGroup>
      {:else if isExpandable(node)}
        <SidebarExpandable label={node.label} icon={node.icon} isActive={isGroupActive(node)}>
          {#each node.subItems as sub (sub.label)}
            <SidebarItem
              label={sub.label}
              isSubItem
              href={sub.href}
              isActive={isItemActive(sub.href)}
            />
          {/each}
        </SidebarExpandable>
      {:else}
        <SidebarItem
          label={node.label}
          icon={node.icon}
          href={node.href}
          isActive={isItemActive(node.href)}
        />
      {/if}
    {/each}
  </SidebarNav>

  <SidebarProfile {user} {onProfileClick} {onLogoutClick} />
</Sidebar>
