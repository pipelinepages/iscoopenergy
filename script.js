
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
  document.querySelectorAll('[data-package]').forEach(link=>{
    link.addEventListener('click',()=>{
      try{localStorage.setItem('iscoop-package',link.dataset.package)}catch(e){}
    });
  });
  const packageField=document.querySelector('[data-package-field]');
  if(packageField){
    try{
      const p=localStorage.getItem('iscoop-package');
      if(p) packageField.value=p;
    }catch(e){}
  }
})();
