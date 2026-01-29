document.addEventListener("DOMContentLoaded", () => {
    const nome = localStorage.getItem('lexus_name') || "Jogador";
    const foto = localStorage.getItem('lexus_foto') || "https://via.placeholder.com/150";

    if(document.getElementById('nav-username')) document.getElementById('nav-username').innerText = nome;
    if(document.getElementById('nav-avatar')) document.getElementById('nav-avatar').src = foto;
    if(document.getElementById('username-input')) document.getElementById('username-input').value = nome;
    if(document.getElementById('profile-preview')) document.getElementById('profile-preview').src = foto;
});

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('hide');
    document.getElementById('main-content').classList.toggle('full');
}

function saveData() {
    const n = document.getElementById('username-input').value;
    const f = document.getElementById('profile-preview').src;
    localStorage.setItem('lexus_name', n);
    localStorage.setItem('lexus_foto', f);
    alert("Dados salvos!");
    location.href = 'index.html';
}

const fInput = document.getElementById('file-input');
if(fInput) {
    fInput.onchange = (e) => {
        const reader = new FileReader();
        reader.onload = () => { document.getElementById('profile-preview').src = reader.result; }
        reader.readAsDataURL(e.target.files[0]);
    };
}