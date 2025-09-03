document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    setupCopyButtons();
    setupNavigationObserver();
});

/**
 * Inicializa o gráfico de tópicos usando Chart.js.
 */
function initializeChart() {
    const ctx = document.getElementById('topicsChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Fundamentos", "Estrutura", "Matemática", "Visuais", "Referências", "ABNT", "Customização"],
            datasets: [{
                label: 'Foco do Conteúdo (%)',
                data: [15, 20, 15, 15, 10, 20, 5],
                backgroundColor: 'rgba(13, 148, 136, 0.6)',
                borderColor: 'rgba(15, 118, 110, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: context => `${context.dataset.label}: ${context.raw}%`
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `${value}%`
                    }
                }
            }
        }
    });
}

/**
 * Configura a funcionalidade de copiar para todos os botões de código.
 * Usa a API moderna navigator.clipboard.
 */
function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const codeElement = button.nextElementSibling?.querySelector('code');
            if (!codeElement) return;

            const code = codeElement.innerText;

            try {
                await navigator.clipboard.writeText(code);
                button.textContent = 'Copiado!';
                setTimeout(() => {
                    button.textContent = 'Copiar';
                }, 2000);
            } catch (err) {
                console.error('Falha ao copiar texto: ', err);
                // Opcional: fornecer feedback de erro ao usuário
                button.textContent = 'Falhou!';
                 setTimeout(() => {
                    button.textContent = 'Copiar';
                }, 2000);
            }
        });
    });
}

/**
 * Configura o IntersectionObserver para destacar o link de navegação ativo
 * com base na seção visível na tela.
 */
function setupNavigationObserver() {
    const sections = document.querySelectorAll('.module-section');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' }); // Ajusta a área de detecção

    sections.forEach(section => {
        observer.observe(section);
    });
}