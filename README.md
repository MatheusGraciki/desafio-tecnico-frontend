# 🚀 Desafio Técnico Frontend

Este projeto consiste em um frontend desenvolvido com **React + Vite**, criado como parte de um desafio técnico. A aplicação segue boas práticas de arquitetura, automação e deploy contínuo.

---

## 🧰 Tecnologias e Ferramentas

- **React + Vite** → construção da interface e build otimizado  
- **TypeScript** → tipagem estática e maior confiabilidade  
- **Docker** → ambiente padronizado para build e execução  
- **Cloudflare Pages** → hospedagem do frontend com CDN global e SSL  
- **GitHub Actions** → pipeline de CI/CD automatizado  
- **Discord** → notificações em tempo real dos deploys  

---

## 🌐 Acesso ao Projeto

A aplicação em produção está disponível em:

➡️ https://ecoautomacao.graciki.systems/

---

## ⚙️ CI/CD

O projeto possui um pipeline automatizado utilizando **GitHub Actions**.

A cada push na branch `master`, o workflow executa:

1. Build do projeto utilizando Docker (garantindo consistência de ambiente)
2. Geração dos arquivos estáticos (`dist`)
3. Deploy automático no Cloudflare Pages
4. Notificação de sucesso ou falha no Discord

### 📁 Arquivos principais

- `Dockerfile` → responsável pelo build do frontend em ambiente isolado  
- `.github/workflows/docker-deploy.yml` → pipeline de CI/CD  

---

## 🔔 Notificações

Os status de build e deploy são enviados automaticamente para o Discord:

➡️ https://discord.gg/Cr7WXwYb

---

## 🧪 Execução Local

### 1. Clonar o repositório

```bash
git clone <url-do-repo>
cd desafio-tecnico-frontend
```

### 2. Configurar variáveis de ambiente

- Copie `.env.example` para `.env` (ou crie um `.env` na raiz)
- Substitua os valores conforme necessário para seu ambiente

> ⚠️ **Atenção:** No Vite, variáveis de ambiente prefixadas com `VITE_` ficam expostas no frontend. Nunca coloque segredos ou credenciais sensíveis nessas variáveis. Para proteger dados confidenciais, utilize um backend intermediário.

### 3. Instalar dependências

```bash
npm install
```

### 4. Rodar em modo desenvolvimento

```bash
npm run dev
```

### 5. Gerar build de produção

```bash
npm run build
```

### 6. Rodar com Docker

```bash
docker build -t desafio-frontend .
docker run -p 3000:3000 desafio-frontend
```

### 7. Preview do build local

```bash
npm run preview
```

---

## 📚 Outras Informações

- Dúvidas ou sugestões? Abra uma issue ou entre no Discord!
