"use strict";(self.webpackChunkballistica_web=self.webpackChunkballistica_web||[]).push([[146],{146:(x,h,o)=>{o.r(h),o.d(h,{MyCustomPaginatorIntl:()=>$,PlayersComponent:()=>C,PlayersModule:()=>E});var c=o(9417),g=o(8498),P=o(1413),m=o(9631),u=o(9183),d=o(6467),f=o(9213),b=o(6440),p=o(177),t=o(4438),v=o(1626);new v.Lr({"Content-Type":"application/json"});let y=(()=>{class n{constructor(e){this.http=e}getPlayers(e){return(!e||""==e)&&(e="Andro"),this.http.get("https://mods.ballistica.workers.dev/player",{params:{key:e}})}static#t=this.\u0275fac=function(a){return new(a||n)(t.KVO(v.Qq))};static#e=this.\u0275prov=t.jDH({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var M=o(9674);function O(n,s){if(1&n){const e=t.RV6();t.j41(0,"button",10),t.bIt("click",function(){t.eBV(e);const i=t.XpG();return t.Njj(i.resetSearch())}),t.j41(1,"mat-icon"),t.EFF(2,"close"),t.k0s()()}}function S(n,s){1&n&&(t.j41(0,"div",11),t.nrm(1,"mat-spinner"),t.k0s())}function j(n,s){if(1&n&&(t.j41(0,"span"),t.EFF(1),t.k0s()),2&n){const e=s.$implicit;t.R7$(),t.SpI("",e,", ")}}function I(n,s){if(1&n&&(t.j41(0,"div",12)(1,"div",13)(2,"div",14)(3,"h5",15),t.EFF(4),t.k0s(),t.j41(5,"label"),t.EFF(6,"Name:"),t.k0s(),t.EFF(7),t.nrm(8,"br"),t.j41(9,"label"),t.EFF(10,"Pbid: "),t.k0s(),t.EFF(11),t.j41(12,"label"),t.EFF(13,"Character:"),t.k0s(),t.EFF(14),t.nrm(15,"br"),t.j41(16,"label"),t.EFF(17,"Created On:"),t.k0s(),t.EFF(18),t.nrm(19,"br"),t.j41(20,"label"),t.EFF(21,"Accounts: "),t.k0s(),t.DNE(22,j,2,1,"span",16),t.k0s()()()),2&n){const e=s.$implicit,a=t.XpG();t.R7$(4),t.SpI(" ",e.accounts[0]," "),t.R7$(3),t.SpI(" ",e.names.toString()," "),t.R7$(4),t.SpI(" ",e.pbid," ,"),t.R7$(3),t.SpI(" ",e.character," "),t.R7$(4),t.SpI(" ",a.getdate(e.createdOn)," "),t.R7$(4),t.Y8G("ngForOf",e.accounts)}}let $=(()=>{class n{constructor(){this.changes=new P.B,this.firstPageLabel=$localize`First page`,this.itemsPerPageLabel=$localize`Items per page:`,this.lastPageLabel=$localize`Last page`,this.nextPageLabel="Next page",this.previousPageLabel="Previous page"}getRangeLabel(e,a,i){if(0===i)return $localize`Page 1 of 1`;const r=Math.ceil(i/a);return $localize`Page ${e+1} of ${r}`}static#t=this.\u0275fac=function(a){return new(a||n)};static#e=this.\u0275prov=t.jDH({token:n,factory:n.\u0275fac})}return n})(),C=(()=>{class n{constructor(e,a,i,r){this.playersService=e,this.router=a,this._seoService=i,this.activatedRoute=r,this.value="",this.totalRows=0,this.pageSize=10,this.currentPage=0,this.pageSizeOptions=[10,50,100],this.isLoading=!0}ngOnInit(){this.loadData(),this.getChild(this.activatedRoute).data.subscribe(a=>{this._seoService.updateTitle(a.title),this._seoService.updateOgUrl(a.ogUrl),this._seoService.updateDescription(a.description)})}getChild(e){return e.firstChild?this.getChild(e.firstChild):e}loadData(){this.playersService.getPlayers(this.value).subscribe(e=>{this.isLoading=!1,this.players=[].concat(e)})}getdate(e){return new Date(e)}pageChanged(e){this.pageSize=e.pageSize,this.currentPage=e.pageIndex,this.loadData()}valueChange(e){this.loadData()}resetSearch(){this.value="",this.loadData()}static#t=this.\u0275fac=function(a){return new(a||n)(t.rXU(y),t.rXU(g.Ix),t.rXU(M.i),t.rXU(g.nX))};static#e=this.\u0275cmp=t.VBU({type:n,selectors:[["app-players"]],decls:16,vars:4,consts:[[1,"background"],[1,"heading"],[1,"about-page"],[1,"search-box"],["appearance","fill",1,"example-form-field"],["matInput","","type","text",3,"ngModelChange","ngModel"],["matSuffix","","mat-icon-button","","aria-label","Clear",3,"click",4,"ngIf"],[1,"mods-list"],["class","loading",4,"ngIf"],["class","mod",4,"ngFor","ngForOf"],["matSuffix","","mat-icon-button","","aria-label","Clear",3,"click"],[1,"loading"],[1,"mod"],[1,"card"],[1,"card-body"],[1,"card-title",2,"font-weight","550"],[4,"ngFor","ngForOf"]],template:function(a,i){1&a&&(t.j41(0,"section")(1,"div",0)(2,"div",1)(3,"span"),t.EFF(4,"Players Account List"),t.k0s()(),t.j41(5,"div",2),t.EFF(6," Fetch BombSquad Players account details from device id , pb-id "),t.k0s(),t.j41(7,"div",3)(8,"mat-form-field",4)(9,"mat-label"),t.EFF(10,"Search Players"),t.k0s(),t.j41(11,"input",5),t.mxI("ngModelChange",function(l){return t.DH7(i.value,l)||(i.value=l),l}),t.bIt("ngModelChange",function(l){return i.valueChange(l)}),t.k0s(),t.DNE(12,O,3,0,"button",6),t.k0s()(),t.j41(13,"div",7),t.DNE(14,S,2,0,"div",8)(15,I,23,6,"div",9),t.k0s()()()),2&a&&(t.R7$(11),t.R50("ngModel",i.value),t.R7$(),t.Y8G("ngIf",i.value),t.R7$(2),t.Y8G("ngIf",i.isLoading),t.R7$(),t.Y8G("ngForOf",i.players))},dependencies:[p.Sq,p.bT,u.LG,d.rl,d.nJ,d.yw,m.fg,f.An,c.me,c.BC,c.vS],styles:[".background[_ngcontent-%COMP%]{background-color:#000;min-height:65vh}.heading[_ngcontent-%COMP%]{color:#fff;text-align:center;font-size:2em;padding-top:20px}.mat-card[_ngcontent-%COMP%]{background-color:#c9c9c9!important}[_nghost-%COMP%]     .mat-form-field-underline{background-color:#fff!important;border:1px solid}[_nghost-%COMP%]     .mat-form-field-label{color:#fff!important}.search-box[_ngcontent-%COMP%]{color:#f5f5f5;margin:auto;padding-top:2em;width:40%}.about-page[_ngcontent-%COMP%]{width:40%;margin:auto;color:#a09e9e;padding-top:20px;font-size:small}.about-page[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none}.card-body[_ngcontent-%COMP%]{padding:1rem 1.6rem}.mods-list[_ngcontent-%COMP%]{width:43%;margin:auto}.mods-list[_ngcontent-%COMP%]   .mod[_ngcontent-%COMP%]{padding-bottom:2em;cursor:pointer}.loading[_ngcontent-%COMP%]{min-height:51vh;align-items:center;justify-content:center;display:flex}mat-paginator[_ngcontent-%COMP%]{background-color:#ffffff1a;color:#fff}[_nghost-%COMP%]     .mat-select-value{color:#ebe6e6e7!important}@media only screen and (max-width: 768px){.mods-list[_ngcontent-%COMP%], .about-page[_ngcontent-%COMP%]{width:80%}}"]})}return n})();const k=[{path:"",component:C}];let E=(()=>{class n{static#t=this.\u0275fac=function(a){return new(a||n)};static#e=this.\u0275mod=t.$C({type:n});static#n=this.\u0275inj=t.G2t({imports:[p.MD,g.iI.forChild(k),u.D6,d.RG,m.fS,b.Ou,f.m_,c.YN]})}return n})()}}]);