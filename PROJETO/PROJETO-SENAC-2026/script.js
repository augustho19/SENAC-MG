const app = {
    data: JSON.parse(localStorage.getItem('gh_v4')) || { 
        name: '', xp: 0, lvl: 1, records: { snake: 0, memory: 0, mole: 0 } 
    },
    loop: null, 
    score: 0, 
    curGame: '',

    // FUNÇÃO DE LOGIN COM SENHA 123
    login() {
        const n = document.getElementById('nickname').value;
        const p = document.getElementById('password').value;

        if(n.length < 2) return alert("Nickname muito curto!");
        if(p !== "123") return alert("Senha Incorreta!");

        this.data.name = n;
        this.save();
        document.getElementById('login-overlay').style.display = 'none';
        this.updateUI();
    },

    logout() {
        // Remove os dados e recarrega para voltar ao login
        localStorage.clear();
        location.reload();
    },

    showTab(id, event) {
        document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        if(event) event.currentTarget.classList.add('active');
        this.exit();
    },

    save() { localStorage.setItem('gh_v4', JSON.stringify(this.data)); },

    updateUI() {
        document.getElementById('p-username').innerText = this.data.name;
        document.getElementById('p-level').innerText = this.data.lvl;
        document.getElementById('p-xp').innerText = this.data.xp;
        document.getElementById('xp-fill').style.width = this.data.xp + "%";
        document.getElementById('rec-snake').innerText = this.data.records.snake;
        document.getElementById('rec-memory').innerText = this.data.records.memory;
        document.getElementById('rec-mole').innerText = this.data.records.mole;
    },

    addXP(v) {
        this.data.xp += v;
        if(this.data.xp >= 100) { 
            this.data.xp = 0; 
            this.data.lvl++; 
            alert("Level Up!"); 
        }
        this.save(); 
        this.updateUI();
    },

    play(game) {
        this.curGame = game;
        document.getElementById('catalog').style.display = 'none';
        document.getElementById('arena').style.display = 'block';
        this.score = 0; document.getElementById('score').innerText = 0;
        
        const cvs = document.getElementById('canvas');
        const eng = document.getElementById('html-engine');
        cvs.style.display = (game === 'snake') ? 'block' : 'none';
        eng.innerHTML = '';

        if(game === 'snake') this.initSnake(cvs);
        if(game === 'memory') this.initMemory(eng);
        if(game === 'mole') this.initMole(eng);
    },

    exit() {
        if(this.curGame && this.score > this.data.records[this.curGame]) {
            this.data.records[this.curGame] = this.score;
        }
        clearInterval(this.loop);
        document.getElementById('catalog').style.display = 'grid';
        document.getElementById('arena').style.display = 'none';
        this.save(); 
        this.updateUI();
    },

    initSnake(canvas) {
        const ctx = canvas.getContext('2d');
        let snake = [{x:10, y:10}], food = {x:5, y:5}, d = 'R';
        document.onkeydown = (e) => {
            if(e.key === 'ArrowUp' && d !== 'S') d = 'W';
            if(e.key === 'ArrowDown' && d !== 'W') d = 'S';
            if(e.key === 'ArrowLeft' && d !== 'R') d = 'L';
            if(e.key === 'ArrowRight' && d !== 'L') d = 'R';
        };
        this.loop = setInterval(() => {
            let h = {...snake[0]};
            if(d==='W') h.y--; if(d==='S') h.y++; if(d==='L') h.x--; if(d==='R') h.x++;
            if(h.x<0||h.x>=20||h.y<0||h.y>=20) return this.exit();
            if(h.x===food.x && h.y===food.y) {
                this.score++; this.addXP(5);
                document.getElementById('score').innerText = this.score;
                food = {x:Math.floor(Math.random()*20), y:Math.floor(Math.random()*20)};
            } else snake.pop();
            snake.unshift(h);
            ctx.fillStyle = "#020617"; ctx.fillRect(0,0,400,400);
            ctx.fillStyle = "red"; ctx.fillRect(food.x*20, food.y*20, 18, 18);
            ctx.fillStyle = "#00f2ff"; snake.forEach(s => ctx.fillRect(s.x*20, s.y*20, 18, 18));
        }, 100);
    },

    initMemory(eng) {
        eng.style.gridTemplateColumns = 'repeat(4, 75px)'; eng.style.gap = '10px';
        let icons = ['🍕','🍕','🚀','🚀','⭐','⭐','🔥','🔥'].sort(()=>Math.random()-0.5);
        let sel = [];
        icons.forEach(icon => {
            const c = document.createElement('div');
            c.style = "width:75px; height:75px; background:#1e293b; border-radius:10px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:2rem;";
            c.onclick = () => {
                if(sel.length < 2 && !c.innerText) {
                    c.innerText = icon; sel.push(c);
                    if(sel.length === 2) setTimeout(() => {
                        if(sel[0].innerText === sel[1].innerText) { this.score+=10; this.addXP(10); }
                        else { sel[0].innerText = ''; sel[1].innerText = ''; }
                        sel = []; document.getElementById('score').innerText = this.score;
                    }, 500);
                }
            };
            eng.appendChild(c);
        });
    },

    initMole(eng) {
        eng.style.gridTemplateColumns = 'repeat(3, 100px)'; eng.style.gap = '15px';
        for(let i=0; i<9; i++) {
            const h = document.createElement('div');
            h.style = "width:100px; height:100px; background:#111; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2.5rem; cursor:crosshair;";
            eng.appendChild(h);
        }
        this.loop = setInterval(() => {
            for(let h of eng.children) h.innerText = '';
            let r = eng.children[Math.floor(Math.random()*9)];
            r.innerText = '👾';
            r.onclick = () => { if(r.innerText==='👾') { this.score++; this.addXP(2); r.innerText='💥'; document.getElementById('score').innerText = this.score; } };
        }, 800);
    }
};

// --- INICIALIZAÇÃO OBRIGATÓRIA NO LOGIN ---
// Mesmo que existam dados salvos, não escondemos o overlay automaticamente.
// O usuário deve digitar a senha sempre que abrir a página.
app.updateUI();