export class Banner {
  constructor(
    public adClient: string,
    public adSlot: number,
    public adFormat: string,
    public layout_key: string | any,
    public fullWidthResponsive: boolean,
  ) {
    this.adClient = adClient;
    this.adSlot = adSlot;
    this.adFormat = adFormat || 'auto';
    this.layout_key = layout_key;
    this.fullWidthResponsive = fullWidthResponsive || true;
  }
}
