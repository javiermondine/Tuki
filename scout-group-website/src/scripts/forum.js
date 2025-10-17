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

class ForumApp {
    constructor() {
        this.form = document.getElementById('postForm');
        this.postsList = document.getElementById('posts');
        this.clearButton = document.getElementById('clearAll');
        this.API_URL = '/api/posts';
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        await this.loadPosts();
        this.startPolling();
    }
    
    setupEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(e);
        });
        
        this.clearButton.addEventListener('click', () => {
            if (confirm('¿Seguro que quieres borrar todos los mensajes?')) {
                this.clearPosts();
            }
        });
    }
    
    async loadPosts() {
        try {
            const response = await fetch(this.API_URL);
            const posts = await response.json();
            this.renderPosts(posts);
        } catch (error) {
            this.showError('Error al cargar los mensajes');
        }
    }
    
    async handleSubmit(e) {
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            message: formData.get('message')
        };
        
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.form.reset();
                await this.loadPosts();
            } else {
                this.showError('Error al publicar el mensaje');
            }
        } catch (error) {
            this.showError('Error de conexión');
        }
    }
    
    renderPosts(posts) {
        this.postsList.innerHTML = posts.map(post => `
            <article class="post">
                <header>
                    <h3>${this.escapeHtml(post.name)}</h3>
                    <time>${new Date(post.createdAt).toLocaleString()}</time>
                </header>
                <p>${this.escapeHtml(post.message)}</p>
            </article>
        `).join('');
    }
    
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert error';
        alert.textContent = message;
        this.form.insertAdjacentElement('beforebegin', alert);
        setTimeout(() => alert.remove(), 5000);
    }
    
    startPolling() {
        setInterval(() => this.loadPosts(), 30000); // Actualizar cada 30 segundos
    }
}

new ForumApp();
})();
