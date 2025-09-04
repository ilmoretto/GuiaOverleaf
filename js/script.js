// Adiciona um listener que executa o código quando o HTML da página é carregado
document.addEventListener('DOMContentLoaded', function () {
    initializeChart();
    renderMathematics();
    setupCopyButtons();
    setupNavigationObserver();
});

/**
 * Renderiza todas as expressões matemáticas na página usando a biblioteca KaTeX.
 */
function renderMathematics() {
    // A função renderMathInElement é fornecida pela biblioteca KaTeX
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '\\[', right: '\\]', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\begin{align}', right: '\\end{align}', display: true}
            ]
        });
    }
}

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
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true, ticks: { callback: value => value + "%" } } }
        }
    });
}

/**
 * Configura a funcionalidade de copiar para todos os botões de código.
 */
function setupCopyButtons() {
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const code = button.nextElementSibling.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                button.textContent = 'Copiado!';
                setTimeout(() => { button.textContent = 'Copiar'; }, 2000);
            }).catch(err => console.error('Falha ao copiar: ', err));
        });
    });
}

/**
 * Configura o IntersectionObserver para destacar o link de navegação ativo.
 */
function setupNavigationObserver() {
    const sections = document.querySelectorAll('.module-section');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -60% 0px' });
    
    sections.forEach(section => observer.observe(section));
}