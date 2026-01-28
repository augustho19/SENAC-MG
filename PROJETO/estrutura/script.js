document.addEventListener('DOMContentLoaded', () => {
    // 1. DADOS DOS JOGOS
    const gameDatabase = [
        { name: "Cyber Strike", cat: "Ação" },
        { name: "Shadow Blade", cat: "Ação" },
        { name: "Neon Runner", cat: "Ação" },
        { name: "Elden Myth", cat: "RPG" },
        { name: "Dragon Quest", cat: "RPG" },
        { name: "Mana World", cat: "RPG" },
        { name: "Pro Soccer 26", cat: "Esportes" },
        { name: "Dunk Masters", cat: "Esportes" },
        { name: "Turbo Drift", cat: "Esportes" }
    ];

    // 2. ELEMENTOS
    const gameGrid = document.getElementById('gameGrid');
    const searchInput = document.getElementById('searchInput');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.tab-content');
    const modal = document.getElementById('gameModal');

    // 3. SISTEMA DE BIBLIOTECA (RENDERIZAÇÃO)
    function renderGames(filter = 'all', search = '') {
        gameGrid.innerHTML = '';
        const filtered = gameDatabase.filter(game => {
            const matchesFilter = filter === 'all' || game.cat === filter;
            const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        filtered.forEach(game => {
            const div = document.createElement('div');
            div.className = 'game-item';
            div.innerHTML = `<span>${game.name}</span><small style="color:#444">${game.cat}</small>`;
            div.onclick = () => openGame(game.name);
            gameGrid.appendChild(div);
        });
    }

    // 4. NAVEGAÇÃO ENTRE SEÇÕES
    function goTo(id) {
        sections.forEach(s => s.classList.add('hidden'));
        navLinks.forEach(l => l.classList.remove('active'));
        
        document.getElementById(id).classList.remove('hidden');
        const activeLink = document.querySelector(`[data-target="${id}"]`);
        if(activeLink) activeLink.classList.add('active');
    }

    navLinks.forEach(link => {
        link.onclick = (e) => { e.preventDefault(); goTo(link.dataset.target); };
    });

    // 5. FILTROS E BUSCA
    document.querySelectorAll('.f-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.f-btn.active').classList.remove('active');
            btn.classList.add('active');
            renderGames(btn.dataset.filter, searchInput.value);
        };
    });

    searchInput.oninput = () => {
        const activeFilter = document.querySelector('.f-btn.active').dataset.filter;
        renderGames(activeFilter, searchInput.value);
    };

    // 6. ATALHOS DA HOME
    document.querySelectorAll('.cat-card').forEach(card => {
        card.onclick = () => {
            goTo('library');
            const cat = card.dataset.cat;
            document.querySelector(`.f-btn[data-filter="${cat}"]`).click();
        };
    });

    // 7. SISTEMA DE LOGIN UNIVERSAL
    const authForm = document.getElementById('authForm');
    authForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('nickName').value;
        
        // Atualiza UI
        document.getElementById('welcomeName').innerText = name;
        document.getElementById('profileName').innerText = name;
        document.getElementById('sidebarUser').innerText = "👤 " + name;

        // Troca de Telas
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('user-profile').classList.remove('hidden');
        
        alert("Sessão Iniciada!");
        goTo('home');
    };

    document.getElementById('logoutBtn').onclick = () => location.reload();

    // 8. MODAL
    function openGame(title) {
        document.getElementById('modalTitle').innerText = title;
        modal.classList.remove('hidden');
    }

    document.querySelector('.close-modal').onclick = () => modal.classList.add('hidden');
    window.onclick = (e) => { if(e.target == modal) modal.classList.add('hidden'); };

    // Inicialização
    renderGames();
});