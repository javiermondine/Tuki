// Foro local (sin backend): creación, listado, búsqueda y borrado de mensajes
(function () {
  'use strict';

  const STORAGE_KEY = 'myotragus_forum_posts_v1';
  const API_URL = '/api/posts';
  const MAX_MESSAGE_LENGTH = 1000;

  // DOM refs
  const dom = {
    newPostBtn: document.getElementById('newPostBtn'),
    postForm: document.getElementById('postForm'),
    cancelPost: document.getElementById('cancelPost'),
    clearAll: document.getElementById('clearAll'),
    postsList: document.getElementById('posts'),
    nameInput: document.getElementById('name'),
    categoryInput: document.getElementById('category'),
    messageInput: document.getElementById('message'),
    charCount: document.getElementById('charCount'),
    searchInput: document.getElementById('searchPosts'),
    sortSelect: document.getElementById('sortBy'),
    modal: document.getElementById('confirmModal'),
    confirmMessage: document.getElementById('confirmMessage'),
    confirmYes: document.getElementById('confirmYes'),
    confirmNo: document.getElementById('confirmNo')
  };

  // Si no estamos en la página del foro, no hacer nada
  if (!dom.postsList) return;

  const security = window.MyotragusSecuridad;

  const escapeHtml = (value) => {
    const str = (value ?? '').toString();
    if (security && typeof security.sanitizeInput === 'function') {
      return security.sanitizeInput(str);
    }
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  const formatMessage = (message) => escapeHtml(message).replace(/\r?\n/g, '<br>');

  // Estado
  let posts = loadPosts();
  const state = {
    search: '',
    sort: (dom.sortSelect && dom.sortSelect.value) || 'newest'
  };

  let confirmHandler = null;

  // Persistencia
  function loadPosts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error leyendo posts locales', e);
      return [];
    }
  }

  function savePosts(next) {
    posts = next;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  // UI helpers
  function updateCharCount() {
    if (!dom.charCount || !dom.messageInput) return;
    const count = dom.messageInput.value.length;
    dom.charCount.textContent = String(Math.min(count, MAX_MESSAGE_LENGTH));
  }

  function toggleForm(show) {
    if (!dom.postForm) return;
    dom.postForm.classList.toggle('hidden', !show);
    if (dom.newPostBtn) dom.newPostBtn.disabled = show;
    if (show && dom.nameInput) dom.nameInput.focus();
    if (!show) {
      dom.postForm.reset();
      updateCharCount();
    }
  }

  function showAlert(message) {
    const form = dom.postForm;
    if (!form) return;
    let alert = form.querySelector('.alert');
    if (!alert) {
      alert = document.createElement('div');
      alert.className = 'alert';
      form.prepend(alert);
    }
    alert.textContent = message;
    alert.setAttribute('role', 'alert');
    setTimeout(() => alert && alert.remove(), 5000);
  }

  function formatDate(value) {
    try {
      return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
    } catch (_) {
      return new Date(value).toLocaleString();
    }
  }

  function formatCategory(value) {
    const v = (value || 'general').toString().trim();
    return v ? v.charAt(0).toUpperCase() + v.slice(1) : 'General';
  }

  // Render
  function getFilteredPosts() {
    const q = state.search.trim().toLowerCase();
    const filtered = posts.filter((p) => {
      if (!q) return true;
      return `${p.name} ${p.message} ${p.category}`.toLowerCase().includes(q);
    });
    const sorted = filtered.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return state.sort === 'oldest' ? da - db : db - da;
    });
    return sorted;
  }

  function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'post';
    article.dataset.postId = post.id;

    const header = document.createElement('header');
    header.innerHTML = `
      <h3>${escapeHtml(post.name || 'Anónimo')}</h3>
      <span class="post-category">${escapeHtml(formatCategory(post.category))}</span>
    `;

    const meta = document.createElement('div');
    meta.className = 'post-meta';
    meta.innerHTML = `<time datetime="${escapeHtml(post.createdAt)}">${formatDate(post.createdAt)}</time>`;

    const body = document.createElement('div');
    body.className = 'post-body';
    body.innerHTML = formatMessage(post.message);

    const actions = document.createElement('div');
    actions.className = 'post-actions';
    const del = document.createElement('button');
    del.className = 'btn outline';
    del.type = 'button';
    del.dataset.action = 'delete';
    del.dataset.postId = post.id;
    del.textContent = 'Borrar';
    actions.appendChild(del);

    article.appendChild(header);
    article.appendChild(meta);
    article.appendChild(body);
    article.appendChild(actions);
    return article;
  }

  function renderPosts() {
    if (!dom.postsList) return;
    dom.postsList.innerHTML = '';
    // i18n empty message support
    const emptyI18nKey = dom.postsList.getAttribute('data-i18n-empty');
    if (emptyI18nKey) {
      const lang = document.body.getAttribute('data-lang') || 'es';
      // getTranslation is global from i18n.js
      try {
        const text = window.getTranslation ? window.getTranslation(lang, emptyI18nKey) : null;
        if (text) dom.postsList.dataset.emptyMessage = text;
      } catch(_) {}
    }
    const list = getFilteredPosts();
    if (!list.length) {
      const empty = document.createElement('p');
      empty.className = 'forum-empty';
      empty.textContent = dom.postsList.dataset.emptyMessage || 'Todavía no hay mensajes. ¡Sé la primera persona en escribir!';
      dom.postsList.appendChild(empty);
      return;
    }
    list.forEach((p) => dom.postsList.appendChild(createPostElement(p)));
  }

  // Mutadores
  async function addPost({ name, category, message }) {
    const payload = { name, category, message };
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Network');
      const created = await res.json();
      // Normalize id for client list
      const item = {
        id: created._id || created.id || `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        name: created.name,
        category: (created.category || 'general').toLowerCase(),
        message: created.message,
        createdAt: created.createdAt || new Date().toISOString()
      };
      savePosts([item].concat(posts));
      renderPosts();
    } catch (_) {
      // Fallback local if API fails
      const now = new Date().toISOString();
      const id = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const next = posts.concat([{ id, name: name || 'Anónimo', category: (category || 'general').toLowerCase(), message, createdAt: now }]);
      savePosts(next);
      renderPosts();
    }
  }

  function removePost(id) {
    savePosts(posts.filter((p) => p.id !== id));
    renderPosts();
  }

  function clearAllPosts() {
    savePosts([]);
    renderPosts();
  }

  // Confirm modal
  function openConfirm(message, handler) {
    if (!dom.modal || !dom.confirmMessage) return;
    confirmHandler = handler;
    dom.confirmMessage.textContent = message;
    dom.modal.style.display = 'flex';
    dom.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    dom.confirmYes && dom.confirmYes.focus();
  }

  function closeConfirm() {
    if (!dom.modal) return;
    dom.modal.style.display = 'none';
    dom.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    confirmHandler = null;
  }

  // Eventos
  function handleSubmit(e) {
    e.preventDefault();
    const name = (dom.nameInput && dom.nameInput.value || '').trim();
    const category = (dom.categoryInput && dom.categoryInput.value || 'general').trim();
    const message = (dom.messageInput && dom.messageInput.value || '').trim();

    if (!message) return showAlert('El mensaje es obligatorio.');
    if (message.length > MAX_MESSAGE_LENGTH) return showAlert(`El mensaje no puede superar los ${MAX_MESSAGE_LENGTH} caracteres.`);

    addPost({ name, category, message });
    toggleForm(false);
  }

  function handlePostsClick(e) {
    const btn = e.target.closest && e.target.closest('button[data-action="delete"]');
    if (!btn) return;
    const id = btn.getAttribute('data-post-id');
    if (!id) return;
    openConfirm('¿Quieres borrar este mensaje?', () => removePost(id));
  }

  async function fetchServerPosts() {
    try {
      const res = await fetch(`${API_URL}`);
      if (!res.ok) throw new Error('Network');
      const serverPosts = await res.json();
      // Map to local shape with id
      const mapped = (serverPosts || []).map(p => ({
        id: p._id || p.id || `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        name: p.name || 'Anónimo',
        category: (p.category || 'general').toLowerCase(),
        message: p.message || '',
        createdAt: p.createdAt || new Date().toISOString()
      }));
      savePosts(mapped);
      renderPosts();
    } catch (e) {
      // Keep local posts
      renderPosts();
    }
  }

  function init() {
    // Inicial UI
    updateCharCount();
    fetchServerPosts();

    // Formulario
    dom.newPostBtn && dom.newPostBtn.addEventListener('click', () => toggleForm(true));
    dom.cancelPost && dom.cancelPost.addEventListener('click', () => toggleForm(false));
    dom.postForm && dom.postForm.addEventListener('submit', handleSubmit);
    if (dom.messageInput) {
      dom.messageInput.setAttribute('aria-describedby', 'charCount');
      dom.messageInput.addEventListener('input', updateCharCount);
    }

    // Filtros/sort
    dom.searchInput && dom.searchInput.addEventListener('input', (ev) => { state.search = ev.target.value; renderPosts(); });
    dom.sortSelect && dom.sortSelect.addEventListener('change', (ev) => { state.sort = ev.target.value; renderPosts(); });

    // Acciones
    dom.clearAll && dom.clearAll.addEventListener('click', () => openConfirm('Esto eliminará todos los mensajes guardados en este dispositivo. ¿Continuar?', clearAllPosts));
    dom.postsList && dom.postsList.addEventListener('click', handlePostsClick);

    // Modal
    dom.confirmYes && dom.confirmYes.addEventListener('click', () => { if (typeof confirmHandler === 'function') confirmHandler(); closeConfirm(); });
    dom.confirmNo && dom.confirmNo.addEventListener('click', closeConfirm);
    dom.modal && dom.modal.addEventListener('click', (ev) => { if (ev.target === dom.modal) closeConfirm(); });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && dom.modal && dom.modal.style.display === 'flex') closeConfirm(); });

    // Sync entre pestañas
    window.addEventListener('storage', (ev) => { if (ev.key === STORAGE_KEY) { posts = loadPosts(); renderPosts(); } });

    // React a cambios de idioma
    document.addEventListener('languageChanged', () => renderPosts());
  }

  document.addEventListener('DOMContentLoaded', init);
})();
