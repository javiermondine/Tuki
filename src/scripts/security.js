/**
 * Funciones de seguridad para el sitio web de Myotragus
 */

// Sanitización de input para prevenir XSS
function sanitizeInput(input) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return input.replace(reg, (match) => map[match]);
}

// Validación anti-spam para formularios
function validateForm(form) {
  // Honeypot para bots
  const honeypot = document.createElement('div');
  honeypot.style.display = 'none';
  honeypot.innerHTML = '<input type="text" name="bot_check" value="" tabindex="-1" autocomplete="off">';
  form.appendChild(honeypot);
  
  form.addEventListener('submit', (e) => {
    const botField = form.querySelector('input[name="bot_check"]');
    
    // Si el campo oculto está lleno, es probablemente un bot
    if (botField && botField.value !== '') {
      e.preventDefault();
      console.warn('Posible envío automatizado bloqueado');
      return false;
    }
    
    // Validar tasa de envío (no más de 3 en 1 minuto)
    const now = Date.now();
    const submissionTimes = JSON.parse(sessionStorage.getItem('form_submissions') || '[]');
    const recentSubmissions = submissionTimes.filter(time => now - time < 60000);
    
    if (recentSubmissions.length >= 3) {
      e.preventDefault();
      showFormError(form, 'Has enviado demasiados formularios. Espera un momento e inténtalo de nuevo.');
      return false;
    }
    
    // Almacenar tiempo de envío
    recentSubmissions.push(now);
    sessionStorage.setItem('form_submissions', JSON.stringify(recentSubmissions));
    
    // Sanitizar todos los inputs de texto
    form.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(input => {
      input.value = sanitizeInput(input.value);
    });
  });
}

// Mostrar error en formulario
function showFormError(form, message) {
  let errorContainer = form.querySelector('.form-error');
  if (!errorContainer) {
    errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    form.prepend(errorContainer);
  }
  
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
  
  // Ocultar después de 5 segundos
  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 5000);
}

// Protección para almacenamiento local
const secureStorage = {
  setItem: function(key, value) {
    const encryptedKey = btoa(`myotragus_${key}`);
    localStorage.setItem(encryptedKey, JSON.stringify({
      timestamp: Date.now(),
      data: value
    }));
  },
  
  getItem: function(key) {
    const encryptedKey = btoa(`myotragus_${key}`);
    const item = localStorage.getItem(encryptedKey);
    if (!item) return null;
    
    try {
      const parsed = JSON.parse(item);
      // Expirar después de 30 días
      if (Date.now() - parsed.timestamp > 30 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(encryptedKey);
        return null;
      }
      return parsed.data;
    } catch(e) {
      console.error('Error parsing stored item', e);
      return null;
    }
  },
  
  removeItem: function(key) {
    const encryptedKey = btoa(`myotragus_${key}`);
    localStorage.removeItem(encryptedKey);
  },
  
  clear: function() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('bXlvdHJhZ3VzXw')) {
        localStorage.removeItem(key);
      }
    });
  }
};

// Exportar funciones
window.MyotragusSecuridad = {
  sanitizeInput,
  validateForm,
  showFormError,
  secureStorage
};

// Inicializar seguridad en formularios cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
  // Aplicar validaciones a todos los formularios
  document.querySelectorAll('form').forEach(form => {
    validateForm(form);
  });
  
  // Estilo CSS para mensajes de error
  const style = document.createElement('style');
  style.textContent = `
    .form-error {
      background-color: #f8d7da;
      color: #721c24;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      border: 1px solid #f5c6cb;
      display: none;
    }
  `;
  document.head.appendChild(style);
});