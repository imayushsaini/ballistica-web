import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API = 'https://mods.69420555.xyz';

export interface PublicParty {
  n: string; // Party / server name
  a: string; // IP address
  p: number; // Port
  b: number; // Build number
  s: number; // Current players online
  sm: number; // Max players capacity
  l?: string; // Language
  sa?: string; // External announcement / Discord link
  q?: string; // Queue ID
  qe?: boolean; // Queue enabled
  ac?: boolean; // Access control
  f?: number; // Physics / frame speed
  ml?: string; // Mod list
  pd?: number; // Ping delay
  pi?: number; // Ping interval

  // Computed helper fields for UI
  cleanTitle?: string;
  versionLabel?: string;
  versionGroup?: string;
  exactVersion?: string;
  status?: 'active' | 'empty' | 'full';
  playerPercentage?: number;
}

export interface PublicPartiesResponse {
  cached: boolean;
  cacheSource: string;
  cachedAt: string;
  count: number;
  parties: PublicParty[];
}

export interface VersionRange {
  name: string;
  min: number;
  max: number;
  label: string;
  color?: string;
}

export interface VersionStat {
  name: string;
  label: string;
  servers: number;
  players: number;
  percentage: number;
  color?: string;
}

export interface ServerListStats {
  totalServers: number;
  totalPlayers: number;
  totalCapacity: number;
  queueEnabledCount: number;
  activeServersCount: number;
  emptyServersCount: number;
  dominantVersion: string;
  dominantVersionPercentage: number;
  versionStats: VersionStat[];
  languages: { name: string; count: number }[];
  cachedAtFormatted: string;
  cacheSource: string;
}

export const VERSION_RANGES: VersionRange[] = [
  { name: '1.8.x', min: 22871, max: 999999, label: 'v1.8.x (22871+)', color: '#818cf8' },
  { name: '1.7.5x', min: 22709, max: 22870, label: 'v1.7.5x (22709-22870)', color: '#6366f1' },
  { name: '1.7.4x', min: 22400, max: 22708, label: 'v1.7.4x (22400-22708)', color: '#3b82f6' },
  { name: '1.7.3x', min: 22000, max: 22399, label: 'v1.7.3x (22000-22399)', color: '#0ea5e9' },
  { name: '1.7.2x (API 8)', min: 21140, max: 21999, label: 'v1.7.2x - API 8', color: '#06b6d4' },
  { name: '1.7.x (API 7)', min: 20591, max: 21139, label: 'v1.7.x - API 7', color: '#10b981' },
  { name: '1.6.x', min: 20357, max: 20590, label: 'v1.6.x (20357-20590)', color: '#f59e0b' },
  { name: '1.5.x', min: 20001, max: 20356, label: 'v1.5.x (20001-20356)', color: '#ec4899' },
  { name: '1.4.x', min: 14200, max: 14399, label: 'v1.4.x (14200-14399)', color: '#a855f7' },
];

