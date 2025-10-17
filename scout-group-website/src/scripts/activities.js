import { Calendar } from '@fullcalendar/core';
import AOS from 'aos';

document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    setupFormValidation();
    setupMobileNav();
});

function initializeCalendar() {
    const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        events: '/api/events',
        loading: function(isLoading) {
            // Mostrar/ocultar spinner
        }
    });
    calendar.render();
}

function setupFormValidation() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            showFormErrors(form);
            return;
        }

        try {
            const response = await submitForm(form);
            if (response.ok) {
                showSuccess('¡Inscripción completada!');
                form.reset();
            }
        } catch (error) {
            showError('Error al procesar la inscripción');
        }
    });
}

// Inicializar animaciones
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});