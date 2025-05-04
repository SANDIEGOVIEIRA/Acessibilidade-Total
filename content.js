// content.js
console.log('📥 content script carregado');

let recognition;
let isRecognizing = false;
let reading       = false;
let speechRate    = 1.0;
let waitForPause  = false;  // após iniciar leitura, ouvir “pausar”
let waitForResume = false;  // após pausar, ouvir “retomar”

// Helper para iniciar o recognition apenas se não estiver ativo
function safeStartRecognition() {
  if (recognition && !isRecognizing) {
    try {
      recognition.start();
      isRecognizing = true;
      console.log('🔄 recognition.start()');
    } catch (err) {
      console.warn('⚠️ não pôde iniciar Recognition, já ativo? ', err);
    }
  }
}

// Helper para abortar e limpar flag
function safeAbortRecognition() {
  if (recognition && isRecognizing) {
    recognition.abort();
    isRecognizing = false;
    console.log('⏹ recognition.abort()');
  }
}

// 1) Mensagens do popup
chrome.runtime.onMessage.addListener(msg => {
  console.log('📩 content recebeu:', msg);
  switch (msg.action) {
    case 'togglecontrast': toggleContrast(); break;
    case 'increasefont':   adjustFontSize(1.2); break;
    case 'decreasefont':   adjustFontSize(0.8); break;
    case 'readpage':       readPage(); break;
    case 'pause_reading':  if (reading) speechSynthesis.pause(); break;
    case 'resume_reading': if (reading) speechSynthesis.resume(); break;
    case 'increase_rate':  adjustSpeechRate(+0.1); break;
    case 'decrease_rate':  adjustSpeechRate(-0.1); break;
    default:
      console.warn('⚠️ Ação desconhecida:', msg.action);
  }
});

// 2) Inicializa SpeechRecognition e trata reinícios somente no onend()
(function initVoiceCommands() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    console.warn('🎙️ SpeechRecognition não suportado');
    return;
  }

  recognition = new SR();
  recognition.lang           = 'pt-BR';
  recognition.interimResults = false;
  recognition.continuous     = true;

  recognition.addEventListener('result', e => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      if (!res.isFinal) continue;
      const txt = res[0].transcript.trim().toLowerCase();

      if (!reading && /\b(iniciar|ler|começar)\b/.test(txt)) {
        console.log('▶️ comando de voz: iniciar leitura');
        readPage();
        return;
      }
      if (waitForPause && /\b(pausar|parar)\b/.test(txt)) {
        console.log('⏸️ comando de voz: pausar');
        speechSynthesis.pause();
        waitForPause  = false;
        waitForResume = true;
        return;
      }
      if (waitForResume && /\b(retomar|continuar|resumir)\b/.test(txt)) {
        console.log('▶️ comando de voz: retomar');
        speechSynthesis.resume();
        waitForResume = false;
        waitForPause  = true;
        return;
      }
      if (/\b(mais\s+rápido)\b/.test(txt)) {
        adjustSpeechRate(+0.1);
        return;
      }
      if (/\b(mais\s+lento|devagar)\b/.test(txt)) {
        adjustSpeechRate(-0.1);
        return;
      }
    }
  });

  recognition.addEventListener('end', () => {
    isRecognizing = false;
    // reinicia apenas uma vez conforme o estado
    if (reading && waitForPause) {
      console.log('🔁 ouvindo comando de pausa');
      safeStartRecognition();
    }
    else if (reading && waitForResume) {
      console.log('🔁 ouvindo comando de retomar');
      safeStartRecognition();
    }
    else if (!reading && !waitForPause && !waitForResume) {
      console.log('🔁 reconhecimento em modo geral');
      safeStartRecognition();
    }
  });

  safeStartRecognition();
})();

// 3) Funções de acessibilidade
function readPage() {
  if (speechSynthesis.speaking) speechSynthesis.cancel();

  console.log('🗣️ Preparando leitura (rate:', speechRate, ')');
  reading       = true;
  waitForPause  = true;
  waitForResume = false;

  safeAbortRecognition();

  const utter = new SpeechSynthesisUtterance(document.body.innerText);
  utter.lang = 'pt-BR';
  utter.rate = speechRate;

  utter.onstart = () => console.log('🗣️ Leitura iniciada');
  utter.onend   = () => {
    console.log('🗣️ Leitura concluída, voltando ao modo geral');
    reading       = false;
    waitForPause  = false;
    waitForResume = false;
    safeStartRecognition();
  };

  speechSynthesis.speak(utter);
}

function adjustSpeechRate(delta) {
  speechRate = Math.min(3.0, Math.max(0.5, speechRate + delta));
  console.log(`⚙️ Velocidade: ${speechRate.toFixed(1)}x`);
  if (reading) {
    speechSynthesis.cancel();
    readPage();
  }
}

function toggleContrast() {
  document.documentElement.classList.toggle('high-contrast-ext');
}

function adjustFontSize(f) {
  const cur = parseFloat(getComputedStyle(document.body).fontSize);
  const nxt = (cur * f).toFixed(2);
  console.log(`🔤 Fonte: ${cur}px → ${nxt}px`);
  document.body.style.fontSize = `${nxt}px`;
}

// 4) Skip-link + landmark
(function(){
  if (!document.querySelector('.skip-link-ext')) {
    const a = document.createElement('a');
    a.href = '#main'; a.innerText = 'Pular para conteúdo';
    a.className = 'skip-link-ext';
    a.style.cssText = 'position:absolute;top:0;left:-999px;padding:8px;background:yellow;color:black;';
    a.onfocus = ()=>a.style.left='10px'; a.onblur = ()=>a.style.left='-999px';
    document.body.prepend(a);
  }
  let m = document.querySelector('main');
  if (!m) {
    m = document.createElement('main');
    document.body.append(m);
  }
  m.setAttribute('role','main');
  m.id = 'main';
})();

// 5) Visibilidade de aba: pausa/reinicia reconhecimento
document.addEventListener('visibilitychange', () => {
  if (!recognition) return;
  if (document.hidden) {
    console.log('👁️‍🗨️ aba oculta, interrompendo reconhecimento');
    safeAbortRecognition();
  } else if (!reading && !waitForPause && !waitForResume) {
    console.log('👁️‍🗨️ aba ativa, reiniciando reconhecimento em modo geral');
    safeStartRecognition();
  }
});
