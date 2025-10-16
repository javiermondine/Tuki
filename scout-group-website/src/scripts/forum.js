(function(){'use strict';
var STORAGE_KEY='myotragus_forum_posts_v1';
function $(s){return document.querySelector(s);}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function loadPosts(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]') }catch(e){return[]} }
function savePosts(p){ localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
function render(){ var posts=loadPosts(); var container=$('#posts'); container.innerHTML=''; if(!posts.length){ container.innerHTML='<p class="note">Aún no hay mensajes. Sé el primero.</p>'; return; } posts.slice().reverse().forEach(function(post){ var el=document.createElement('div'); el.className='post'; var meta=document.createElement('div'); meta.className='post-meta'; meta.innerHTML='<strong>'+esc(post.name||'Anónimo')+'</strong><span>'+new Date(post.createdAt).toLocaleString()+'</span>'; var body=document.createElement('div'); body.className='post-body'; body.innerHTML=esc(post.message); var actions=document.createElement('div'); actions.className='post-actions'; var del=document.createElement('button'); del.className='btn outline'; del.textContent='Borrar'; del.addEventListener('click',function(){ if(confirm('Borrar este mensaje? (solo afecta a este navegador)')){ removePost(post.id); } }); actions.appendChild(del); el.appendChild(meta); el.appendChild(body); el.appendChild(actions); container.appendChild(el); }); }
function addPost(name,message){ if(!message||!message.trim()) return; var posts=loadPosts(); posts.push({id:Date.now()+'-'+Math.random().toString(36).slice(2,8), name: name?name.trim():'Anónimo', message: message.trim(), createdAt: new Date().toISOString()}); savePosts(posts); render(); }
function removePost(id){ var posts=loadPosts().filter(function(p){return p.id!==id}); savePosts(posts); render(); }
function clearAll(){ if(confirm('Borrar todos los mensajes del foro en este navegador?')){ savePosts([]); render(); } }
document.addEventListener('DOMContentLoaded',function(){
  var form=$('#postForm'), nameI=$('#name'), msgI=$('#message'), clearBtn=$('#clearAll');
  if(form){ form.addEventListener('submit',function(e){ e.preventDefault(); addPost(nameI.value, msgI.value); form.reset(); nameI.focus(); }); }
  if(clearBtn) clearBtn.addEventListener('click', clearAll);
  render();
});
})();