export const EXACT_BUILD_VERSIONS: Record<number, string> = {
  22997: '1.8.0',
  22870: '1.7.63',
  22837: '1.7.62',
  22772: '1.7.61',
  22709: '1.7.60',
  22677: '1.7.59',
  22669: '1.7.58',
  22660: '1.7.57',
  22655: '1.7.56',
  22649: '1.7.55',
  22634: '1.7.54',
  22597: '1.7.53',
  22572: '1.7.52',
  22569: '1.7.51',
  22533: '1.7.50',
  22524: '1.7.49',
  22512: '1.7.48',
  22495: '1.7.47',
  22472: '1.7.46',
  22465: '1.7.45',
  22451: '1.7.44',
  22406: '1.7.43',
  22402: '1.7.42',
  22382: '1.7.41',
  22379: '1.7.40',
  22353: '1.7.39',
  22318: '1.7.38',
  22304: '1.7.37',
  21944: '1.7.36',
  21889: '1.7.35',
  21823: '1.7.34',
  21795: '1.7.33',
  21741: '1.7.32',
  21727: '1.7.31',
  21697: '1.7.30',
  21619: '1.7.29',
  21599: '1.7.28',
  21282: '1.7.27',
  21259: '1.7.26',
  21211: '1.7.25',
  21199: '1.7.24',
  21178: '1.7.23',
  21165: '1.7.22',
  21152: '1.7.21',
  21140: '1.7.20',
  20997: '1.7.19',
  20989: '1.7.18',
  20983: '1.7.17',
  20969: '1.7.16',
  20960: '1.7.15',
  20958: '1.7.14',
  20919: '1.7.13',
  20914: '1.7.12',
  20909: '1.7.11',
  20895: '1.7.10',
  20880: '1.7.9',
  20871: '1.7.8',
  20868: '1.7.7',
  20687: '1.7.6',
  20672: '1.7.5',
  20646: '1.7.4',
  20634: '1.7.3',
  20620: '1.7.2',
  20597: '1.7.1',
  20591: '1.7.0',
  20567: '1.6.12',
  20539: '1.6.11',
  20511: '1.6.10',
  20486: '1.6.9',
  20458: '1.6.8',
  20436: '1.6.7',
  20394: '1.6.6',
  20382: '1.6.4',
  20366: '1.6.3',
  20365: '1.6.2',
  20362: '1.6.1',
  20357: '1.6.0',
  20246: '1.5.29',
  20239: '1.5.28',
  20238: '1.5.27',
  20217: '1.5.26',
  20176: '1.5.25',
  20163: '1.5.24',
  20146: '1.5.23',
  20139: '1.5.22',
  20138: '1.5.21',
  20126: '1.5.20',
  20123: '1.5.19',
  20108: '1.5.18',
  20102: '1.5.17',
  20099: '1.5.16',
  20096: '1.5.14',
  20095: '1.5.13',
  20087: '1.5.12',
  20083: '1.5.11',
  20082: '1.5.9',
  20079: '1.5.8',
  20077: '1.5.7',
  20075: '1.5.6',
  20069: '1.5.5',
  20067: '1.5.4',
  20065: '1.5.3',
  20063: '1.5.2',
  20062: '1.5.1',
  20001: '1.5.0',
  14377: '1.4.155',
  14371: '1.4.151',
  14369: '1.4.150',
  14365: '1.4.148',
  14364: '1.4.147',
  14351: '1.4.145',
  14350: '1.4.144',
  14347: '1.4.143',
  14346: '1.4.142',
  14344: '1.4.141',
  14343: '1.4.140',
  14340: '1.4.139',
  14336: '1.4.138',
  14331: '1.4.137',
  14327: '1.4.136',
  14324: '1.4.135',
  14322: '1.4.134',
  14318: '1.4.133',
  14316: '1.4.132',
  14315: '1.4.131',
  14313: '1.4.130',
  14307: '1.4.126',
  14306: '1.4.125',
  14302: '1.4.121',
  14298: '1.4.118',
  14286: '1.4.111',
  14280: '1.4.106',
  14268: '1.4.101',
  14264: '1.4.100',
  14252: '1.4.99',
  14248: '1.4.98',
  14247: '1.4.97',
  14246: '1.4.97',
  14244: '1.4.97',
  14242: '1.4.96',
  14241: '1.4.96',
  14240: '1.4.95',
  14236: '1.4.95',
  14234: '1.4.95',
  14233: '1.4.95',
};

const BROWSER_UNICODE_MAP: Record<string, string> = {
  '\\ue043': '👑',
  '\\ue01e': '💣',
  '\\ue049': '🛡️',
  '\\ue030': '🎮',
  '\\ue020': '🕹️',
  '\\ue063': '🏷️',
  '\\use': '🐼',
};

