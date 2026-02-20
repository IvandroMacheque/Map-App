# 🚀 Map App - Real-Time Geolocation

Este projeto foi desenvolvido como parte de um desafio técnico para criar uma aplicação web de mapas em tempo real. A aplicação permite que múltiplos usuários se conectem, visualizem sua própria posição e acompanhem a movimentação de outros usuários simultaneamente através de WebSockets.

## 🔗 Links do Projeto
- **Live Demo:** https://map-app-server-1avg.onrender.com/
- **Backend API:** https://map-app-client.onrender.com/

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React.js, Leaflet
- **Backend:** Node.js, Express
- **Comunicação:** Socket.io
- **Deploy:** Render.com

---

## 🧠 Desafios Enfrentados e Soluções

Abaixo estão os principais desafios técnicos encontrados durante o desenvolvimento e como foram resolvidos:

### 1. Conexões Duplicadas no Ciclo de Vida do React
**Desafio:** O comportamento do `StrictMode` do React causava a inicialização dupla do socket, gerando "usuários fantasmas" no servidor.
**Solução:** Implementação de uma *cleanup function* no `useEffect` para desconectar o socket e limpar os observadores de GPS ao desmontar o componente, garantindo uma conexão única e estável.

### 2. Resolução de Assets em Ambiente de Produção
**Desafio:** Durante o deploy no Render, os ícones padrão do Leaflet apresentaram erro de carregamento (404) devido à forma como o Vite processa arquivos estáticos.
**Solução:** Implementação de uma configuração manual de ícones via CDN oficial, garantindo que os marcadores sejam exibidos corretamente em qualquer dispositivo ou navegador sem dependência de caminhos locais.

### 3. Sincronização de Estado de Identidade (Socket ID)
**Desafio:** Garantir que o componente de Mapa e a Sidebar reconhecessem corretamente qual era o usuário local para aplicar diferenciação visual ("Você").
**Solução:** Utilização de um estado dedicado (`socketId`) sincronizado com o evento `connect` do servidor, permitindo a comparação lógica em tempo real entre o ID local e a lista global de conexões.

---

## ⚙️ Funcionalidades
- [x] Visualização de mapa interativo.
- [x] Captura automática de coordenadas via GPS do navegador.
- [x] Lista lateral com Latitude/Longitude de todos os usuários online.
- [x] Sincronização instantânea ao conectar/desconectar.

---

## 🤖 Uso de Inteligência Artificial (Copiloto/Assistente)

Utilizei ferramentas de Inteligência Artificial durante o desenvolvimento. Meu objetivo não foi apenas gerar código, mas utilizá-la como um **copiloto de aprendizagem acelerada** para:

- **Transição de Stack:** Como minha experiência principal é em Python (Streamlit/Dash/Flet), usei a IA para mapear conceitos equivalentes no ecossistema JavaScript/React.
- **Explicação de Conceitos:** A ferramenta foi utilizada para aprofundar meu entendimento sobre o funcionamento de Hooks (`useEffect`, `useRef`) e a natureza assíncrona do Node.js.
- **Debug e Deploy:** A IA auxiliou no diagnóstico de erros de ambiente e na configuração de variáveis de ambiente para o deploy no Render.

**Nota:** Garanto pleno domínio sobre o código entregue, sendo capaz de explicar cada decisão técnica, fluxo de dados e lógica implementada.
