
(function(){
  const header=document.getElementById('site-header');
  if(header){
    const update=()=>{
      header.classList.toggle('py-2', window.scrollY>20);
      header.classList.toggle('py-3', window.scrollY<=20);
    };
    update(); window.addEventListener('scroll',update,{passive:true});
  }

  const btn=document.getElementById('menu-btn');
  const menu=document.getElementById('mobile-menu');
  if(btn && menu){
    const setOpen=(open)=>{
      menu.classList.toggle('hidden',!open);
      btn.setAttribute('aria-expanded',String(open));
    };
    btn.addEventListener('click',e=>{e.preventDefault();setOpen(menu.classList.contains('hidden'));});
    menu.addEventListener('click',e=>{if(e.target.closest('a')) setOpen(false);});
    document.addEventListener('click',e=>{
      if(!menu.classList.contains('hidden')&&!menu.contains(e.target)&&!btn.contains(e.target))setOpen(false);
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
    window.addEventListener('resize',()=>{if(innerWidth>=1024)setOpen(false)});
  }

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}});
  },{threshold:.10});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  document.querySelectorAll('[data-form]').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const success=form.querySelector('.success');
      if(success){
        success.classList.remove('hidden');
        success.scrollIntoView({behavior:'smooth',block:'center'});
      }
    });
  });

  // Preserve a package selection when users arrive at the quote page.
  document.addEventListener('click',event=>{
    const link=event.target.closest('[data-package]');
    if(link){
      try{localStorage.setItem('iscoop-package',link.dataset.package)}catch(e){}
    }
  });
  const packageField=document.querySelector('[data-package-field]');
  if(packageField){
    try{
      const p=localStorage.getItem('iscoop-package');
      if(p) packageField.value=p;
    }catch(e){}
  }

  const packageRows=Array.from(document.querySelectorAll('.package-table tbody tr'));
  const packageGrid=document.querySelector('[data-package-cards]');
  const packageCount=document.querySelector('[data-package-count]');
  const packageData=packageRows.map((row,index)=>{
    const cells=Array.from(row.querySelectorAll('td')).map(cell=>cell.textContent.trim());
    const name=cells[0]||'';
    const configuration=cells[1]||'';
    const priceText=cells[2]||'';
    const appliances=cells[3]||'';
    const note=cells[4]||'';
    const price=Number(priceText.replace(/[^0-9]/g,''))||0;
    const batteryMatch=configuration.match(/([\d.]+)\s*kWh/i);
    const whMatch=configuration.match(/(\d+)\s*Wh/i);
    const battery=batteryMatch?Number(batteryMatch[1]):whMatch?Number(whMatch[1])/1000:0;
    const lower=name.toLowerCase();
    const category=lower.startsWith('portable')?'portable':lower.startsWith('business')?'business':lower.startsWith('scale')?'large-home':'home';
    const segment=category==='portable'?'Portable':category==='business'?'Business / SME':category==='large-home'?'Large Home':'Home';
    const ac=category==='business'?'commercial-ac':lower==='scale 15'?'two-ac':lower==='scale 10'?'one-ac':lower==='comfort 5'||lower==='scale 5'?'limited-ac':'no-ac';
    const bestFor={
      'Portable 500':'Essential electronics and light household use.',
      'Portable 1K':'Low-power electronics and selective small-fridge use.',
      'Essential 1.5':'Essential household loads.',
      'Essential Plus':'Evening reserve for household essentials.',
      'Comfort 2.5':'Household essentials, refrigeration and managed light loads.',
      'Comfort 5':'Broader household loads with managed pump use.',
      'Scale 5':'Daytime productivity with managed evening loads.',
      'Scale 10':'Whole-home essentials with managed cooling.',
      'Scale 15':'Larger household loads and longer evening support.',
      'Business 30':'Smaller office, clinic, retail or hospitality loads.',
      'Business 45':'Medium office, clinic, school, retail or hospitality loads.'
    }[name]||'A starting point for an assessed energy requirement.';
    return {index,name,configuration,priceText,price,appliances,note,battery,category,segment,ac,bestFor,search:[name,configuration,priceText,appliances,note].join(' ').toLowerCase()};
  });

  const makeElement=(tag,className,text)=>{
    const element=document.createElement(tag);
    if(className) element.className=className;
    if(text!==undefined) element.textContent=text;
    return element;
  };
  const applianceIcons=[
    [/light|lamp/i,'💡','Lighting'],[/fan/i,'◉','Fans'],[/refrigerat|fridge|freezer/i,'❄','Refrigeration'],
    [/air.?condition|\bac\b/i,'❄','Inverter AC'],[/pump/i,'↟','Pump'],[/tv|wi.?fi|laptop|computer|it\b/i,'▣','TV / Wi-Fi / IT'],
    [/washing machine/i,'◌','Washing machine'],[/pos|cctv/i,'▦','POS / CCTV']
  ];
  const makePackageCard=(item)=>{
    const card=makeElement('article','package-card rounded-3xl bg-white border border-ink/10 p-6 sm:p-7 flex flex-col shadow-framer');
    const top=makeElement('div','flex items-start justify-between gap-3');
    top.appendChild(makeElement('span','inline-flex px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-xs font-bold uppercase tracking-wider',item.segment));
    top.appendChild(makeElement('span','text-xs text-muted whitespace-nowrap',item.battery?item.battery+'kWh battery':'Battery spec'));
    card.appendChild(top);
    card.appendChild(makeElement('h3','text-2xl font-extrabold text-ink mt-4',item.name));
    card.appendChild(makeElement('p','text-sm text-ink/75 font-body leading-relaxed mt-3',item.configuration));
    card.appendChild(makeElement('p','text-2xl font-extrabold text-ink mt-5',item.priceText));
    const best=makeElement('p','text-sm text-muted font-body leading-relaxed mt-2');
    const bestLabel=makeElement('strong','text-ink','Best for: ');
    best.append(bestLabel,document.createTextNode(item.bestFor));
    card.appendChild(best);
    card.appendChild(makeElement('p','text-xs font-bold uppercase tracking-wider text-ink/70 mt-5','Typical appliances / loads · indicative'));
    const loadList=makeElement('div','flex flex-wrap gap-2 mt-2');
    let shown=0;
    applianceIcons.forEach(([pattern,icon,label])=>{
      if(shown<6&&pattern.test(item.appliances)){
        const chip=makeElement('span','inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cream text-xs text-ink/80');
        chip.append(makeElement('span','text-base',icon),makeElement('span','',label));
        loadList.appendChild(chip); shown++;
      }
    });
    if(!shown) loadList.appendChild(makeElement('span','text-sm text-muted','See typical load examples below.'));
    card.appendChild(loadList);
    const note=makeElement('p','text-xs text-muted font-body leading-relaxed mt-4',item.note);
    card.appendChild(note);
    const actions=makeElement('div','grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-ink/10');
    const check=makeElement('a','px-3 py-3 rounded-xl bg-brand-500 text-white text-sm font-bold text-center hover:bg-brand-600','Check My Load');
    const quoteType=item.category==='business'?'business':'home';
    check.href='quote.html?type='+quoteType; check.dataset.package=item.name;
    const quote=makeElement('a','px-3 py-3 rounded-xl bg-cream text-ink text-sm font-bold text-center hover:bg-ink/10','Get Quote');
    quote.href='quote.html?type='+quoteType; quote.dataset.package=item.name;
    actions.append(check,quote); card.appendChild(actions);
    return card;
  };
  const searchInput=document.querySelector('[data-package-search]');
  const useFilter=document.querySelector('[data-package-category]');
  const budgetFilter=document.querySelector('[data-package-budget]');
  const batteryFilter=document.querySelector('[data-package-battery]');
  const acFilter=document.querySelector('[data-package-ac]');
  const applianceFilter=document.querySelector('[data-package-appliance]');
  const sourceTable=document.querySelector('.package-table');
  if(packageData.length&&packageGrid){
    packageData.forEach(item=>packageGrid.appendChild(makePackageCard(item)));
    sourceTable?.closest('.rounded-3xl')?.classList.add('hidden');
    const filterPackages=()=>{
      const query=(searchInput?.value||'').trim().toLowerCase();
      const use=useFilter?.value||'all';
      const budget=budgetFilter?.value||'all';
      const battery=batteryFilter?.value||'all';
      const ac=acFilter?.value||'all';
      const appliance=applianceFilter?.value||'all';
      const [minPrice,maxPrice]=budget==='all'?[0,Infinity]:budget.split('-').map(Number);
      let visible=0;
      Array.from(packageGrid.children).forEach((card,index)=>{
        const item=packageData[index];
        const useMatch=use==='all'||(use==='home'&&item.category==='home')||(use==='portable'&&item.category==='portable')||(use==='large-home'&&item.category==='large-home')||(use==='business'&&item.category==='business');
        const budgetMatch=budget==='all'||(item.price>=minPrice&&item.price<=maxPrice);
        const batteryMatch=battery==='all'||Math.abs(item.battery-Number(battery))<0.01;
        const acMatch=ac==='all'||item.ac===ac;
        const appliancePatterns={refrigeration:/refrigerat|fridge|freezer/i,pump:/pump/i,washing:/washing machine/i,digital:/pos|cctv|wi.?fi|laptop|computer/i,ac:/air.?condition|\bac\b/i};
        const applianceMatch=appliance==='all'||appliancePatterns[appliance].test(item.appliances+' '+item.note);
        const matches=useMatch&&budgetMatch&&batteryMatch&&acMatch&&applianceMatch&&(!query||item.search.includes(query));
        card.style.display=matches?'':'none';
        if(matches) visible++;
      });
      if(packageCount) packageCount.textContent=use==='commercial'?'Commercial projects are assessed and designed to their site and load requirements; no fixed package is listed.':visible+' package'+(visible===1?'':'s')+' shown';
      const bespokeLink=document.querySelector('[data-commercial-note]');
      if(bespokeLink){
        bespokeLink.hidden=use!=='commercial';
        bespokeLink.classList.toggle('hidden',use!=='commercial');
      }
    };
    [searchInput,useFilter,budgetFilter,batteryFilter,acFilter,applianceFilter].forEach(control=>{
      control?.addEventListener(control===searchInput?'input':'change',filterPackages);
    });
    filterPackages();
  }

  const finder=document.querySelector('[data-package-finder]');
  const finderResults=document.querySelector('[data-finder-results]');
  if(finder&&finderResults&&packageData.length){
    const getValue=name=>finder.querySelector('[data-find-'+name+']')?.value||'';
    const finderMessage=(message,href,label)=>{
      finderResults.replaceChildren();
      const box=makeElement('div','md:col-span-2 rounded-2xl bg-white/10 border border-white/10 p-5');
      box.appendChild(makeElement('p','text-sm text-white',message));
      if(href){const link=makeElement('a','inline-flex mt-4 px-5 py-3 rounded-xl bg-lime-400 text-ink font-bold',label);link.href=href;box.appendChild(link);}
      finderResults.appendChild(box);
    };
    const recommend=event=>{
      event?.preventDefault();
      const property=getValue('property');
      if(property==='commercial'){
        finderMessage('Commercial and institutional projects need a site-specific load assessment; the package list is not a fixed design for these sites.','commercial.html','Discuss a commercial project');
        return;
      }
      if(getValue('business')==='production'){
        finderMessage('Production and workshop loads need a custom review of equipment ratings, start-up demand and operating hours.','quote.html?type=business','Request a business assessment');
        return;
      }
      const budget=getValue('budget');
      const [minBudget,maxBudget]=budget?budget.split('-').map(Number):[0,Infinity];
      const wantedAC=getValue('ac');
      const lightCount=Number(getValue('lights'))||0;
      const fanCount=Number(getValue('fans'))||0;
      const refrigeration=getValue('refrigeration');
      const pump=getValue('pump');
      const evening=getValue('evening');
      const businessLoad=getValue('business');
      const candidates=packageData.filter(item=>{
        const propertyMatch=property==='portable'?item.category==='portable':property==='business'?item.category==='business':item.category==='home'||item.category==='large-home';
        if(!propertyMatch||item.price<minBudget||item.price>maxBudget) return false;
        if(refrigeration==='yes'&&!/refrigerat|fridge|freezer/i.test(item.appliances)) return false;
        if(pump==='yes'&&!/pump/i.test(item.appliances)) return false;
        if(evening==='extended'&&item.battery<5) return false;
        if(wantedAC==='one'&&!['limited-ac','one-ac','two-ac','commercial-ac'].includes(item.ac)) return false;
        if(wantedAC==='two'&&!['two-ac','commercial-ac'].includes(item.ac)) return false;
        if(wantedAC==='commercial'&&item.ac!=='commercial-ac') return false;
        if((businessLoad==='digital'||businessLoad==='production')&&!/pos|cctv|wi.?fi|laptop|computer/i.test(item.appliances)) return false;
        const countMatch=(text,count,kind)=>{
          if(!count) return true;
          const pattern=kind==='lights'?/(\d+)\s*[–-]\s*(\d+)\s+led lights/i:/(\d+)\s*[–-]\s*(\d+)\s+fans/i;
          const range=text.match(pattern);
          if(!range) return true;
          return Number(range[2])>=count;
        };
        return countMatch(item.appliances,lightCount,'lights')&&countMatch(item.appliances,fanCount,'fans');
      }).map(item=>{
        let score=0;
        if(property==='portable'&&item.category==='portable') score+=4;
        if(property==='home'&&item.category==='home') score+=3;
        if(property==='home'&&item.category==='large-home') score+=2;
        if(property==='business'&&item.category==='business') score+=4;
        if((wantedAC==='one'&&item.ac==='one-ac')||(wantedAC==='two'&&item.ac==='two-ac')) score+=3;
        if(wantedAC==='none'&&item.ac==='no-ac') score+=1;
        if(evening==='extended') score+=Math.min(item.battery,15)/5;
        if(businessLoad==='digital'&&item.category==='business') score+=2;
        return {...item,score};
      }).sort((a,b)=>b.score-a.score||a.price-b.price).slice(0,2);
      if(!candidates.length){
        finderMessage('No listed package matches all selected ranges. Request an assessment for a custom starting point.','quote.html?type='+(property==='business'?'business':'home'),'Request an assessment');
        return;
      }
      finderResults.replaceChildren(...candidates.map(makePackageCard));
      finderResults.querySelectorAll('.package-card').forEach(card=>card.classList.add('bg-white','text-ink'));
    };
    finder.addEventListener('submit',recommend);
    finder.addEventListener('reset',()=>setTimeout(()=>finderResults.replaceChildren(),0));
  }

  // Keep the shared site navigation aligned with the information architecture.
  const siteHeader=document.getElementById('site-header');
  if(siteHeader){
    siteHeader.querySelectorAll('a[href="service-request.html"]').forEach(link=>link.remove());
    const primaryNav=siteHeader.querySelector('nav');
    if(primaryNav){
      const financeLink=primaryNav.querySelector('a[href="finance.html"]');
      if(financeLink) financeLink.textContent='Finance';
      let supportLink=primaryNav.querySelector('a[href="support.html"]');
      if(!supportLink){
        supportLink=document.createElement('a');
        supportLink.href='support.html';
        supportLink.className='px-4 py-2 rounded-xl text-sm font-medium text-ink/70 hover:text-ink hover:bg-ink/5 transition-colors';
        supportLink.textContent='Support';
        const aboutLink=primaryNav.querySelector('a[href="about.html"]');
        primaryNav.insertBefore(supportLink,aboutLink||null);
      }
      siteHeader.querySelectorAll('a[href="support.html"]').forEach(link=>{
        if(!primaryNav.contains(link)&&!link.closest('#mobile-menu')) link.remove();
      });
    }
    const mobileMenu=siteHeader.querySelector('#mobile-menu');
    if(mobileMenu){
      const financeLink=mobileMenu.querySelector('a[href="finance.html"]');
      if(financeLink) financeLink.textContent='Finance';
      mobileMenu.querySelectorAll('a[href="faq.html"],a[href="service-request.html"]').forEach(link=>link.remove());
      if(!mobileMenu.querySelector('a[href="support.html"]')){
        const aboutLink=mobileMenu.querySelector('a[href="about.html"]');
        const supportLink=document.createElement('a');
        supportLink.href='support.html';
        supportLink.className='block px-4 py-3 rounded-xl font-medium text-ink/70 hover:bg-cream';
        supportLink.textContent='Support';
        mobileMenu.insertBefore(supportLink,aboutLink||null);
      }
      mobileMenu.querySelectorAll('a[href^="quote.html"]').forEach(link=>link.textContent='Get Quote');
    }
    siteHeader.querySelectorAll('a[href^="quote.html"]').forEach(link=>{
      const page=window.location.pathname.split('/').pop();
      const routeType={'homes.html':'home','business.html':'business','commercial.html':'commercial','epc-services.html':'commercial'}[page];
      if(routeType) link.href='quote.html?type='+routeType;
      if(!link.closest('#mobile-menu')) link.textContent='Get Quote';
      link.setAttribute('aria-label','Get Quote');
    });
  }

  // Add the secondary destinations once in the shared footer on every page.
  const footer=document.querySelector('footer');
  if(footer&&!footer.querySelector('[data-secondary-links]')){
    footer.querySelectorAll('a[href="faq.html"],a[href="service-request.html"]').forEach(link=>link.closest('li')?.remove());
    const nav=document.createElement('nav');
    nav.dataset.secondaryLinks='';
    nav.setAttribute('aria-label','Secondary links');
    nav.className='max-w-7xl mx-auto pb-6 sm:pb-8 border-b border-white/10';
    nav.innerHTML='<div class="text-xs font-bold uppercase tracking-wider text-white mb-3">More</div><ul class="flex flex-wrap gap-x-5 gap-y-2 text-xs"><li><a class="hover:text-white" href="commercial.html#projects">Projects</a></li><li><a class="hover:text-white" href="faq.html">FAQs</a></li><li><a class="hover:text-white" href="mailto:support@iscoop.ng">Contact</a></li><li><a class="hover:text-white" href="mailto:support@iscoop.ng?subject=Request%20for%20Privacy%20Notice">Privacy</a></li><li><a class="hover:text-white" href="mailto:support@iscoop.ng?subject=Request%20for%20Terms%20of%20Service">Terms</a></li><li><a class="hover:text-white" href="mailto:support@iscoop.ng?subject=Request%20for%20Cookie%20Notice">Cookies</a></li><li><a class="hover:text-white" href="mailto:support@iscoop.ng?subject=Request%20for%20HSE%20and%20Quality%20Statement">HSE/Quality statement</a></li><li><a class="hover:text-white" href="service-request.html">Service Request</a></li></ul>';
    const copyright=footer.querySelector('[data-year]');
    const copyrightRow=copyright&&copyright.closest('div.max-w-7xl');
    if(copyrightRow) footer.insertBefore(nav,copyrightRow);
    else footer.appendChild(nav);
  }
})();
