import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BannerModule } from 'src/app/shared/banner/banner.component';
import { SEOServiceService } from 'src/app/services/seoservice.service';

export interface ChatCommand {
  name: string;
  aliases: string[];
  category: string;
  shopCost: number;
  usage: string;
  description: string;
  examples: string[];
  file: string;
}

@Component({
  selector: 'app-chat-commands',
  templateUrl: './commands.html',
  styleUrls: ['./commands.scss'],
})
export class CommandsComponent implements OnInit {
  private readonly COMMANDS_RAW_URL =
    'https://raw.githubusercontent.com/imayushsaini/Bombsquad-Ballistica-Modded-Server/main/docs/commands.json';

  allCommands: ChatCommand[] = [];
  filteredCommands: ChatCommand[] = [];
  categories: string[] = ['All'];
  selectedCategory: string = 'All';
  searchQuery: string = '';
  loading: boolean = true;
  error: string | null = null;
  copiedUsage: string | null = null;

  constructor(
    private http: HttpClient,
    private _seoService: SEOServiceService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const rt = this.getChild(this.activatedRoute);
    rt.data.subscribe((data: any) => {
      this._seoService.updateTitle(data.title);
      this._seoService.updateOgUrl(data.ogUrl);
      this._seoService.updateDescription(data.description);
    });

    this.fetchCommands();
  }

  fetchCommands(): void {
    this.loading = true;
    this.error = null;

    this.http.get<ChatCommand[]>(this.COMMANDS_RAW_URL).subscribe({
      next: (data) => {
        this.allCommands = data;
        const uniqueCategories = Array.from(new Set(data.map((c) => c.category)));
        this.categories = ['All', ...uniqueCategories];
        this.filterCommands();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load chat commands from GitHub:', err);
        this.error = 'Failed to load chat commands. Please check network connection.';
        this.loading = false;
      },
    });
  }

  filterCommands(): void {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredCommands = this.allCommands.filter((cmd) => {
      const matchesCategory =
        this.selectedCategory === 'All' || cmd.category === this.selectedCategory;

      const matchesSearch =
        !query ||
        cmd.name.toLowerCase().includes(query) ||
        cmd.aliases.some((a) => a.toLowerCase().includes(query)) ||
        cmd.description.toLowerCase().includes(query) ||
        cmd.usage.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.filterCommands();
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedUsage = text;
      setTimeout(() => (this.copiedUsage = null), 2000);
    });
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}

const routes: Routes = [{ path: '', component: CommandsComponent }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    BannerModule,
  ],
  exports: [CommandsComponent],
  declarations: [CommandsComponent],
})
export class CommandsModule {}
