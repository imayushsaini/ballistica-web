import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/homepage/homepage.component').then(
        (m) => m.HomepageModule,
      ),
    data: {
      title: 'BombSquad Community — The Ultimate Modding Hub, Servers & Workspaces | BCS',
      description:
        'Explore 500+ BombSquad mods & Python plugins, manage Ballistica cloud workspaces, browse real-time public servers, and find official game & controller downloads.',
      ogUrl: 'https://bombsquad-community.web.app/home',
    },
  },
  {
    path: 'mods',
    loadChildren: () =>
      import('./pages/mods/mods.component').then((m) => m.ModsModule),

    data: {
      title: 'Download BombSquad Mods & Python Plugins | BCS Repository',
      description:
        'Download community mods, Python plugins, minigames, and character packs for all versions of BombSquad. Install directly to Ballistica workspaces with 1 click.',
      ogUrl: 'https://bombsquad-community.web.app/mods',
    },
  },
  {
    path: 'mods/:modId',
    loadChildren: () =>
      import('./pages/mod/mod.component').then((m) => m.ModPageModule),
  },
  {
    path: 'download',
    loadChildren: () =>
      import('./pages/downloads/downloads.component').then(
        (m) => m.DownloadModule,
      ),
    data: {
      title: 'Download BombSquad Game, Remote Controller & Dedicated Server Builds | BCS',
      description:
        'Download official BombSquad game for Android, Windows PC, Linux, macOS, and VR. Get BombSquad Remote controller app, dedicated server scripts, or browse community mods.',
      ogUrl: 'https://bombsquad-community.web.app/download',
    },
  },
  {
    path: 'public-servers',
    loadChildren: () =>
      import('./pages/servers/servers.component').then((m) => m.ServersModule),
    data: {
      title: 'BombSquad Live Game Servers & Version Stats | BCS',
      description:
        'Explore real-time active BombSquad public servers, live online player counts, version distribution statistics, and queue IDs.',
      ogUrl: 'https://bombsquad-community.web.app/public-servers',
    },
  },
  {
    path: 'servers',
    redirectTo: 'public-servers',
    pathMatch: 'full',
  },
  {
    path: 'players',
    loadChildren: () =>
      import('./pages/players/players.component').then((m) => m.PlayersModule),
    data: {
      title: 'BombSquad Players Account',
      description:
        'Search BombSquad Player Account Details, pb-id, Device accounts',
      ogUrl: 'https://bombsquad-community.web.app/players',
    },
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.component').then((m) => m.LoginModule),
    data: {
      title: 'Login to BombSquad Account | Ballistica V2 Workspace & Mod Sync',
      description:
        'Sign in with your Ballistica API token to install, update, and manage BombSquad community mods directly in your cloud workspaces.',
      ogUrl: 'https://bombsquad-community.web.app/login',
    },
  },
  {
    path: 'pluginmanager',
    loadChildren: () =>
      import('./pages/custompage/pluginmanager/pluginmanager').then(
        (m) => m.PluginManagerModule,
      ),

    data: {
      title: 'Download BombSquad Community Plugin Manager',
      description:
        'Simplify game modding and enhance your Bombsquad experience with the Bombsquad Plugin Manager. Access a wide range of community-created content, enjoy seamless integration, and take control of your plugin updates.',
      ogUrl: 'https://bombsquad-community.web.app/pluginmanager/',
    },
  },
  {
    path: 'support',
    loadChildren: () =>
      import('./pages/custompage/support/support').then((m) => m.SupportModule),

    data: {
      title: 'Donate BombSquad Community',
      description: 'Support US !',
      ogUrl: 'https://bombsquad-community.web.app/support',
    },
  },
  {
    path: 'gallery',
    loadChildren: () =>
      import('./pages/gallery/gallery.component').then((m) => m.GalleryModule),

    data: {
      title: 'Gallery | BombSquad',
      description:
        "Amazing Picture Collection of Bombsquad, Directly from Eric's Gallery",
      ogUrl: 'https://bombsquad-community.web.app/gallery',
    },
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule),
    data: {
      title: 'Blog | BombSquad',
      description:
        'Discover insightful articles on various topics, modding tutorials, and latest updates around BombSquad',
      ogUrl: 'https://bombsquad-community.web.app/blog',
    },
  },
  {
    path: 'free-server',
    loadChildren: () =>
      import('./pages/custompage/free-server/free-server').then(
        (m) => m.FreeServerModule,
      ),
    data: {
      title: 'Create Free Server | BCS',
      description:
        'Fully Managed BombSquad Server Hosting as a Service, Absolutely free !',
      ogUrl: 'https://bombsquad-community.web.app/free-server',
    },
  },
  {
    path: 'baport',
    loadChildren: () => import("./pages/baport/baport.component").then((m) => m.BaPortModule),
    data: {
      title: 'BAPORT | Update plugin to API 8',
      description: 'Update plugins to latest version of game.',
      ogUrl: 'https://bombsquad-community.web.app/baport'
    }
  },
  {
    path: 'commands',
    loadChildren: () =>
      import('./pages/custompage/commands/commands').then(
        (m) => m.CommandsModule,
      ),
    data: {
      title: 'BombSquad Chat Commands Documentation | BCS',
      description:
        'Browse and search all in-game chat commands, syntax, player permissions, and examples for BombSquad Ballistica modded server.',
      ogUrl: 'https://bombsquad-community.web.app/commands',
    },
  },
  {
    path: 'chat-commands',
    redirectTo: 'commands',
    pathMatch: 'full',
  },
  {
    path: 'workspaces',
    loadChildren: () =>
      import('./pages/workspaces/workspaces.component').then(
        (m) => m.WorkspacesModule,
      ),
    data: {
      title: 'Ballistica Workspaces Manager | BCS',
      description:
        'Manage Ballistica cloud workspaces, sync game mods, upload Python plugins, browse workspace files, and organize BombSquad scripts.',
      ogUrl: 'https://bombsquad-community.web.app/workspaces',
    },
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
