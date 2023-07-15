import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class SEOServiceService {
  constructor(private title: Title, private meta: Meta) { }


  updateTitle(title: string) {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'og:title', content: title })
    this.meta.updateTag({ name: 'title', content: title })

  }

  updateOgUrl(url: string) {
    this.meta.updateTag({ name: 'og:url', content: url })
    this.meta.removeTag('rel="canonical"');
    this.meta.addTag({ rel: 'canonical', href: url });
  }

  updateDescription(desc: string) {
    this.meta.updateTag({ name: 'description', content: desc })
    this.meta.updateTag({ name: 'og:description', content: desc })
  }

}