@Injectable({
  providedIn: 'root',
})
export class ServersService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch live public servers list from the Master Server API.
   */
  getPublicParties(): Observable<PublicPartiesResponse> {
    return this.http.get<PublicPartiesResponse>(`${API}/public-parties`);
  }

  /**
   * Legacy endpoint fallback.
   */
  getServers(size: any, page: any, key: string): Observable<any> {
    return this.http.get(`${API}/allservers`, {
      params: { page: page, size: size, key: key },
    });
  }

  /**
   * Resolve BombSquad version information for a build number.
   */
  getVersionInfo(buildNumber: number): {
    version: string;
    group: string;
    label: string;
    color: string;
  } {
    const b = Number(buildNumber);
    if (isNaN(b)) {
      return {
        version: 'Unknown',
        group: 'Unknown',
        label: 'Unknown Version',
        color: '#64748b',
      };
    }

    const exact = EXACT_BUILD_VERSIONS[b];

    for (const range of VERSION_RANGES) {
      if (b >= range.min && b <= range.max) {
        return {
          version: exact ? `${exact} (${range.name})` : range.name,
          group: range.name,
          label: range.label,
          color: range.color || '#6366f1',
        };
      }
    }

    return {
      version: exact || `Build ${b}`,
      group: `Build ${b}`,
      label: exact ? `v${exact} (Build ${b})` : `Build ${b}`,
      color: '#64748b',
    };
  }

  /**
   * Clean server party name and replace internal BombSquad emoji codes with clean web characters.
   */
  sanitizeServerName(name: string): string {
    if (!name) return 'Unnamed Server';
    let clean = name;
    for (const [code, emoji] of Object.entries(BROWSER_UNICODE_MAP)) {
      clean = clean.split(code).join(emoji);
    }
    // Also remove potential leftover unicode escape sequences
    clean = clean.replace(/\\u[0-9a-fA-F]{4}/g, '').trim();
    return clean || 'Unnamed Server';
  }

  /**
   * Process raw public parties response into detailed statistics.
   */
  computeStats(parties: PublicParty[], response?: PublicPartiesResponse): ServerListStats {
    const totalServers = parties.length;
    let totalPlayers = 0;
    let totalCapacity = 0;
    let queueEnabledCount = 0;
    let activeServersCount = 0;
    let emptyServersCount = 0;

    const versionMap: Record<string, { servers: number; players: number; label: string; color?: string }> = {};
    const langMap: Record<string, number> = {};

    // Initialize version ranges in order
    for (const range of VERSION_RANGES) {
      versionMap[range.name] = {
        servers: 0,
        players: 0,
        label: range.label,
        color: range.color,
      };
    }

    for (const p of parties) {
      const players = Number(p.s) || 0;
      const capacity = Number(p.sm) || 0;

      totalPlayers += players;
      totalCapacity += capacity;

      if (players > 0) {
        activeServersCount++;
      } else {
        emptyServersCount++;
      }

      if (p.qe) {
        queueEnabledCount++;
      }

      const lang = (p.l || 'English').trim();
      langMap[lang] = (langMap[lang] || 0) + 1;

      const vInfo = this.getVersionInfo(p.b);
      if (!versionMap[vInfo.group]) {
        versionMap[vInfo.group] = {
          servers: 0,
          players: 0,
          label: vInfo.label,
          color: vInfo.color,
        };
      }
      versionMap[vInfo.group].servers++;
      versionMap[vInfo.group].players += players;
    }

    // Build version stats array
    const versionStats: VersionStat[] = Object.entries(versionMap)
      .filter(([_, data]) => data.servers > 0)
      .map(([name, data]) => ({
        name,
        label: data.label,
        servers: data.servers,
        players: data.players,
        percentage: totalServers > 0 ? (data.servers / totalServers) * 100 : 0,
        color: data.color,
      }))
      .sort((a, b) => b.servers - a.servers);

    // Dominant version
    const dominant = versionStats[0] || { label: 'v1.7.5x', percentage: 0 };

    // Languages list
    const languages = Object.entries(langMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const cachedAtFormatted = response?.cachedAt
      ? new Date(response.cachedAt).toLocaleString()
      : 'Just now';

    return {
      totalServers,
      totalPlayers,
      totalCapacity,
      queueEnabledCount,
      activeServersCount,
      emptyServersCount,
      dominantVersion: dominant.label,
      dominantVersionPercentage: dominant.percentage,
      versionStats,
      languages,
      cachedAtFormatted,
      cacheSource: response?.cacheSource || 'memory',
    };
  }
}
