(function(){'use strict';
var $=function(s,c){return(c||document).querySelector(s);},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};
var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
// nav toggle
var t=document.getElementById('navToggle'), n=document.getElementById('mainNav');
function setNav(v){ if(!t||!n) return; t.setAttribute('aria-expanded',v?'true':'false'); n.classList.toggle('open',v); }
if(t&&n){
  t.addEventListener('click',function(){ setNav(t.getAttribute('aria-expanded')!=='true'); });
  $$('#mainNav a').forEach(function(a){ a.addEventListener('click',function(){ setNav(false); }); });
  document.addEventListener('click',function(e){ if(!n.contains(e.target) && e.target!==t) setNav(false); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') setNav(false); });
}
// modal logic
var modal=document.getElementById('welcomeModal');
var btnScout=document.getElementById('btnScout');
var btnMeet=document.getElementById('btnMeet');
function closeModal(){ if(!modal) return; modal.style.display='none'; document.body.classList.remove('modal-open'); }
function openModal(){ if(!modal) return; modal.style.display='flex'; document.body.classList.add('modal-open'); }
if(modal){
  // show on load
  document.addEventListener('DOMContentLoaded', openModal, {once:true});
  // actions
  if(btnMeet) btnMeet.addEventListener('click', function(){ closeModal(); });
  if(btnScout) btnScout.addEventListener('click', function(){
    closeModal();
    // navigate to contact section and focus it
    setTimeout(function(){
      location.hash = '#contact';
      var t = document.getElementById('contact');
      if(t){ t.tabIndex = -1; t.focus(); }
    }, 60);
  });
  // close on Esc
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });
  // close when clicking outside dialog
  modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
}
if(location.hash){
  var target=document.getElementById(location.hash.slice(1)); if(target) target.tabIndex=-1;
}
})();
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar año automáticamente
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Manejo del modal
    const modal = document.getElementById('welcomeModal');
    const btnScout = document.getElementById('btnScout');
    const btnMeet = document.getElementById('btnMeet');
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'visible';
    }
    
    // Lazy loading de imágenes
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Validación del formulario
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Agregar lógica de validación y envío
        });
    }
});
