# Acessibilidade Total

Extensão Chrome para tornar qualquer site mais acessível, oferecendo:

* **Alto contraste**: alterna tema de cores para melhorar legibilidade.
* **Ajuste de fonte**: botões A+ e A- para ampliar ou reduzir o tamanho do texto.
* **Leitura de página**: sintetiza todo o texto via Web Speech API.
* **Controles de leitura**: pausar, retomar e ajustar velocidade (mais rápido/mais lento).
* **Comandos de voz**: inicie, pause, retome e ajuste a velocidade por voz (pt‑BR).
* **Skip-link & Landmark**: insere link "Pular para conteúdo" e marcação ARIA `role="main"`.
* **Suporte a visibilidade de página**: pausa reconhecimento ao trocar de aba.

---

## Instalação local

1. **Clone** este repositório:

   ```bash
   git clone https://github.com/SANDIEGOVIEIRA/Acessibilidade-Total.git
   cd Acessibilidade-Total
   ```
2. Abra o Chrome e acesse `chrome://extensions`.
3. Ative o **Modo do desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação** e selecione a pasta do projeto.
5. Pronto! Ícone aparecerá à direita da barra de endereços.

---

## Uso

1. Clique no ícone da extensão para abrir o popup.
2. Utilize os botões:

   * **Alto Contraste**: alterna tema claro/escuro.
   * **A+ / A-**: aumenta ou reduz a fonte.
   * **Ler Página**: inicia síntese de voz de todo o texto.
   * **Pausar / Retomar**: controla TTS.
   * **Velocidade**: botões “+” e “-” ajustam a fala.
3. **Comandos de voz** (pt‑BR):

   * “iniciar” ou “ler” → inicia leitura.
   * “pausar” ou “parar” → pausa leitura.
   * “retomar” ou “continuar” → retoma leitura.
   * “mais rápido” → aumenta velocidade.
   * “mais lento” ou “devagar” → reduz velocidade.
4. Para saltar diretamente ao conteúdo, use a tecla **Tab** até o link "Pular para conteúdo".

---

## Estrutura de arquivos

```
/ (raiz)
│  manifest.json       # configuração da extensão
│  background.js       # script de hooks (se houver)
│  content.js          # lógica de acessibilidade injetada em cada página
│  popup.html          # interface de usuário da extensão
│  popup.js            # comunicação popup → content script
│
├─ icons/              # ícones 48×48 e 128×128
│   ├ icon48.png
│   └ icon128.png
│  
└─ styles/
   └ high-contrast.css  # estilos de alto contraste
```

---

## Contribuição

1. Abra uma **issue** descrevendo a feature ou bug.
2. Faça um **fork**, crie uma branch `feature/nome`, implemente e envie **pull request**.
3. Adote o padrão de ESLint e formatação do projeto (Prettier).

---

## Licença

Este projeto está licenciado sob a  
[Creative Commons Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/).
