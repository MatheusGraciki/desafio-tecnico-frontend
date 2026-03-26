# 🚀 Desafio Técnico Frontend

Este projeto foi desenvolvido com **React + Vite** como parte de um desafio técnico de frontend.  
A aplicação foi estruturada com foco em organização, componentização, tipagem forte com TypeScript e automação de entrega com CI/CD.

### Telemetria e validação de estados

Como a API retorna apenas as amostras de telemetria (rpm e temperatura) e não fornece, em cada ponto de dados, uma classificação pronta do estado da máquina, foi necessário implementar uma regra de inferência no frontend.
A partir desses valores, cada amostra é classificada em parada, operando, atenção ou alerta, com base em thresholds fixos de RPM e temperatura.

Essa inferência foi criada para permitir que o frontend calculasse corretamente:

- o tempo acumulado em **alerta**
- o tempo acumulado em **atenção**
- o tempo total em **operação**
- a **eficiência** exibida no modal
- a consistência entre **gráfico, indicadores e resumo da máquina**

Em outras palavras, como esse status não vem pronto da API dentro da série histórica, o frontend precisou transformar os dados brutos de telemetria em um estado interpretável de negócio.

---

## 🧰 Tecnologias e Ferramentas

- **React + Vite** → interface e build otimizado
- **TypeScript** → tipagem estática e maior segurança no desenvolvimento
- **Docker** → validação de conhecimento em conteinerização no pipeline
- **Cloudflare Pages** → hospedagem do frontend com CDN global e HTTPS
- **GitHub Actions** → integração e deploy contínuos
- **Discord Webhooks** → notificações automáticas do pipeline

---

## 🌐 Acesso ao Projeto

A aplicação em produção está disponível em:

➡️ https://ecoautomacao.graciki.systems/

---

## ⚙️ Como funciona o deploy

O deploy é automatizado por **GitHub Actions** e acontece a cada `push` na branch `master`.

O pipeline atual executa as seguintes etapas:

1. **Checkout do código**
2. **Instalação de dependências com `npm ci`**
3. **Validações de segurança**
   - `gitleaks` para detectar possíveis secrets vazados
   - `npm audit --audit-level=high` para bloquear vulnerabilidades de severidade alta ou crítica
4. **Build da aplicação**
   - geração dos arquivos estáticos na pasta `dist`
5. **Validação com Docker**
   - o pipeline executa `docker build` para validar o `Dockerfile` e demonstrar conhecimento no uso de Docker
6. **Deploy no Cloudflare Pages**
   - publicação dos arquivos gerados usando `wrangler pages deploy`

---

## ☁️ Deploy no Cloudflare Pages

O projeto é publicado no **Cloudflare Pages** via **Direct Upload**, ou seja:

- o build é feito no **GitHub Actions**
- o Cloudflare recebe apenas os arquivos finais já gerados
- a publicação é realizada com o comando:

```bash
npx wrangler pages deploy dist --project-name=eco-automacao-industrial
```

Esse fluxo foi escolhido para centralizar o processo de CI/CD no GitHub Actions, em vez de depender do build automático do Cloudflare.

---

## 🐳 Sobre o Docker neste projeto

O Docker foi incluído no pipeline como demonstração de conhecimento técnico, mas **não é a tecnologia responsável pelo deploy em produção**.

Em outras palavras:

- o deploy final **não roda em container**
- o frontend é servido como **site estático** no **Cloudflare Pages**
- o `docker build` existe no workflow apenas para **validar a imagem** e evidenciar familiaridade com Docker no contexto do desafio

Portanto, embora exista `Dockerfile` e o pipeline execute a construção da imagem, isso **não significa** que a aplicação em produção esteja rodando via Docker.

---

## 🔔 Notificações no Discord

O pipeline envia notificações automáticas para o Discord usando webhooks.

Hoje existem notificações para **3 cenários**:

### 1. Bloqueio por segurança

Enviado quando a etapa de segurança falha, por exemplo:

- secrets detectados pelo gitleaks
- vulnerabilidades HIGH ou CRITICAL encontradas pelo `npm audit`

### 2. Falha no deploy

Enviado quando o pipeline passa pela segurança, mas falha na etapa de build, validação com Docker ou publicação no Cloudflare Pages.

### 3. Sucesso no deploy

Enviado quando todo o fluxo termina com sucesso.

As mensagens enviadas para o Discord incluem informações como:

- projeto
- branch
- autor do push
- workflow executado
- hash curto do commit
- mensagem do commit
- link para os logs da execução
- link do commit
- link do projeto publicado

---
### Testes com Jest

Foi adicionada uma pequena implementação de testes unitários com **Jest**, principalmente para validar regras de negócio no frontend. Como eu ainda não tinha muita experiência com Jest nesse contexto, a ideia aqui foi demonstrar uma aplicação inicial da ferramenta, cobrindo funções utilitárias críticas, como inferência de tipo de máquina e classificação de estados a partir da telemetria.

Não se trata de uma suíte completa de testes, mas de uma implementação simples com foco em validar comportamentos centrais da aplicação e demonstrar familiaridade com testes automatizados no frontend.
---



## 🧪 Execução local

### 1. Clonar o repositório

```bash
git clone <url-do-repo>
cd desafio-tecnico-frontend
```

### 2. Configurar variáveis de ambiente

- Copie `.env.example` para `.env`
- Ajuste os valores conforme o ambiente local

```
VITE_API_URL=https://webhook.ecoplus-apps.com/webhook
VITE_API_AUTH_TYPE=basic
VITE_API_USER=eco_user
VITE_API_PASSWORD=enemy-banana-ahead
```


> ⚠️ **Importante:** variáveis prefixadas com `VITE_` ficam expostas no frontend.  
> Neste desafio, como não havia backend próprio disponível para intermediar autenticação, essa abordagem foi usada apenas para viabilizar a integração no contexto do teste.

### 3. Instalar dependências

```bash
npm install
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

### 5. Gerar build de produção

```bash
npm run build
```

### 6. Validar com Docker

```bash
docker build -t desafio-frontend .
```

**Observação:** o uso de Docker aqui é apenas demonstrativo e não representa o modo real de publicação em produção.

### 7. Preview local do build

```bash
npm run preview
```

---

## 📁 Arquivos principais

| Caminho | Descrição |
|--------|-----------|
| `Dockerfile` | usado para validar a construção da imagem no pipeline |
| `.github/workflows/docker-deploy.yml` | workflow de CI/CD (segurança, build, Docker, deploy Cloudflare Pages, notificações) 
| `src/` | código-fonte da aplicação |
| `src/app` | telas do app |
| `functions/` | funções usadas no Cloudflare Pages quando necessário |

---

## 📌 Observações finais

Este projeto foi pensado para demonstrar não apenas a implementação da interface, mas também preocupações com:

- automação de deploy
- segurança básica no pipeline
- observabilidade simples via Discord

---
