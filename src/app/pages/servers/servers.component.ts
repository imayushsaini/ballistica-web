import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';

import {
  PublicParty,
  PublicPartiesResponse,
  ServerListStats,
  ServersService,
} from 'src/app/services/servers.service';
import { SEOServiceService } from 'src/app/services/seoservice.service';
import { Banner } from 'src/app/models/model';
import { BannerModule } from 'src/app/shared/banner/banner.component';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = $localize`First page`;
  itemsPerPageLabel = $localize`Servers per page:`;
  lastPageLabel = $localize`Last page`;
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} of ${amountPages}`;
  }
}

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss'],
})
export class ServersComponent implements OnInit {
  // Search & Filter state
  searchQuery: string = '';
  selectedVersionGroup: string = 'all';
  selectedStatus: string = 'all'; // 'all' | 'active' | 'empty' | 'queue'
  selectedLanguage: string = 'all';
  sortBy: string = 'players'; // 'players' | 'name' | 'build' | 'capacity'

  // Data
  allParties: PublicParty[] = [];
  filteredParties: PublicParty[] = [];
  pagedParties: PublicParty[] = [];
  stats: ServerListStats | null = null;

  // UI state
  isLoading: boolean = true;
  isRefreshing: boolean = false;
  errorMessage: string = '';
  copiedAddressKey: string | null = null;
  copiedQueueKey: string | null = null;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 12;
  pageSizeOptions: number[] = [12, 24, 48, 96];

  // Ad Banner
  banner: Banner;

  constructor(
    private serversService: ServersService,
    private _seoService: SEOServiceService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.banner = new Banner(
      'ca-pub-7561471327972639',
      1688169659,
      'fluid',
      '-6t+ed+2i-1n-4w',
      true,
    );
  }

  ngOnInit(): void {
    const qParam = this.activatedRoute.snapshot.queryParamMap.get('q');
    const versionParam = this.activatedRoute.snapshot.queryParamMap.get('v');
    const statusParam = this.activatedRoute.snapshot.queryParamMap.get('status');

    if (qParam) this.searchQuery = qParam;
    if (versionParam) this.selectedVersionGroup = versionParam;
    if (statusParam) this.selectedStatus = statusParam;

    this.loadData();

    const rt = this.getChild(this.activatedRoute);
    rt.data.subscribe((data: any) => {
      this._seoService.updateTitle(
        data?.title || 'BombSquad Live Game Servers & Version Stats',
      );
      this._seoService.updateOgUrl(
        data?.ogUrl || 'https://bombsquad-community.web.app/public-servers',
      );
      this._seoService.updateDescription(
        data?.description ||
          'Live BombSquad public server list, online player count, version distribution statistics, and server queue IDs.',
      );
    });
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  loadData(isManualRefresh: boolean = false): void {
    if (isManualRefresh) {
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }
    this.errorMessage = '';

    this.serversService.getPublicParties().subscribe({
      next: (res: PublicPartiesResponse) => {
        this.isLoading = false;
        this.isRefreshing = false;

        const rawParties = Array.isArray(res?.parties) ? res.parties : [];

        // Preprocess server items with computed helper fields
        this.allParties = rawParties.map((p) => {
          const vInfo = this.serversService.getVersionInfo(p.b);
          const players = Number(p.s) || 0;
          const maxPlayers = Number(p.sm) || 0;

          let status: 'active' | 'empty' | 'full' = 'empty';
          if (players > 0) {
            status = maxPlayers > 0 && players >= maxPlayers ? 'full' : 'active';
          }

          const playerPercentage =
            maxPlayers > 0 ? Math.min(100, Math.round((players / maxPlayers) * 100)) : 0;

          return {
            ...p,
            cleanTitle: this.serversService.sanitizeServerName(p.n),
            versionLabel: vInfo.label,
            versionGroup: vInfo.group,
            exactVersion: vInfo.version,
            status,
            playerPercentage,
          };
        });

        // Compute aggregate statistics
        this.stats = this.serversService.computeStats(this.allParties, res);

        // Apply filters & pagination
        this.applyFiltersAndSort();
      },
      error: (err) => {
        console.error('Error fetching public servers list:', err);
        this.isLoading = false;
        this.isRefreshing = false;
        this.errorMessage =
          'Failed to load live server list from master server. Please try refreshing.';
      },
    });
  }

  applyFiltersAndSort(): void {
    const q = (this.searchQuery || '').trim().toLowerCase();

    this.filteredParties = this.allParties.filter((p) => {
      // 1. Search Query filter (matches Name, IP, Port, Queue ID, Language, Version)
      if (q) {
        const nameMatch = (p.cleanTitle || '').toLowerCase().includes(q) || (p.n || '').toLowerCase().includes(q);
        const ipMatch = (p.a || '').toLowerCase().includes(q);
        const portMatch = String(p.p || '').includes(q);
        const addressMatch = `${p.a || ''}:${p.p || ''}`.toLowerCase().includes(q);
        const queueMatch = (p.q || '').toLowerCase().includes(q);
        const langMatch = (p.l || '').toLowerCase().includes(q);
        const versionMatch = (p.versionLabel || '').toLowerCase().includes(q) || String(p.b).includes(q);

        if (!nameMatch && !ipMatch && !portMatch && !addressMatch && !queueMatch && !langMatch && !versionMatch) {
          return false;
        }
      }

      // 2. Version Group filter
      if (this.selectedVersionGroup !== 'all') {
        if (p.versionGroup !== this.selectedVersionGroup) {
          return false;
        }
      }

      // 3. Status filter
      if (this.selectedStatus === 'active' && p.status === 'empty') {
        return false;
      }
      if (this.selectedStatus === 'empty' && p.status !== 'empty') {
        return false;
      }
      if (this.selectedStatus === 'queue' && !p.qe) {
        return false;
      }

      // 4. Language filter
      if (this.selectedLanguage !== 'all') {
        const pLang = (p.l || 'English').toLowerCase();
        if (pLang !== this.selectedLanguage.toLowerCase()) {
          return false;
        }
      }

      return true;
    });

    // Sort filtered results
    this.filteredParties.sort((a, b) => {
      if (this.sortBy === 'players') {
        const diff = (b.s || 0) - (a.s || 0);
        if (diff !== 0) return diff;
        return (a.cleanTitle || '').localeCompare(b.cleanTitle || '');
      }
      if (this.sortBy === 'name') {
        return (a.cleanTitle || '').localeCompare(b.cleanTitle || '');
      }
      if (this.sortBy === 'build') {
        return (b.b || 0) - (a.b || 0);
      }
      if (this.sortBy === 'capacity') {
        return (b.sm || 0) - (a.sm || 0);
      }
      return 0;
    });

    // Update current page slice
    this.updatePagedSlice();
  }

  updatePagedSlice(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.pagedParties = this.filteredParties.slice(startIndex, startIndex + this.pageSize);
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.applyFiltersAndSort();
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.selectedVersionGroup = 'all';
    this.selectedStatus = 'all';
    this.selectedLanguage = 'all';
    this.sortBy = 'players';
    this.currentPage = 0;
    this.applyFiltersAndSort();
  }

  selectVersionFilter(groupName: string): void {
    this.selectedVersionGroup = this.selectedVersionGroup === groupName ? 'all' : groupName;
    this.currentPage = 0;
    this.applyFiltersAndSort();
  }

  selectStatusFilter(status: string): void {
    this.selectedStatus = this.selectedStatus === status ? 'all' : status;
    this.currentPage = 0;
    this.applyFiltersAndSort();
  }

  onSortChange(event: any): void {
    this.currentPage = 0;
    this.applyFiltersAndSort();
  }

  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedSlice();

    // Scroll smoothly to server list when page changes
    if (typeof window !== 'undefined') {
      const el = document.getElementById('server-results-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  copyAddress(party: PublicParty): void {
    const address = `${party.a}:${party.p}`;
    this.copyToClipboard(address, `${party.a}_${party.p}`);
  }

  copyQueueId(party: PublicParty): void {
    if (party.q) {
      this.copyToClipboard(party.q, party.q);
    }
  }

  private copyToClipboard(text: string, key: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        if (text.includes(':')) {
          this.copiedAddressKey = key;
          setTimeout(() => {
            if (this.copiedAddressKey === key) {
              this.copiedAddressKey = null;
            }
          }, 2000);
        } else {
          this.copiedQueueKey = key;
          setTimeout(() => {
            if (this.copiedQueueKey === key) {
              this.copiedQueueKey = null;
            }
          }, 2000);
        }
      });
    }
  }

  trackByParty(index: number, party: PublicParty): string {
    return `${party.a}:${party.p}:${party.b}:${party.s}`;
  }
}

const routes: Routes = [{ path: '', component: ServersComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    FormsModule,
    BannerModule,
  ],
  exports: [ServersComponent],
  declarations: [ServersComponent],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
export class ServersModule {}
