// CONFIGURAÇÃO DA ANIMAÇÃO DO LOGIN (Particles.js)
particlesJS('particles-js', {
    "particles": {
        "number": { "value": 80 },
        "color": { "value": "#00f2ff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5 },
        "size": { "value": 3 },
        "line_linked": { "enable": true, "distance": 150, "color": "#00f2ff", "opacity": 0.2, "width": 1 },
        "move": { "enable": true, "speed": 2 }
    },
    "interactivity": { "events": { "onhover": { "enable": true, "mode": "grab" } } }
});

// LOGIN
function handleLogin() {
    const u = document.getElementById('user').value;
    const p = document.getElementById('pass').value;
    
    if(u === "admin" && p === "123") {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('nexus-app').style.display = 'grid';
        localStorage.setItem('nexus_logged', 'true');
        loadUserData();
    } else { 
        alert("Acesso negado!"); 
    }
}

// NAVEGAÇÃO ENTRE TABS
function switchTab(id, el) {
    document.querySelectorAll('.tab-pane').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    
    document.getElementById(id).classList.add('active');
    if(el) el.classList.add('active');
}

// GESTÃO DE PERFIL
function updateAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('profile-img-preview').src = e.target.result;
            localStorage.setItem('nexus_img', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function saveProfile() {
    const n = document.getElementById('new-name').value;
    if(n) { 
        localStorage.setItem('nexus_name', n); 
        alert("Nome salvo!"); 
    }
}

function loadUserData() {
    const n = localStorage.getItem('nexus_name');
    const i = localStorage.getItem('nexus_img');
    if(n) document.getElementById('new-name').value = n;
    if(i) document.getElementById('profile-img-preview').src = i;
}

// SUPORTE
function selectSupport(el) {
    document.querySelectorAll('.type-opt').forEach(o => o.classList.remove('active'));
    el.classList.add('active');
}

// CARREGAMENTO DE JOGOS (Simulado)
async function loadGame(file) {
    const target = document.getElementById('game-target');
    switchTab('game-viewer');
    target.innerHTML = "<h3 style='padding:50px; text-align:center'>Conectando à pasta /jogos...</h3>";
    
    try {
        // Nota: Isso requer que você rode em um servidor local (Live Server)
        const res = await fetch(`jogos/${file}.html`);
        if(!res.ok) throw new Error();
        target.innerHTML = await res.text();
    } catch { 
        target.innerHTML = "<div style='padding:50px; text-align:center; color:#ff4757'>Erro: Arquivo de jogo não encontrado em /jogos/" + file + ".html</div>"; 
    }
}

// LOGOUT
function logout() { 
    localStorage.removeItem('nexus_logged'); 
    location.reload(); 
}

// VERIFICAÇÃO DE SESSÃO AO CARREGAR
window.onload = () => {
    if(localStorage.getItem('nexus_logged') === 'true') {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('nexus-app').style.display = 'grid';
        loadUserData();
    }
};