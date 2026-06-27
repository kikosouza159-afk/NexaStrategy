const cursorGlow = document.getElementById('cursorGlow');
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

window.addEventListener('mousemove', (event) => {
    if (!cursorGlow) return;
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
});

if (menuToggle && menu) menuToggle.addEventListener('click', () => menu.classList.toggle('open'));

const simYear = document.getElementById('simYear');
if (simYear) simYear.textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        const finalValue = Number(target.dataset.count);
        let current = 0;
        const steps = 52;
        const increment = finalValue / steps;
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                current = finalValue;
                clearInterval(timer);
            }
            target.textContent = finalValue % 1 === 0 ? Math.round(current) : current.toFixed(1);
        }, 20);
        countObserver.unobserve(target);
    });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 16;
        const rotateX = ((y / rect.height) - 0.5) * -16;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
});

const randomizeHero = document.getElementById('randomizeHero');
if (randomizeHero) randomizeHero.addEventListener('click', () => {
    document.getElementById('heroHit').textContent = `${(Math.random() * 4 + 2).toFixed(1)}%`;
    document.getElementById('heroCpc').textContent = `+${Math.floor(Math.random() * 34 + 8)}%`;
    document.getElementById('heroRoi').textContent = `${Math.floor(Math.random() * 48 + 22)}%`;
    randomizeBars();
});

const viewData = {
    operacao: {
        title: 'Cockpit Operacional', status: 'Tempo real', values: ['48.2k', '12.7k', '3.4k'], heights: [42,70,56,88,62,79,49]
    },
    executivo: {
        title: 'Painel Executivo', status: 'Visão diretoria', values: ['R$ 2.8M', '+21%', '94%'], heights: [64,78,83,71,92,88,96]
    },
    financeiro: {
        title: 'Radar Financeiro', status: 'Economia ativa', values: ['R$ 318k', '34%', '12x'], heights: [36,52,74,69,80,91,76]
    },
    ia: {
        title: 'IA Insights', status: 'Análise automática', values: ['17 alertas', '5 ações', '+28%'], heights: [88,48,58,92,51,73,98]
    }
};

const demoTabs = document.querySelectorAll('.demo-tab');
const bars = document.querySelectorAll('#chartZone span');

demoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        demoTabs.forEach(item => item.classList.remove('active'));
        tab.classList.add('active');
        const data = viewData[tab.dataset.view];
        document.getElementById('demoTitle').textContent = data.title;
        document.getElementById('demoStatus').textContent = data.status;
        document.getElementById('demoA').textContent = data.values[0];
        document.getElementById('demoB').textContent = data.values[1];
        document.getElementById('demoC').textContent = data.values[2];
        bars.forEach((bar, index) => bar.style.height = `${data.heights[index]}%`);
    });
});

function randomizeBars() {
    bars.forEach(bar => {
        const height = Math.floor(Math.random() * 62 + 28);
        bar.style.height = `${height}%`;
    });
}

setInterval(randomizeBars, 4500);

const roiForm = document.getElementById('roiForm');
const roiResult = document.getElementById('roiResult');

if (roiForm && roiResult) roiForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(roiForm).entries());
    const monthlyHours = Number(payload.hours || 0);
    const hourlyCost = Number(payload.cost || 0);
    const improvement = Number(payload.improvement || 0) / 100;
    const monthlySaving = monthlyHours * hourlyCost * improvement;
    const annualSaving = monthlySaving * 12;
    roiResult.innerHTML = `
        <small>Economia estimada</small>
        <strong>${formatCurrency(monthlySaving)}/mês</strong>
        <span>${formatCurrency(annualSaving)}/ano</span>
    `;
});

function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const leadForm = document.getElementById('leadForm');
const leadMessage = document.getElementById('leadMessage');

if (leadForm && leadMessage) leadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(leadForm).entries());
    const name = payload.name || '';
    const email = payload.email || '';
    const company = payload.company || '';
    const interest = payload.interest || 'Dashboard Executivo';
    const subject = `Interesse em simulação - ${company || name || 'Nexa Strategy'}`;
    const body = `Olá, tudo bem?

Tenho interesse em conhecer melhor a simulação de dashboards da Nexa Strategy.

Nome: ${name}
E-mail: ${email}
Empresa: ${company}
Interesse: ${interest}

Gostaria de receber mais informações e uma proposta comercial.`;
    leadMessage.textContent = 'Abrindo seu e-mail para envio...';
    window.location.href = `mailto:contato@NexaStrategy.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});



// Fundo interativo Nexa Strategy
const bgCanvas = document.getElementById('bgCanvas');
if (bgCanvas) {
    const bgCtx = bgCanvas.getContext('2d');
    let bgW = 0, bgH = 0, bgParticles = [], bgMouse = {x:null,y:null};
    function resizeBg(){
        bgW = bgCanvas.width = window.innerWidth;
        bgH = bgCanvas.height = window.innerHeight;
        bgParticles = [];
        const count = Math.min(80, Math.floor((bgW * bgH) / 22000));
        for(let i=0;i<count;i++){
            bgParticles.push({x:Math.random()*bgW,y:Math.random()*bgH,vx:(Math.random()-.5)*0.45,vy:(Math.random()-.5)*0.45,r:Math.random()*2.2+1});
        }
    }
    function drawBg(){
        bgCtx.clearRect(0,0,bgW,bgH);
        for(let i=0;i<bgParticles.length;i++){
            const p=bgParticles[i];
            p.x+=p.vx; p.y+=p.vy;
            if(p.x<0||p.x>bgW)p.vx*=-1;
            if(p.y<0||p.y>bgH)p.vy*=-1;
            const grad=bgCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8);
            grad.addColorStop(0,'rgba(69,231,255,.9)');
            grad.addColorStop(1,'rgba(69,231,255,0)');
            bgCtx.fillStyle=grad;
            bgCtx.beginPath(); bgCtx.arc(p.x,p.y,p.r*4,0,Math.PI*2); bgCtx.fill();
        }
        for(let i=0;i<bgParticles.length;i++){
            for(let j=i+1;j<bgParticles.length;j++){
                const a=bgParticles[i], b=bgParticles[j];
                const dx=a.x-b.x, dy=a.y-b.y, dist=Math.hypot(dx,dy);
                if(dist<120){
                    bgCtx.strokeStyle=`rgba(36,168,255,${(1-dist/120)*0.18})`;
                    bgCtx.lineWidth=1;
                    bgCtx.beginPath(); bgCtx.moveTo(a.x,a.y); bgCtx.lineTo(b.x,b.y); bgCtx.stroke();
                }
            }
        }
        if(bgMouse.x!==null){
            for(const p of bgParticles){
                const d=Math.hypot(bgMouse.x-p.x,bgMouse.y-p.y);
                if(d<140){
                    bgCtx.strokeStyle=`rgba(255,138,31,${(1-d/140)*0.3})`;
                    bgCtx.beginPath(); bgCtx.moveTo(p.x,p.y); bgCtx.lineTo(bgMouse.x,bgMouse.y); bgCtx.stroke();
                }
            }
        }
        requestAnimationFrame(drawBg);
    }
    window.addEventListener('mousemove',e=>{bgMouse.x=e.clientX;bgMouse.y=e.clientY});
    window.addEventListener('mouseleave',()=>{bgMouse.x=null;bgMouse.y=null});
    window.addEventListener('resize',resizeBg);
    resizeBg(); drawBg();
}
