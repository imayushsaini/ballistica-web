import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SEOServiceService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private dom: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  updateTitle(title: string) {
    if (title) {
      this.title.setTitle(title);
      this.meta.updateTag({ name: 'title', content: title });
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ name: 'twitter:title', content: title });
    }
  }

  updateOgUrl(url: string) {
    if (url) {
      this.meta.updateTag({ property: 'og:url', content: url });
      this.meta.updateTag({ name: 'twitter:url', content: url });
      this.updateCanonicalUrl(url);
    }
  }

  updateCanonicalUrl(url: string) {
    if (url && this.dom && this.dom.head) {
      let link: HTMLLinkElement | null = this.dom.querySelector("link[rel='canonical']");
      if (!link) {
        link = this.dom.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.dom.head.appendChild(link);
      }
      link.setAttribute('href', url);
    }
  }

  updateDescription(desc: string) {
    if (desc) {
      this.meta.updateTag({ name: 'description', content: desc });
      this.meta.updateTag({ property: 'og:description', content: desc });
      this.meta.updateTag({ name: 'twitter:description', content: desc });
    }
  }

  updateKeywords(keywords: string) {
    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }
  }

  updateOgImage(imageUrl: string) {
    if (imageUrl) {
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    }
  }
}
