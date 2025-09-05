// Adiciona um listener que executa o código quando o HTML da página é carregado
document.addEventListener('DOMContentLoaded', function () {
    initializeChart();
    renderMathematics();
    setupCopyButtons();
    setupNavigationObserver();
    setupSidebarActiveLink(); // <<< incremento: destaca link ativo do sidebar
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

/* =========================
   INCREMENTO: destacar link ativo no sidebar
   ========================= */

/**
 * Destaca no sidebar o link correspondente à página atual.
 * - não altera HTML
 * - usa classes Tailwind já presentes (bg-stone-700, text-white)
 * - adiciona aria-current="page" para acessibilidade
 */
function setupSidebarActiveLink() {
    try {
        const links = document.querySelectorAll('#sidebar a');
        if (!links || !links.length) return;

        // normaliza caminho removendo barras finais e garantindo "/" para raiz
        const normalize = (p) => {
            if (!p) return '/';
            // remove query e hash
            p = p.split('?')[0].split('#')[0];
            // remove múltiplas barras finais
            p = p.replace(/\/+$/, '');
            return p === '' ? '/' : p;
        };

        const currentPath = normalize(location.pathname);

        links.forEach(a => {
            try {
                // usa new URL para resolver caminhos relativos corretamente
                const url = new URL(a.getAttribute('href'), location.origin);
                const linkPath = normalize(url.pathname);

                // tratar index.html vs root '/'
                const isIndexMatch =
                    (currentPath === '/' && (linkPath === '/index.html' || linkPath === '/')) ||
                    (linkPath === '/index.html' && currentPath === '/');

                if (linkPath === currentPath || isIndexMatch) {
                    // aplica destaque visual (mesmo look que você usou: bg-stone-700 + text-white)
                    a.classList.add('bg-stone-700', 'text-white');
                    // marca semanticamente como atual
                    a.setAttribute('aria-current', 'page');
                }
            } catch (errLink) {
                // se URL inválida, ignora silenciosamente
                console.warn('setupSidebarActiveLink: não foi possível processar href:', a.getAttribute('href'), errLink);
            }
        });
    } catch (err) {
        console.error('Erro em setupSidebarActiveLink:', err);
    }
}
