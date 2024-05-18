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
      title: 'BombSquad Community Site | BCS',
      description:
        'Welcome to BombSquad Community Website, find plugins, servers & account details, downloads links and tools.',
      ogUrl: 'https://bombsquad-community.web.app/home',
    },
  },
  {
    path: 'mods',
    loadChildren: () =>
      import('./pages/mods/mods.component').then((m) => m.ModsModule),

    data: {
      title: 'Download Latest BombSquad Mods',
      description:
        'Download Community Mods, Plugins for all version of BombSquad and install them directly to workspace.',
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
      title: 'Download BombSquad Game',
      description:
        'Get the latest version of BombSquad for Android, Windows, Linux, and MacBook. Transform your mobile devices into gaming controllers with BombSquad Remote. Immerse yourself in VR battles with BombSquad VR.',
      ogUrl: 'https://bombsquad-community.web.app/download',
    },
  },
  //  {
  //   path:'servers',
  //   loadChildren:() => import ('./pages/servers/servers.component').then(m => m.ServersModule),
  //   data:{
  //     title:'BombSquad Public Server List',
  //     description:"BombSquad Public Servers List, find queue Id, IP address of all public servers ever hosted for bombsquad.",
  //     ogUrl:'https://bombsquad-community.web.app/servers'
  //   }
  // },
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
      title: 'Login BombSquad Account',
      description: 'BombSquad Account login page',
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
      title: 'BAPORT | Update plugin',
      description: 'Update plugins to latest version of game.',
      ogUrl: 'https://bombsquad-community.web.app/baport'
    }
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
