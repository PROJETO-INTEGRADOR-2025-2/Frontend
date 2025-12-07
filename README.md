### 2. 📂 `frontend/README.md`

Crie um arquivo chamado `README.md` dentro da pasta `frontend` e cole o seguinte:

```markdown
# 💻 GreenLog Web (Frontend)

Interface web moderna e responsiva para o sistema **GreenLog**. Desenvolvida com foco em usabilidade, performance e design profissional (Dark/Light mode).

## 🛠 Tecnologias Utilizadas

* **Framework:** [React](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** CSS Modules com Variáveis CSS (Temas Dinâmicos).
* **Gerenciamento de Estado:** React Context API (`AuthContext`).
* **Consumo de API:** Axios.
* **Utilitários:** `jwt-decode`, `react-router-dom`.

## ✨ Funcionalidades

1.  **Autenticação Segura:** Login e Registro com persistência de token e redirecionamento protegido.
2.  **Dashboard Interativo:** Visão geral da frota e ações rápidas com design 3D/Glassmorphism.
3.  **Gerenciamento Completo (CRUD):**
    * Cadastro de Caminhões (com validação de tipo de resíduo).
    * Cadastro de Pontos de Coleta.
    * Criação de Rotas Logísticas.
4.  **Agendamento Inteligente:** Validação de compatibilidade entre Caminhão e Rota.
5.  **Módulo do Motorista:** Visualização de agenda e atualização de status de entrega em tempo real.
6.  **Tema Dinâmico:** Alternância entre Dark Mode e Light Mode.

## 🚀 Como Rodar o Projeto

### 1. Instalação
No terminal, dentro da pasta `frontend`:
```bash
npm install
npm run dev
