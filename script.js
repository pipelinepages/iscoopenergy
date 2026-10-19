
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

  const auditPackages=[
    ['Portable 500',.5,1,1],['Portable 1K',1,1,1],['Essential 1.5',1.2,1.5,1],['Essential Plus',2.5,1.5,1],
    ['Comfort 2.5',2.5,2.5,2],['Comfort 5',5,3,3],['Scale 5',5,6,5],['Scale 10',10,6,6],['Scale 15',15,6,10],
    ['Business 30',30,10,18],['Business 45',45,12.5,24]
  ];
  const auditPrices={'Portable 500':490000,'Portable 1K':590000,'Essential 1.5':905000,'Essential Plus':1155000,'Comfort 2.5':1560000,'Comfort 5':2485000,'Scale 5':3250000,'Scale 10':4560000,'Scale 15':5500000,'Business 30':11090000,'Business 45':15770000};
  const auditConfigurations={
    'Portable 500':'500W / 1000Wh all-in-one portable solar system + 500W+ solar panel','Portable 1K':'1kW / 1kWh all-in-one portable solar system + 500W+ solar panel',
    'Essential 1.5':'1.5kVA hybrid inverter + 1.2kWh lithium battery + 1 × 500W+ solar panel','Essential Plus':'1.5kVA hybrid inverter + 2.5kWh lithium battery + 1 × 500W+ solar panel',
    'Comfort 2.5':'2.5kW hybrid inverter + 2.5kWh lithium battery + 2 × 500W+ solar panels','Comfort 5':'3kW hybrid inverter + 5kWh lithium battery + 3 × 500W+ solar panels',
    'Scale 5':'6kW hybrid inverter + 5kWh lithium battery + 5 × 500W+ solar panels','Scale 10':'6kW hybrid inverter + 10kWh lithium battery + 6 × 500W+ solar panels','Scale 15':'6kW hybrid inverter + 15kWh lithium battery + 10 × 500W+ solar panels',
    'Business 30':'10kW hybrid inverter + 30kWh lithium battery + 18 × 500W+ solar panels','Business 45':'12.5kW hybrid inverter + 45kWh lithium battery + 24 × 500W+ solar panels'
  };
  if(document.querySelector('[data-load-audit]')){
    const printStyle=document.createElement('style');
    printStyle.textContent='@media print{body *{visibility:hidden!important}[data-audit-report],[data-audit-report] *{visibility:visible!important}[data-audit-report]{display:block!important;position:fixed!important;inset:0!important;overflow:visible!important;background:#fff!important;color:#111!important;padding:18px!important;margin:0!important;border:0!important;box-shadow:none!important;z-index:999999!important;width:100%!important}[data-audit-report] *{color:#111!important;box-shadow:none!important}.print\\:hidden{display:none!important}table{border-collapse:collapse}th,td{border-bottom:1px solid #bbb;padding:6px!important}h2,h3{break-after:avoid}}';
    document.head.appendChild(printStyle);
  }
  const auditAppliances=[['LED light',10],['Standing fan',75],['Refrigerator',150],['Television',100],['Wi-Fi router',15],['Laptop',60],['Water pump',750],['1 HP inverter AC',900],['Washing machine',500],['Other load',100]];
  const auditEsc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const auditMoney=value=>'₦'+Math.round(value||0).toLocaleString('en-NG');
  document.querySelectorAll('[data-load-audit]').forEach(form=>{
    const rows=form.querySelector('[data-load-rows]');
    const report=form.closest('#load-assessment,#quote')?.querySelector('[data-audit-report]');
    const status=form.querySelector('[data-audit-status]');
    const requestedType=new URLSearchParams(window.location.search).get('type');
    if(['home','business','commercial'].includes(requestedType)&&form.querySelector('[data-site-type]')) form.querySelector('[data-site-type]').value=requestedType;
    const inputClass='min-w-0 w-full px-2.5 py-2 rounded-lg bg-white border border-ink/10 text-sm';
    const addRow=(initial='LED light')=>{
      const row=document.createElement('div'); row.className='grid grid-cols-2 sm:grid-cols-[1.5fr_.7fr_.8fr_.8fr_auto] gap-2 items-center p-2 rounded-xl bg-white border border-ink/10';
      const opts=auditAppliances.map(([name])=>`<option ${name===initial?'selected':''}>${name}</option>`).join('');
      row.innerHTML=`<label class="col-span-2 sm:col-span-1"><span class="sr-only">Appliance</span><select data-load-appliance class="${inputClass}">${opts}</select></label><label><span class="sr-only">Quantity</span><input data-load-qty type="number" min="1" value="1" class="${inputClass}" aria-label="Quantity"></label><label><span class="sr-only">Watts per unit</span><input data-load-watts type="number" min="1" value="10" class="${inputClass}" aria-label="Watts per unit"></label><label><span class="sr-only">Hours per day</span><input data-load-hours type="number" min="0" max="24" step=".5" value="6" class="${inputClass}" aria-label="Hours per day"></label><div class="col-span-2 sm:col-span-1 flex items-center justify-between gap-2"><label class="text-xs text-ink/75 flex items-center gap-1"><input data-load-critical type="checkbox" checked> Essential</label><button type="button" data-remove-load class="px-2 py-1 rounded-md text-muted hover:text-red-700" aria-label="Remove load">×</button></div>`;
      rows.appendChild(row);
      const appliance=row.querySelector('[data-load-appliance]'), watts=row.querySelector('[data-load-watts]');
      appliance.addEventListener('change',()=>{const selected=auditAppliances.find(a=>a[0]===appliance.value);if(selected)watts.value=selected[1]});
      row.querySelector('[data-remove-load]').addEventListener('click',()=>{if(rows.children.length>1)row.remove()});
    };
    addRow(); rows.querySelector('[data-load-watts]').value=10; addRow('Refrigerator'); rows.lastElementChild.querySelector('[data-load-watts]').value=150; rows.lastElementChild.querySelector('[data-load-hours]').value=8; addRow('Standing fan'); rows.lastElementChild.querySelector('[data-load-watts]').value=75;
    form.querySelector('[data-add-load]').addEventListener('click',()=>addRow('Other load'));
    const packageSpecs=()=>{
      let source=[];
      document.querySelectorAll('.package-table tbody tr').forEach(row=>{const c=[...row.querySelectorAll('td')].map(td=>td.textContent.trim());if(c.length>=3)source.push({name:c[0],configuration:c[1],price:c[2]})});
      if(!source.length){try{source=JSON.parse(document.getElementById('home-package-data')?.textContent||'[]').map(r=>({name:r[0],configuration:r[1],price:r[2]}))}catch(e){}}
      return auditPackages.map(([name,battery,inv,panelCount])=>{
        const record=source.find(p=>p.name===name), config=record?.configuration||'';
        const price=Number((record?.price||'').replace(/[^0-9]/g,''))||auditPrices[name]||0;
        const parsedBattery=config.match(/([\d.]+)\s*kWh/i),parsedWh=config.match(/([\d.]+)\s*Wh/i);
        return {name,battery:parsedBattery?Number(parsedBattery[1]):parsedWh?Number(parsedWh[1])/1000:battery,inv,panelCount,price,priceText:record?.price||auditMoney(price),configuration:config||auditConfigurations[name]};
      });
    };
    form.addEventListener('submit',event=>{
      event.preventDefault();
      const loads=[...rows.children].map(row=>({name:row.querySelector('[data-load-appliance]').value,qty:Math.max(1,Number(row.querySelector('[data-load-qty]').value)||1),watts:Math.max(0,Number(row.querySelector('[data-load-watts]').value)||0),hours:Math.min(24,Math.max(0,Number(row.querySelector('[data-load-hours]').value)||0)),essential:row.querySelector('[data-load-critical]').checked}));
      if(!loads.some(item=>item.watts>0)){status.textContent='Add at least one appliance with a wattage above zero.';return}
      const totalW=loads.reduce((sum,item)=>sum+item.qty*item.watts,0),dailyKwh=loads.reduce((sum,item)=>sum+item.qty*item.watts*item.hours/1000,0);
      const essential=loads.filter(item=>item.essential),backupW=essential.reduce((sum,item)=>sum+item.qty*item.watts,0)||totalW;
      const backupHours=Math.max(1,Math.min(72,Number(form.querySelector('[data-backup-hours]').value)||8)),requiredKwh=backupW*backupHours/1000;
      const requiredInverterKw=totalW/1000/.8,requiredBatteryKwh=requiredKwh/.72;
      const candidates=packageSpecs().filter(item=>item.inv*.8>=totalW/1000 && item.battery*.72>=requiredKwh).sort((a,b)=>a.price-b.price);
      const pkg=candidates[0]||null, type=form.querySelector('[data-site-type]').selectedOptions[0].textContent;
      const name=form.querySelector('[data-audit-name]').value.trim(),location=form.querySelector('[data-audit-location]').value.trim();
      const date=new Date().toLocaleDateString('en-NG',{year:'numeric',month:'long',day:'numeric'});
      const runtime=pkg&&backupW>0?pkg.battery*.72/(backupW/1000):0;
      const contact=[form.querySelector('[data-audit-phone]')?.value,form.querySelector('[data-audit-email]')?.value].filter(Boolean).join(' · ');
      const loadRows=loads.map(item=>`<tr><td>${auditEsc(item.name)}</td><td>${item.qty}</td><td>${item.watts} W</td><td>${item.hours} h</td><td>${item.essential?'Essential':'Other'}</td><td>${(item.qty*item.watts*item.hours/1000).toFixed(2)} kWh</td></tr>`).join('');
      const panelEnergy=pkg?(pkg.panelCount*.5*4.5*.75).toFixed(1):null;
      const recommendation=pkg?`<div class="rounded-2xl bg-[#e8f4e9] border border-brand-500/20 p-5"><p class="text-xs font-bold uppercase tracking-wider text-brand-500">Starting recommendation</p><h3 class="text-2xl font-extrabold mt-1">${auditEsc(pkg.name)}</h3><p class="font-semibold mt-1">${auditEsc(pkg.priceText)}</p><p class="text-sm text-muted mt-2">${auditEsc(pkg.configuration||`${pkg.inv}kW inverter · ${pkg.battery}kWh battery · ${pkg.panelCount} × 500W+ panels`)}</p><p class="text-sm mt-3">Estimated usable battery: ${(pkg.battery*.72).toFixed(1)} kWh · Estimated backup at entered essential load: ${runtime.toFixed(1)} hours · Indicative solar energy: ${panelEnergy} kWh/day.</p></div>`:`<div class="rounded-2xl bg-amber-50 border border-amber-200 p-5"><h3 class="text-xl font-bold">Custom system assessment recommended</h3><p class="text-sm mt-2">No listed package meets both the entered concurrent load and ${backupHours}-hour backup target. A larger or staged system may be needed; confirm motor/AC start-up surges and operating schedule with an iSCOOP adviser.</p></div>`;
      const caveats=(type.toLowerCase().includes('commercial')?'<li>Commercial or institutional sites need an engineered audit and site survey; listed packages are indicative starting points.</li>':'')+(!pkg?'<li>Package catalogue sizing limits were exceeded or the requested backup reserve is above listed storage.</li>':'')+(totalW/1000>(pkg?.inv||0)*.65?'<li>High motor/compressor starting current can exceed inverter capacity. Validate appliance surge ratings before purchase.</li>':'');
      const reportText=`iSCOOP LOAD AUDIT · ${date}\n${name?`Prepared for: ${name}\n`:''}${location?`Location: ${location}\n`:''}Site type: ${type}${contact?`\nContact: ${contact}`:''}\n\nLOAD SUMMARY\nConnected load: ${totalW.toLocaleString()} W\nEstimated daily energy: ${dailyKwh.toFixed(2)} kWh/day\nEssential load: ${backupW.toLocaleString()} W\nIndicative inverter rating target (20% headroom): ${requiredInverterKw.toFixed(2)} kW\nBackup target: ${backupHours} hours · nominal battery target: ${requiredBatteryKwh.toFixed(2)} kWh\n\nLOAD SCHEDULE\n${loads.map(i=>`${i.qty} × ${i.name}: ${i.watts} W each, ${i.hours} h/day, ${i.essential?'essential':'other'}`).join('\n')}\n\n${pkg?`RECOMMENDATION\n${pkg.name} · ${pkg.configuration||`${pkg.inv} kW inverter, ${pkg.battery} kWh battery, ${pkg.panelCount} × 500W+ panels`} · ${pkg.priceText}\nEstimated runtime: ${runtime.toFixed(1)} hours using 72% assumed usable battery capacity.\nIndicative solar generation: ${panelEnergy} kWh/day.`:'RECOMMENDATION\nCustom system review: no listed package meets the calculated demand and backup target.'}\n\nASSUMPTIONS & LIMITS\nBattery usable capacity assumed at 72% of nameplate. Inverter operated at no more than 80% of rated output, with 20% load headroom. Panels assumed at minimum 500W each, 4.5 peak-sun-hours/day and 75% system yield. Usage, weather, aging, temperatures, wiring, surge loads and operating sequence change actual results. Confirm appliance nameplates and system design through a site assessment. This indicative report is not a final engineering design or quotation.`;
      report.innerHTML=`<div class="flex flex-wrap items-end justify-between gap-4 mb-5"><div><p class="text-xs font-bold uppercase tracking-widest text-brand-500">Load audit · ${auditEsc(date)}</p><h2 class="text-3xl font-extrabold mt-1">Your load report</h2><p class="text-sm text-muted mt-1">${auditEsc(name||'')}${location?` · ${auditEsc(location)}`:''} · ${auditEsc(type)}${contact?` · ${auditEsc(contact)}`:''}</p></div><div class="flex gap-2 print:hidden"><button type="button" data-print-audit class="px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-bold">Print / Save PDF</button><button type="button" data-share-audit class="px-4 py-2.5 rounded-xl bg-white border border-ink/10 text-sm font-bold">Share report</button></div></div><div class="grid sm:grid-cols-3 gap-3 mb-6"><div class="p-4 rounded-xl bg-cream"><span class="text-xs text-muted">Connected load</span><p class="text-xl font-extrabold">${totalW.toLocaleString()} W</p></div><div class="p-4 rounded-xl bg-cream"><span class="text-xs text-muted">Daily energy</span><p class="text-xl font-extrabold">${dailyKwh.toFixed(2)} kWh</p></div><div class="p-4 rounded-xl bg-cream"><span class="text-xs text-muted">Backup target</span><p class="text-xl font-extrabold">${backupHours} h</p></div></div>${recommendation}<h3 class="font-bold mt-7 mb-2">Entered load schedule</h3><div class="overflow-x-auto"><table class="w-full min-w-[650px] text-sm text-left"><thead><tr class="border-b border-ink/10 text-muted"><th class="p-2">Load</th><th class="p-2">Qty</th><th class="p-2">Unit</th><th class="p-2">Daily use</th><th class="p-2">Priority</th><th class="p-2">Energy</th></tr></thead><tbody>${loadRows}</tbody></table></div><div class="mt-5 p-4 rounded-xl bg-cream"><h3 class="font-bold">Sizing notes and assumptions</h3><p class="text-sm text-muted mt-2">Estimated connected load: ${totalW.toLocaleString()} W; inverter rating target with 20% headroom: ${requiredInverterKw.toFixed(2)} kW. Backup target for essential load: ${requiredKwh.toFixed(2)} kWh delivered, requiring about ${requiredBatteryKwh.toFixed(2)} kWh nameplate storage at the assumed 72% usable capacity. Indicative solar generation assumes ${pkg?pkg.panelCount:'package-specific'} × 500W+ panels, 4.5 peak-sun-hours/day and 75% system yield.</p><ul class="text-sm text-muted list-disc pl-5 mt-2">${caveats}<li>Actual backup varies with load timing, battery state/age, weather, temperature, conversion losses and motor start-up demand.</li><li>Confirm the recommendation against appliance nameplates and site conditions before purchasing.</li></ul></div><p class="text-xs text-muted mt-4">Indicative planning report only; not a final engineering design or quotation.</p>`;
      report.classList.remove('hidden'); status.textContent='Your audit report is ready. Print it or share the report text.';
      report.querySelector('[data-print-audit]').addEventListener('click',()=>window.print());
      report.querySelector('[data-share-audit]').addEventListener('click',async()=>{
        try{if(navigator.share) await navigator.share({title:'iSCOOP Load Audit',text:reportText});else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(reportText);status.textContent='Audit report copied to clipboard.'}else{window.prompt('Copy your load audit report:',reportText)}}catch(err){if(err.name!=='AbortError')status.textContent='Share was unavailable. Use Print / Save PDF instead.'}
      });
      report.scrollIntoView({behavior:'smooth',block:'start'});
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
  const homePackageGrid=document.querySelector('[data-home-packages]');
  const getPackageSpecs=(configuration)=>{
    const parts=configuration.split(/\s+\+\s+/).map(part=>part.trim());
    const specs={power:[],battery:[],panels:[],other:[]};
    parts.forEach(part=>{
      if(/solar panel/i.test(part)) specs.panels.push(part);
      else if(/battery/i.test(part)) specs.battery.push(part);
      else if(/inverter|all-in-one|\bESS\b|solar system/i.test(part)) specs.power.push(part);
      else specs.other.push(part);
    });
    // Portable systems combine the inverter and battery in one unit.
    specs.power=specs.power.map(part=>part.replace(/\s+solar panel.*$/i,''));
    return specs;
  };
  const packageModal=document.querySelector('[data-package-modal]');
  const modalDialog=packageModal?.querySelector('[role="dialog"]');
  const modalFields={
    segment:packageModal?.querySelector('[data-modal-segment]'),
    title:packageModal?.querySelector('[data-modal-title]'),
    price:packageModal?.querySelector('[data-modal-price]'),
    power:packageModal?.querySelector('[data-modal-power]'),
    battery:packageModal?.querySelector('[data-modal-battery]'),
    panels:packageModal?.querySelector('[data-modal-panels]'),
    includedRow:packageModal?.querySelector('[data-modal-included-row]'),
    included:packageModal?.querySelector('[data-modal-included]'),
    bestForRow:packageModal?.querySelector('[data-modal-best-for-row]'),
    bestFor:packageModal?.querySelector('[data-modal-best-for]'),
    applianceChips:packageModal?.querySelector('[data-modal-appliance-chips]'),
    loads:packageModal?.querySelector('[data-modal-loads]'),
    note:packageModal?.querySelector('[data-modal-note]'),
    quote:packageModal?.querySelector('[data-modal-quote]'),
    check:packageModal?.querySelector('[data-modal-check]')
  };
  let modalReturnFocus=null;
  const closePackageModal=()=>{
    if(!packageModal)return;
    packageModal.classList.add('hidden'); packageModal.setAttribute('aria-hidden','true');
    header?.classList.remove('invisible');
    document.body.style.overflow=''; modalReturnFocus?.focus();
  };
  const openPackageModal=(item,trigger)=>{
    if(!packageModal)return;
    modalReturnFocus=trigger;
    const specs=getPackageSpecs(item.configuration);
    if(modalFields.segment) modalFields.segment.textContent=item.segment||'Solar package';
    modalFields.title.textContent=item.name;
    modalFields.price.textContent=item.priceText;
    modalFields.power.textContent=specs.power.join(' · ')||'Not specified';
    modalFields.battery.textContent=specs.battery.join(' · ')||(item.category==='portable'?'Integrated '+item.battery+'kWh storage in the all-in-one unit':'Not specified');
    modalFields.panels.textContent=specs.panels.join(' · ')||'Not specified';
    modalFields.includedRow.hidden=!specs.other.length;
    modalFields.included.textContent=specs.other.join(' · ');
    if(modalFields.bestForRow){
      modalFields.bestForRow.hidden=!item.bestFor;
      if(modalFields.bestFor) modalFields.bestFor.textContent=item.bestFor||'';
    }
    if(modalFields.applianceChips){
      const chipTypes=[
        ['💡','Lighting',/light/i],['◉','Fans',/fan/i],['❄','Refrigeration',/refrigerat|fridge|freezer/i],
        ['▣','TV / Wi-Fi / IT',/tv|wi.?fi|laptop|computer|network/i],['▤','POS / CCTV',/pos|cctv/i],
        ['💧','Water pump',/pump/i],['❄','Air-conditioning',/air.?condition|(?:^|[^a-z])ac(?:[^a-z]|$)/i],
        ['▥','Washing machine',/washing machine/i],['⚡','Kitchen appliances',/blender|cooker|kettle/i],['☎','Phones',/phone/i]
      ];
      const loadText=item.appliances+' '+item.note;
      const chips=chipTypes.filter(([, ,pattern])=>pattern.test(loadText)).map(([icon,label])=>{
        const chip=makeElement('span','inline-flex items-center gap-2 px-3 py-2 rounded-full bg-cream border border-ink/5 text-xs sm:text-sm text-ink/75');
        chip.append(makeElement('span','text-brand-500 font-bold',icon),makeElement('span','',label));
        return chip;
      });
      modalFields.applianceChips.replaceChildren(...chips);
      modalFields.applianceChips.hidden=!chips.length;
    }
    modalFields.loads.textContent=item.appliances;
    modalFields.note.textContent=item.note;
    const quoteType=item.category==='business'?'business':'home';
    [modalFields.quote,modalFields.check].forEach(link=>{link.href='quote.html?type='+quoteType;link.dataset.package=item.name;});
    packageModal.classList.remove('hidden'); packageModal.setAttribute('aria-hidden','false');
    header?.classList.add('invisible');
    document.body.style.overflow='hidden'; modalDialog.focus();
  };
  packageModal?.addEventListener('click',event=>{if(event.target.closest('[data-modal-close]'))closePackageModal();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!packageModal?.classList.contains('hidden'))closePackageModal();});
  const makePackageCard=(item)=>{
    const card=makeElement('article','package-card h-full rounded-3xl bg-white border border-ink/10 p-6 sm:p-7 flex flex-col shadow-framer cursor-pointer transition hover:-translate-y-1 hover:border-brand-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500');
    card.tabIndex=0; card.setAttribute('role','button'); card.setAttribute('aria-haspopup','dialog');
    const specs=getPackageSpecs(item.configuration);
    card.appendChild(makeElement('span','inline-flex self-start px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-xs font-bold uppercase tracking-wider',item.segment));
    card.appendChild(makeElement('h3','text-xl font-extrabold text-ink mt-4',item.name));
    card.appendChild(makeElement('p','text-2xl font-extrabold text-ink mt-3',item.priceText));
    const list=makeElement('dl','grid gap-3 mt-5 pt-5 border-t border-ink/10 text-sm');
    [['Inverter / power unit',specs.power.join(' · ')||'Not specified'],['Battery',specs.battery.join(' · ')||(item.category==='portable'?'Integrated '+item.battery+'kWh storage':'Not specified')],['Solar panels',specs.panels.join(' · ')||'Not specified']].forEach(([label,value])=>{
      const row=makeElement('div','grid gap-1'); row.append(makeElement('dt','text-xs font-bold uppercase tracking-wider text-muted',label),makeElement('dd','font-semibold text-ink/80',value)); list.appendChild(row);
    });
    card.appendChild(list);
    card.appendChild(makeElement('span','text-sm font-bold text-brand-500 mt-auto pt-5','View full package details →'));
    card.addEventListener('click',()=>openPackageModal(item,card));
    card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openPackageModal(item,card);}});
    return card;
  };
  if(homePackageGrid){
    try{
      const dataNode=document.getElementById('home-package-data');
      const rows=dataNode?JSON.parse(dataNode.textContent):[];
      const featuredNames=['Portable 500','Comfort 5','Business 30'];
      const featuredItems=featuredNames.map(name=>{
        const [itemName,configuration,priceText,appliances,note]=rows.find(row=>row[0]===name)||[];
        if(!itemName) return null;
        const category=itemName.startsWith('Portable')?'portable':itemName.startsWith('Business')?'business':itemName.startsWith('Scale')?'large-home':'home';
        const segment=category==='portable'?'Portable':category==='business'?'Business / SME':category==='large-home'?'Large Home':'Home';
        const batteryMatch=configuration.match(/([\d.]+)\s*kWh/i);
        const whMatch=configuration.match(/(\d+)\s*Wh/i);
        const battery=batteryMatch?Number(batteryMatch[1]):whMatch?Number(whMatch[1])/1000:0;
        return {name:itemName,configuration,priceText,appliances,note,category,segment,battery};
      }).filter(Boolean);
      if(!featuredItems.length) throw new Error('Featured package data is unavailable');
      homePackageGrid.replaceChildren(...featuredItems.map(makePackageCard));
    }catch(error){
      homePackageGrid.replaceChildren();
      const message=makeElement('p','text-sm text-muted','Package details could not be loaded. View the full package schedule instead.');
      const link=makeElement('a','ml-2 font-bold text-brand-500','Open package schedule →');
      link.href='packages.html'; message.appendChild(link); homePackageGrid.appendChild(message);
    }
  }
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
    const currentPage=window.location.pathname.split('/').pop();
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
      const desktopLinks=[['projects.html','Projects'],['faq.html','FAQs']];
      desktopLinks.forEach(([href,label])=>{
        let link=primaryNav.querySelector('a[href="'+href+'"]');
        if(!link){
          link=document.createElement('a');
          link.href=href;
          link.textContent=label;
          link.className=primaryNav.querySelector('.nav-link')?'nav-link':'px-4 py-2 rounded-xl text-sm font-medium text-ink/70 hover:text-ink hover:bg-ink/5 transition-colors';
        }
        primaryNav.insertBefore(link,primaryNav.querySelector('a[href="support.html"]')||primaryNav.querySelector('a[href="about.html"]')||null);
      });
      primaryNav.querySelectorAll('a[href]').forEach(link=>{
        if(link.getAttribute('href')===currentPage) link.classList.add('text-brand-500','bg-brand-500/10');
      });
      siteHeader.querySelectorAll('a[href="support.html"]').forEach(link=>{
        if(!primaryNav.contains(link)&&!link.closest('#mobile-menu')) link.remove();
      });
    }
    const mobileMenu=siteHeader.querySelector('#mobile-menu');
    if(mobileMenu){
      const financeLink=mobileMenu.querySelector('a[href="finance.html"]');
      if(financeLink) financeLink.textContent='Finance';
      mobileMenu.querySelectorAll('a[href="service-request.html"]').forEach(link=>link.remove());
      if(!mobileMenu.querySelector('a[href="support.html"]')){
        const aboutLink=mobileMenu.querySelector('a[href="about.html"]');
        const supportLink=document.createElement('a');
        supportLink.href='support.html';
        supportLink.className='block px-4 py-3 rounded-xl font-medium text-ink/70 hover:bg-cream';
        supportLink.textContent='Support';
        mobileMenu.insertBefore(supportLink,aboutLink||null);
      }
      [['projects.html','Projects'],['faq.html','FAQs']].forEach(([href,label])=>{
        let link=mobileMenu.querySelector('a[href="'+href+'"]');
        if(!link){
          link=document.createElement('a');
          link.href=href;
          link.textContent=label;
          link.className=mobileMenu.querySelector('.mobile-link')?'mobile-link':'block px-4 py-3 rounded-xl font-medium text-ink/70 hover:bg-cream';
        }
        mobileMenu.insertBefore(link,mobileMenu.querySelector('a[href="support.html"]')||mobileMenu.querySelector('a[href="about.html"]')||null);
      });
      mobileMenu.querySelectorAll('a[href]').forEach(link=>{
        if(link.getAttribute('href')===currentPage) link.classList.add('text-brand-500','bg-brand-500/10');
      });
      mobileMenu.querySelectorAll('a[href^="quote.html"]').forEach(link=>{link.textContent='Check My Load';link.href='quote.html#load-assessment'});
    }
    siteHeader.querySelectorAll('a[href^="quote.html"]').forEach(link=>{
      const page=window.location.pathname.split('/').pop();
      const routeType={'homes.html':'home','business.html':'business','commercial.html':'commercial','epc-services.html':'commercial'}[page];
      link.href='quote.html'+(routeType?'?type='+routeType:'')+'#load-assessment';
      if(!link.closest('#mobile-menu')) link.textContent='Check My Load';
      link.setAttribute('aria-label','Check My Load');
    });
  }

  // Add the secondary destinations once in the shared footer on every page.
  const footer=document.querySelector('footer');
  if(footer&&!footer.querySelector('[data-secondary-links]')){
    footer.querySelectorAll('a[href="faq.html"],a[href="projects.html"],a[href="service-request.html"]').forEach(link=>link.closest('li')?.remove());
    const nav=document.createElement('nav');
    nav.dataset.secondaryLinks='';
    nav.setAttribute('aria-label','Secondary links');
    nav.className='max-w-7xl mx-auto pb-6 sm:pb-8 border-b border-white/10';
    nav.innerHTML='<div class="text-xs font-bold uppercase tracking-wider text-white mb-3">More</div><ul class="flex flex-wrap gap-x-5 gap-y-2 text-xs"><li><a class="hover:text-white" href="projects.html">Projects</a></li><li><a class="hover:text-white" href="faq.html">FAQs</a></li><li><a class="hover:text-white" href="mailto:support@iscoop.ng">Contact</a></li><li><a class="hover:text-white" href="mailto:support@iscoop.ng?subject=Request%20for%20Privacy%20Notice">Request privacy notice</a></li><li><a class="hover:text-white" href="mailto:support@iscoop.ng?subject=Request%20for%20Terms%20of%20Service">Request terms of service</a></li><li><a class="hover:text-white" href="mailto:support@iscoop.ng?subject=Request%20for%20Cookie%20Notice">Request cookie notice</a></li><li><a class="hover:text-white" href="mailto:support@iscoop.ng?subject=Request%20for%20HSE%20and%20Quality%20Statement">Request HSE/quality statement</a></li></ul>';
    const copyright=footer.querySelector('[data-year]');
    const copyrightRow=copyright&&copyright.closest('div.max-w-7xl');
    if(copyrightRow) footer.insertBefore(nav,copyrightRow);
    else footer.appendChild(nav);
  }
})();
