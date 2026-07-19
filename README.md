## 📚 Sobre o projeto

O **Bookstore Manager CLI** é uma aplicação de linha de comando (CLI) desenvolvida com **Node.js** e **TypeScript** que permite realizar o gerenciamento de empréstimos e devoluções de livros de uma bilbioteca física e gerenciar um catálogo local durante a execução da aplicação.

O projeto avaliativo de final de módulo do curso SCTEC - Desenvolvedor(a) Back End Node T1, foi construído com foco educacional, aplicando conceitos fundamentais de desenvolvimento back-end com TypeScript, organização em camadas, validações, tratamento de erros, orientação a objetos e manipulação de dados com banco de dados relacional.

---

# 📚 BookStore Manager CLI

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql\&logoColor=white)
![CLI](https://img.shields.io/badge/Application-CLI-orange)
![Architecture](https://img.shields.io/badge/Architecture-Layered-blue)
![Repository Pattern](https://img.shields.io/badge/Pattern-Repository-success)
![GitFlow](https://img.shields.io/badge/GitFlow-Implemented-purple)
![License](https://img.shields.io/badge/Academic_Project-SCTEC-green)

</p>

---

## 📖 Sobre o projeto

O **BookStore Manager CLI** é uma aplicação **Back-End executada via Terminal (CLI)** desenvolvida em **Node.js**, **TypeScript** e **PostgreSQL**, criada como projeto avaliativo do curso **Desenvolvedor(a) Back-End Node.js**.

O sistema foi desenvolvido simulando um software corporativo de gerenciamento de uma livraria, permitindo administrar autores, livros, clientes, usuários, municípios, perfis e empréstimos de livros, utilizando um banco de dados relacional para armazenamento permanente das informações.

Durante o desenvolvimento foram aplicados diversos conceitos fundamentais utilizados em aplicações profissionais, incluindo arquitetura em camadas, programação orientada a objetos, separação de responsabilidades, persistência de dados, tratamento de exceções, consultas SQL relacionais, programação assíncrona e boas práticas de desenvolvimento.

Além dos requisitos mínimos da atividade, o projeto possui uma arquitetura preparada para evolução, contendo componentes reutilizáveis, abstrações de repositórios, DTOs, tratamento centralizado de erros, sistema de autenticação, gerenciamento de sessão, logger e organização modular.

---

# 🎯 Objetivo

O principal objetivo deste projeto é consolidar os conhecimentos adquiridos durante o módulo de desenvolvimento Back-End utilizando Node.js e TypeScript, implementando uma aplicação completa executada via terminal capaz de:

* gerenciar autores;
* gerenciar livros;
* gerenciar clientes;
* gerenciar usuários;
* gerenciar perfis;
* gerenciar municípios;
* controlar empréstimos;
* registrar devoluções;
* realizar consultas relacionais;
* gerar relatórios utilizando SQL;
* persistir dados em PostgreSQL;
* aplicar regras de negócio;
* organizar o código em arquitetura multicamadas.

---

# 🚀 Tecnologias utilizadas

## Linguagens

* TypeScript
* JavaScript (Node.js)
* SQL

## Back-End

* Node.js
* PostgreSQL
* pg
* dotenv

## Arquitetura

* Layered Architecture
* Repository Pattern
* DTO Pattern
* Service Layer

## Ferramentas

* Git
* GitHub
* GitFlow
* Docker Compose
* VS Code

---

# ⭐ Principais recursos implementados

✔ Arquitetura em camadas

✔ Repository Pattern

✔ DTO Pattern

✔ Programação Orientada a Objetos

✔ TypeScript

✔ PostgreSQL

✔ Logger

✔ Tratamento centralizado de erros

✔ Sessão de usuário

✔ Consultas SQL relacionais

✔ CRUD completo

✔ Empréstimos de livros

✔ Controle de disponibilidade

✔ Relatórios

✔ Programação assíncrona (Async/Await)

✔ Docker Compose

---

# 📑 Índice

* [📖 Sobre o projeto](#-sobre-o-projeto)
* [🎯 Objetivo](#-objetivo)
* [🚀 Tecnologias utilizadas](#-tecnologias-utilizadas)
* [⭐ Principais recursos implementados](#-principais-recursos-implementados)
* [📦 Pré-requisitos](#-pré-requisitos)
* [⚙️ Instalação](#️-instalação)
* [🐘 Configuração do PostgreSQL](#-configuração-do-postgresql)
* [🔐 Configuração do arquivo .env](#-configuração-do-arquivo-env)
* [▶️ Executando a aplicação](#️-executando-a-aplicação)
* [🏛 Arquitetura do projeto](#-arquitetura-do-projeto)
* [📂 Estrutura de pastas](#-estrutura-de-pastas)
* [🗄 Banco de dados](#-banco-de-dados)
* [📚 Modelagem das entidades](#-modelagem-das-entidades)
* [🧩 Camadas da aplicação](#-camadas-da-aplicação)
* [⚙️ Funcionalidades implementadas](#️-funcionalidades-implementadas)
* [📋 Regras de negócio](#-regras-de-negócio)
* [📊 Relatórios](#-relatórios)
* [🛡 Tratamento de erros](#-tratamento-de-erros)
* [💻 Recursos do TypeScript](#-recursos-do-typescript)
* [🗃 Consultas SQL](#-consultas-sql)
* [🔄 Fluxo da aplicação](#-fluxo-da-aplicação)
* [🖥 Exemplos de utilização](#-exemplos-de-utilização)
* [📈 GitFlow](#-gitflow)
* [📌 Kanban](#-kanban)
* [🚀 Melhorias futuras](#-melhorias-futuras)
* [👨‍💻 Integrantes](#-integrantes)
* [📄 Licença](#-licença)

---

> Este projeto foi desenvolvido para fins acadêmicos, simulando um ambiente corporativo de desenvolvimento Back-End, seguindo princípios de arquitetura limpa, modularização e boas práticas de engenharia de software.

# 📦 Pré-requisitos

Antes de executar a aplicação, certifique-se de possuir os seguintes softwares instalados em sua máquina.

## Requisitos mínimos

| Software | Versão Recomendada |
|-----------|-------------------|
| Node.js | 22.x ou superior |
| npm | 10.x ou superior |
| PostgreSQL | 16 ou superior |
| Git | Última versão |
| Docker (Opcional) | Última versão |
| Docker Compose (Opcional) | Última versão |

---

# ⚙️ Instalação

Clone o repositório:

```bash
git clone https://github.com/ailemsnt/bookstore_manager_cli.git
```

Acesse o diretório do projeto.

```bash
cd bookstore_manager_cli
```

Instale todas as dependências.

```bash
npm install
```

Caso utilize Docker, os containers também poderão ser inicializados utilizando o arquivo disponibilizado no projeto.

---

# 🐘 Configuração do PostgreSQL

O sistema utiliza PostgreSQL como mecanismo de persistência dos dados.

Durante a instalação deverá ser criado um banco de dados vazio.

Exemplo:

```sql
CREATE DATABASE bookstore_manager;
```

Após a criação do banco, execute os scripts SQL disponibilizados no projeto.

Os scripts encontram-se organizados para facilitar a criação da estrutura completa do banco de dados.

Entre eles encontram-se:

- criação das tabelas;
- criação das chaves primárias;
- criação das chaves estrangeiras;
- índices;
- extensões;
- dados iniciais (seed);
- alterações estruturais.

A ordem recomendada de execução é:

```text
database/

├── extension.sql
├── init.sql
├── alter_table.sql
├── add_indexes.sql
└── seed.sql
```

Após a execução dos scripts, o banco estará preparado para utilização pela aplicação.

---

# 🔐 Configuração do arquivo `.env`

As informações de conexão com o banco de dados ficam centralizadas em um arquivo `.env`, evitando que credenciais sejam armazenadas diretamente no código-fonte.

Exemplo:

```env
DB_HOST=nome_do_host

DB_PORT=numero_da_porta

DB_DATABASE=bookstore_manager

DB_USER=user_name

DB_PASSWORD=user_password
```

> Os valores acima são apenas um exemplo e podem ser alterados conforme o ambiente de execução.

---

# 🐳 Executando com Docker

O projeto disponibiliza configuração para utilização através do Docker Compose.

Caso possua Docker instalado, basta executar:

```bash
docker compose up -d
```

ou

```bash
docker-compose up -d
```

Após a criação do container, execute normalmente a aplicação.

---

# ▶️ Executando a aplicação

Após instalar as dependências e configurar o banco de dados, execute:

```bash
npm run dev
```

O arquivo `main.ts` será responsável por:

- inicializar a aplicação;
- estabelecer conexão com o PostgreSQL;
- iniciar a sessão do usuário;
- carregar os módulos do sistema;
- apresentar o menu principal.

---

# Login

Ao iniciar a aplicação será solicitado o login (o usuário deve estar previamente cadastrado):

```text
==========================================
        Bem-vindo ao Acervo CLI                    
    Sistema de Gestão de Biblioteca 
==========================================

Informe os dados do usuário
login:


```

# 🖥️ Menu Principal

Após o login com sucesso, ao iniciar a aplicação será apresentado um menu semelhante ao seguinte:

```text
Usuário "super" logado com sucesso!

============================================================
                  MENU                  
============================================================

 INSTRUÇÕES DE USO:
 Gerencie empréstimos de livros.

 Informe o número da opção desejada:
 1. AUTORES 
 2. LIVROS
 3. CLIENTES
 4. EMPRÉSTIMOS | DEVOLUÇÕES
 5. RELATÓRIOS
 0. Sair
============================================================

Opção:

```

A navegação ocorre totalmente através do terminal, permitindo ao usuário acessar todos os módulos do sistema.

---

# 🔑 Autenticação

O projeto possui estrutura preparada para gerenciamento de usuários e sessões.
Após autenticação, a aplicação mantém as informações da sessão ativa durante a execução do sistema, permitindo controlar operações administrativas quando necessário.
Essa organização aproxima a aplicação da arquitetura utilizada em sistemas corporativos.

---

# 📂 Organização dos arquivos de configuração

Os principais arquivos de configuração do projeto são:

```text
package.json
package-lock.json
tsconfig.json
docker-compose.yml
.env
README.md
```

Cada um deles possui responsabilidade específica dentro da aplicação.

| Arquivo | Finalidade |
|----------|------------|
| package.json | Dependências e scripts |
| tsconfig.json | Configuração do TypeScript |
| docker-compose.yml | Ambiente Docker |
| .env | Configuração do banco |
| README.md | Documentação técnica |

---

# ⚡ Scripts disponíveis

Durante o desenvolvimento são utilizados os seguintes comandos.

Instalar dependências

```bash
npm install
```

Executar aplicação

```bash
npm run dev
```

Compilar TypeScript

```bash
npm run build
```

Caso existam scripts adicionais definidos no `package.json`, poderão ser utilizados conforme necessidade do desenvolvimento.

# 🏛 Arquitetura do Projeto

O **BookStore Manager CLI** foi desenvolvido utilizando uma **arquitetura em camadas (Layered Architecture)**, separando claramente as responsabilidades de cada módulo da aplicação.

Essa organização reduz o acoplamento entre os componentes, facilita a manutenção, melhora a reutilização de código e aproxima o projeto da arquitetura utilizada em aplicações corporativas.

A comunicação entre as camadas ocorre conforme o fluxo abaixo:

```text
                 Usuário
                    │
                    ▼
              Camada View (CLI)
                    │
                    ▼
             Camada Service
                    │
                    ▼
          Camada Repository
                    │
                    ▼
        PostgreSQL / Banco de Dados
```

Cada camada possui responsabilidades bem definidas, evitando que regras de negócio, acesso ao banco e interação com o usuário fiquem misturados no mesmo arquivo.

---

# 📂 Estrutura do Projeto

A estrutura do projeto encontra-se organizada da seguinte forma:

```text
src
│
├── @common
│   ├── errors
│   ├── utils
│   └── view
│
├── domain
│
├── infra
│   ├── database
│   └── repositories
│       └── adapters
│
├── services
│
├── view
│   └── dto
│
└── main.ts
```

Além da pasta principal da aplicação, o projeto também possui:

```text
database/
│
├── extension.sql
├── init.sql
├── alter_table.sql
├── add_indexes.sql
└── seed.sql

docker-compose.yml
README.md
package.json
tsconfig.json
```

Essa organização permite localizar rapidamente qualquer funcionalidade do sistema.

---

# 📦 Camadas da Aplicação

## View

A camada **View** representa a interface de interação com o usuário através do terminal (CLI).

É responsável por:

- apresentar menus;
- solicitar informações ao usuário;
- exibir mensagens de sucesso;
- exibir mensagens de erro;
- encaminhar solicitações para os Services.

A View não possui regras de negócio nem realiza acesso direto ao banco de dados.

Sua responsabilidade é exclusivamente controlar a interação com o usuário.

---

## Services

A camada **Service** concentra toda a lógica de negócio da aplicação.

Entre suas responsabilidades estão:

- validação dos dados recebidos;
- aplicação das regras de negócio;
- verificação de disponibilidade dos livros;
- controle dos empréstimos;
- validação das entidades existentes;
- tratamento das exceções;
- coordenação das operações entre múltiplos repositórios.

Essa separação garante que a lógica do sistema permaneça centralizada e reutilizável.

---

## Repositories

Os **Repositories** encapsulam toda comunicação com o banco de dados.

São responsáveis por:

- executar comandos SQL;
- realizar consultas;
- persistir registros;
- atualizar informações;
- excluir registros;
- retornar objetos para os Services.

Essa camada evita que SQL fique espalhado por toda aplicação.

---

## Infra

A pasta **infra** contém componentes responsáveis pela infraestrutura da aplicação.

Entre eles destacam-se:
- conexão com PostgreSQL;
- adapters;
- implementação concreta dos repositories;
- gerenciamento da persistência.

Essa separação facilita futuras alterações de tecnologia sem impactar as regras de negócio.

---

## Domain

A camada **Domain** representa o núcleo da aplicação.

Ela contém:
- entidades;
- modelos;
- contratos;
- interfaces;
- regras relacionadas ao domínio da livraria.

Essa organização torna o código mais limpo e desacoplado.

---

## DTO (Data Transfer Object)

O projeto utiliza DTOs para padronizar a troca de informações entre as camadas.

Os DTOs possuem como objetivo:
- reduzir acoplamento;
- validar dados recebidos;
- padronizar parâmetros;
- facilitar manutenção.

Essa abordagem evita que objetos do banco sejam manipulados diretamente pela interface.

---

## Common

A pasta **@common** reúne componentes compartilhados por toda aplicação.

Entre eles encontram-se:

### Errors

Centraliza exceções personalizadas utilizadas durante a execução da aplicação.

Exemplos:
- EntityNotFoundException
- ValidationException
- DatabaseException

Essas exceções permitem apresentar mensagens claras ao usuário.

---

### Utils

Contém funções auxiliares reutilizadas em diversos módulos.

Exemplos:
- formatação de textos;
- validação de entradas;
- conversões;
- utilidades gerais.

---

### View

Contém componentes compartilhados entre os diferentes menus da aplicação.
Essa organização reduz duplicação de código.

---

# 🔄 Fluxo das Camadas

Quando o usuário realiza uma operação, o fluxo ocorre da seguinte maneira:

```text
Usuário
↓
Menu CLI
↓
View
↓
Service
↓
Repository
↓
PostgreSQL
↓
Repository
↓
Service
↓
View
↓
Usuário
```

Cada camada possui apenas uma responsabilidade.

Essa abordagem segue o princípio **Single Responsibility Principle (SRP)** do SOLID.

---

# 🎯 Benefícios da Arquitetura

A arquitetura adotada oferece diversas vantagens:
- baixo acoplamento;
- alta coesão;
- facilidade de manutenção;
- maior reutilização de código;
- separação clara das responsabilidades;
- melhor organização dos arquivos;
- facilidade para implementação de testes futuros;
- maior escalabilidade da aplicação.

Essa estrutura é semelhante à utilizada em aplicações empresariais desenvolvidas com Node.js e TypeScript.

---

# 🏗 Padrões de Projeto Utilizados

Durante o desenvolvimento foram aplicados diversos padrões de projeto, entre eles:

## Repository Pattern

Responsável por abstrair o acesso ao banco de dados.

Benefícios:
- desacoplamento;
- reutilização;
- facilidade de manutenção.

---

## Service Layer

Centraliza toda regra de negócio da aplicação.

Benefícios:
- código organizado;
- responsabilidades bem definidas;
- reutilização.

---

## DTO Pattern

Padroniza a transferência de dados entre as camadas.

Benefícios:
- validação;
- encapsulamento;
- menor acoplamento.

---

## Dependency Separation

Cada camada conhece apenas a camada imediatamente inferior, reduzindo dependências desnecessárias.

Essa organização aproxima o projeto dos padrões adotados em aplicações Back-End profissionais.

# 🗄 Banco de Dados

O **BookStore Manager CLI** utiliza o **PostgreSQL** como sistema gerenciador de banco de dados (SGBD), garantindo persistência das informações, integridade referencial e suporte às consultas relacionais exigidas pelo projeto.

A estrutura do banco foi desenvolvida utilizando scripts SQL organizados no projeto, permitindo que qualquer avaliador recrie o ambiente apenas executando os arquivos disponibilizados.

Durante a modelagem foram utilizados:
- Chaves Primárias (Primary Keys);
- Chaves Estrangeiras (Foreign Keys);
- Índices para otimização de consultas;
- Restrições de integridade;
- Relacionamentos entre tabelas;
- Scripts de inicialização e carga de dados.

---

# 📐 Modelo Conceitual

O sistema foi modelado utilizando entidades independentes e relacionamentos entre elas.

![Modelo Entidade-Relacionamento](sql/dml/img.png)

Além das entidades principais, o sistema possui módulos auxiliares para gerenciamento administrativo.

```text
USUÁRIO
PERFIL
MUNICÍPIO
SESSÃO
```

Essa organização torna a aplicação preparada para futuras expansões sem necessidade de grandes alterações estruturais.

---

# 📚 Entidades do Sistema

## 👤 Autor

Representa os escritores cadastrados na livraria.
Cada autor pode possuir diversos livros cadastrados.

### Responsabilidades

- cadastro de autores;
- atualização dos dados;
- consulta por identificador;
- listagem;
- remoção.

### Principais atributos

- identificador;
- nome;
- nacionalidade;
- data de nascimento;
- data de cadastro.

---

## 📖 Livro

Representa os livros disponíveis para empréstimo.

Todo livro obrigatoriamente pertence a um autor previamente cadastrado.

### Responsabilidades

- cadastro;
- atualização;
- consulta;
- remoção;
- controle de disponibilidade.

### Principais atributos

- identificador;
- título;
- ISBN;
- quantidade;
- disponibilidade;
- autor.

### Relacionamentos

Um livro pertence a um ou mais autores.
Um livro pode possuir diversos empréstimos ao longo do tempo.

---

## 👥 Cliente

Representa os clientes da livraria.
São responsáveis pelos empréstimos realizados.

### Responsabilidades

- cadastro;
- atualização;
- consulta;
- exclusão;
- histórico de empréstimos.

### Principais atributos

- identificador;
- nome;
- CPF;
- telefone;
- e-mail;
- município.

---

## 📄 Empréstimo

Controla a retirada e devolução dos livros.
É a principal entidade de negócio da aplicação.

### Informações registradas

- cliente;
- livro;
- data do empréstimo;
- data prevista;
- data de devolução;
- situação.

Essa entidade controla toda disponibilidade dos livros.

---

## 👨 Usuário

O sistema possui gerenciamento de usuários administrativos.
Esses usuários são responsáveis pela utilização da aplicação.
Sua estrutura foi preparada para futuras implementações de autenticação e controle de acesso.

---

## 🔐 Perfil

Representa os níveis de acesso do sistema.

Cada usuário poderá possuir um perfil associado.

Exemplos:
- Administrador;
- Operador;
- Bibliotecário.

Essa separação facilita futuras implementações de autorização.

---

## 🌎 Município

Representa os municípios cadastrados no sistema.

Essa entidade evita duplicação de dados de localização e melhora a normalização do banco.

Relacionamentos:
```text
Município
↓
Clientes
```
---

## 🔑 Sessão

A aplicação possui gerenciamento de sessão para manter informações do usuário autenticado durante a execução.
Essa estrutura facilita futuras evoluções da aplicação, como autenticação e autorização por perfil.

---

# 🔗 Relacionamentos

Os relacionamentos implementados seguem as boas práticas da modelagem relacional.

## Autor → Livro

Um autor pode possuir vários livros.
Um livro pertence a um ou mais autores.

Relacionamento:

```text
Autor 1 ---- N Livro
```

---

## Livro → Empréstimo

Um livro pode ser emprestado diversas vezes ao longo de sua existência.

Relacionamento:

```text
Livro 1 ---- N Empréstimos
```

---

## Cliente → Empréstimo

Um cliente pode realizar diversos empréstimos.

Relacionamento:

```text
Cliente 1 ---- N Empréstimos
```

---

## Perfil → Usuário

Cada usuário possui um perfil.

Relacionamento:

```text
Perfil 1 ---- N Usuários
```

---

## Município → Cliente

Um município pode possuir diversos clientes cadastrados.

Relacionamento:

```text
Município 1 ---- N Clientes
```

---

# 🔒 Integridade Referencial

Para garantir consistência dos dados, o banco utiliza chaves estrangeiras.

Exemplos de validações:

- não permitir livro sem autor;
- impedir empréstimo para cliente inexistente;
- impedir empréstimo de livro inexistente;
- impedir exclusão de registros utilizados por outras tabelas;
- garantir integridade dos relacionamentos.

Essas regras são reforçadas tanto pelo banco de dados quanto pelas validações implementadas na camada de serviços.

---

# 📈 Índices

Com o objetivo de melhorar o desempenho das consultas, foram utilizados índices nas principais tabelas do sistema.

Os índices permitem:

- consultas mais rápidas;
- melhor desempenho em JOINs;
- otimização de ORDER BY;
- melhor performance em pesquisas por identificador.

---

# 📦 Persistência dos Dados

Toda persistência é realizada utilizando PostgreSQL.

As operações executadas pela aplicação incluem:

- INSERT
- UPDATE
- DELETE
- SELECT
- JOIN
- GROUP BY
- ORDER BY
- LIMIT
- funções de agregação

Todo acesso ao banco ocorre exclusivamente através da camada **Repository**, preservando a separação de responsabilidades e mantendo a arquitetura desacoplada.

# 🧩 Módulos da Aplicação

O **BookStore Manager CLI** foi desenvolvido de forma modular, permitindo que cada funcionalidade da aplicação seja isolada em componentes específicos.
Essa organização reduz o acoplamento entre as classes, facilita a manutenção do código e possibilita a evolução da aplicação sem impacto nas demais funcionalidades.
A seguir são descritos os principais módulos do sistema.

---

# 📖 Módulo de Autores

O módulo de autores é responsável pelo gerenciamento dos escritores cadastrados na livraria.

## Funcionalidades

- cadastrar autor;
- listar autores;
- consultar autor por identificador;
- atualizar informações;
- remover autor.

## Regras de negócio

- não permite cadastro com dados obrigatórios ausentes;
- impede operações sobre autores inexistentes;
- garante integridade entre autores e livros cadastrados.

---

# 📚 Módulo de Livros

Este módulo realiza o gerenciamento do acervo da livraria.

## Funcionalidades

- cadastrar livros;
- consultar livros;
- atualizar cadastro;
- excluir livros;
- listar livros disponíveis;
- listar livros emprestados.

## Regras de negócio

- todo livro deve possuir um autor cadastrado;
- livros emprestados não podem ser disponibilizados simultaneamente para outro empréstimo;
- o sistema controla automaticamente a disponibilidade dos exemplares.

---

# 👥 Módulo de Clientes

Responsável pelo gerenciamento dos clientes que utilizam a biblioteca.

## Funcionalidades

- cadastro;
- atualização;
- consulta;
- exclusão;
- consulta de empréstimos realizados.

## Regras

- clientes inexistentes não podem realizar empréstimos;
- todas as operações são validadas antes da persistência.

---

# 📄 Módulo de Empréstimos

Representa a principal funcionalidade da aplicação.

É responsável pelo controle da circulação dos livros.

## Funcionalidades

- registrar empréstimos;
- registrar devoluções;
- consultar empréstimos ativos;
- consultar histórico de empréstimos.

## Regras de negócio

- somente livros disponíveis podem ser emprestados;
- um livro emprestado torna-se indisponível;
- após devolução o livro volta automaticamente ao status disponível;
- não é possível devolver um empréstimo inexistente.

---

# 👤 Módulo de Usuários e Perfis

O controle dos usuários responsáveis pelo gerenciamento dos usuários administrativos da aplicação, dispõe de estrutura preparada para futuras implementações de autenticação e autorização.
Com os perfis de usuários, será permitido controlar os diferentes níveis de acesso do sistema.

Exemplos:
- administrador;
- operador;
- bibliotecário.

Esse módulo facilita futuras expansões relacionadas à segurança.

---

# 🌎 Módulo de Municípios

Centraliza os municípios utilizados no cadastro dos usuários e clientes.
Não é controlada pelos usuários.

Benefícios:
- evita duplicação de informações;
- melhora a normalização do banco de dados;
- reduz inconsistências de cadastro.

---

# 📊 Módulo de Relatórios

O sistema disponibiliza consultas gerenciais utilizando SQL relacional.

Entre os principais relatórios encontram-se:
- livros disponíveis;
- livros emprestados;
- livros por autor;
- clientes com empréstimos ativos;
- quantidade de empréstimos por livro;
- consultas estatísticas.

Esses relatórios utilizam recursos como:
- INNER JOIN;
- LEFT JOIN;
- GROUP BY;
- ORDER BY;
- LIMIT;
- funções de agregação.

---

# ⚙️ Camada Service

A camada **Service** concentra todas as regras de negócio da aplicação.
Cada serviço possui responsabilidade específica, evitando duplicação de código e mantendo a aplicação organizada.

Principais responsabilidades:
- validações;
- aplicação das regras de negócio;
- coordenação entre múltiplos repositórios;
- tratamento das exceções;
- retorno de informações para a camada View.

---

# 🗃️ Camada Repository

Os repositórios encapsulam toda comunicação com o PostgreSQL.

São responsáveis por:
- executar consultas SQL;
- realizar inserções;
- atualizar registros;
- excluir informações;
- mapear os resultados retornados pelo banco.

Essa abordagem segue o **Repository Pattern**, separando completamente o acesso aos dados da lógica de negócio.

---

# 🖥️ Camada View

A View representa a interface de linha de comando (CLI).

Responsabilidades:
- apresentar menus;
- solicitar dados ao usuário;
- exibir mensagens;
- encaminhar operações para os Services.

Toda a lógica de negócio permanece fora dessa camada.

---

# 📦 DTOs (Data Transfer Objects)

O projeto utiliza DTOs para padronizar a comunicação entre as camadas da aplicação.

Os DTOs têm como objetivos:
- encapsular informações;
- reduzir acoplamento;
- facilitar validações;
- evitar exposição direta das entidades persistidas.

Essa prática melhora significativamente a organização do código.

---

# 🛡️ Tratamento de Exceções

A aplicação implementa tratamento centralizado de erros utilizando exceções customizadas.

Entre os cenários tratados estão:
- entidade inexistente;
- dados inválidos;
- erros de banco de dados;
- falhas de validação;
- operações não permitidas.

Essa abordagem melhora a experiência do usuário e facilita a manutenção do sistema.

---

# 📝 Logger

O projeto possui infraestrutura preparada para registro de eventos da aplicação.

O logger permite registrar:
- operações executadas;
- mensagens informativas;
- erros;
- exceções.

Essa funcionalidade é bastante utilizada em aplicações corporativas para auditoria e monitoramento.

---

# 🔄 Fluxo de Execução

O fluxo de uma operação segue o padrão abaixo:

```text
Usuário
↓
Menu Principal
↓
View
↓
Service
↓
Repository
↓
PostgreSQL
↓
Repository
↓
Service
↓
View
↓
Usuário
```

Esse fluxo garante que cada camada execute apenas as responsabilidades que lhe competem, mantendo o sistema organizado, desacoplado e alinhado às boas práticas de desenvolvimento de software.

# ⚙️ Funcionalidades Implementadas

O **BookStore Manager CLI** disponibiliza um conjunto de funcionalidades para gerenciamento completo da livraria, permitindo o controle de autores, livros, clientes, usuários, perfis, municípios e empréstimos.

As funcionalidades foram implementadas seguindo uma arquitetura em camadas, garantindo organização, reutilização de código e facilidade de manutenção.

---

# 📖 Gerenciamento de Autores

O sistema permite realizar todas as operações de CRUD (Create, Read, Update e Delete) para autores.

### Funcionalidades

- ✅ Cadastrar autor;
- ✅ Consultar autor por ID;
- ✅ Listar todos os autores;
- ✅ Atualizar informações;
- ✅ Remover autor.

### Validações

- Não permite cadastro com campos obrigatórios vazios;
- Verifica existência do autor antes de alterações;
- Impede operações sobre registros inexistentes;
- Exibe mensagens amigáveis em caso de erro.

---

# 📚 Gerenciamento de Livros

O módulo de livros é responsável pelo controle do acervo da biblioteca.

### Funcionalidades

- ✅ Cadastrar livro;
- ✅ Consultar livro;
- ✅ Atualizar cadastro;
- ✅ Excluir livro;
- ✅ Listar livros disponíveis;
- ✅ Listar livros emprestados.

### Validações

- Todo livro deve possuir um autor válido;
- O sistema impede empréstimos de livros indisponíveis;
- Não permite operações sobre livros inexistentes;
- Valida a integridade dos dados antes da persistência.

---

# 👥 Gerenciamento de Clientes

Permite controlar os clientes que realizam empréstimos.

### Funcionalidades

- ✅ Cadastro;
- ✅ Consulta;
- ✅ Atualização;
- ✅ Exclusão;
- ✅ Listagem.

### Validações

- Verificação de existência do cliente;
- Consistência dos dados informados;
- Tratamento de registros inexistentes.

---

# 👤 Gerenciamento de Usuários e Perfis de acesso

O sistema possui gerenciamento administrativo de usuários.
Essa estrutura possibilita futuras implementações de autenticação e autorização.
A separação por perfis de acesso facilita o controle futuro de permissões.

---

# 🌎 Gerenciamento de Municípios

Responsável pelo cadastro e manutenção dos municípios utilizados no sistema.
Atualmente a responsabilidade pelo controle não é realizada pelo usuário, mas está preparado para receber a implementações futuras.

- Evita duplicação de dados;
- Melhora a normalização do banco;
- Facilita futuras consultas geográficas.

---

# 📄 Controle de Empréstimos

O módulo de empréstimos representa a principal funcionalidade do sistema.

Ele controla toda movimentação dos livros.

## Funcionalidades

- Registrar empréstimo;
- Registrar devolução;
- Consultar empréstimos;
- Consultar histórico.

### Processo de Empréstimo

Durante o empréstimo são realizadas diversas validações.

Fluxo simplificado:

```text
Selecionar Cliente
↓
Selecionar Livro
↓
Validar Cliente
↓
Validar Livro
↓
Verificar Disponibilidade
↓
Registrar Empréstimo
↓
Atualizar Disponibilidade
↓
Exibir Confirmação
```

---

### Processo de Devolução

Ao registrar uma devolução, o sistema:
- localiza o empréstimo;
- registra a data de devolução;
- altera automaticamente a disponibilidade do livro;
- confirma a operação ao usuário.

Fluxo:

```text
Selecionar Empréstimo
↓
Validar Existência
↓
Registrar Devolução
↓
Atualizar Livro
↓
Confirmar Operação
```

---

# 📊 Relatórios

A aplicação disponibiliza consultas gerenciais que facilitam o acompanhamento do acervo.

Entre os principais relatórios encontram-se:
- livros disponíveis;
- livros emprestados;
- livros por autor;
- quantidade de empréstimos por livro;
- clientes com empréstimos ativos;

Os relatórios utilizam consultas SQL relacionais para obtenção das informações.

---

# 📋 Regras de Negócio

A camada de serviços concentra todas as regras de negócio da aplicação.

Entre as principais regras implementadas destacam-se:

## Autores

- Todo livro deve possuir um autor previamente cadastrado.

---

## Livros

- Um livro somente pode ser emprestado se estiver disponível.

---

## Clientes

- Apenas clientes cadastrados podem realizar empréstimos.

---

## Empréstimos

- Não é permitido emprestar um livro inexistente.
- Não é permitido emprestar um livro indisponível.
- A devolução atualiza automaticamente o status do livro.
- Não é possível devolver empréstimos inexistentes.

---

## Integridade Referencial

O sistema respeita os relacionamentos definidos no banco de dados.

Exemplos:
- livro depende de autor;
- empréstimo depende de cliente;
- empréstimo depende de livro;

Essa abordagem garante consistência das informações armazenadas.

---

# 🔎 Validação dos Dados

Antes de qualquer operação são realizadas validações para garantir a integridade das informações.

Entre elas:
- campos obrigatórios;
- existência dos registros;
- disponibilidade dos livros;
- integridade dos relacionamentos;
- consistência dos dados informados.

Quando alguma validação falha, uma mensagem apropriada é apresentada ao usuário e a operação é cancelada.

---

# 🔄 Persistência

Todas as alterações realizadas pelo usuário são persistidas imediatamente no PostgreSQL através da camada Repository.

As operações de persistência incluem:
- INSERT;
- UPDATE;
- DELETE;
- SELECT.

Nenhuma consulta SQL é executada diretamente pela camada View, mantendo a separação entre interface, regras de negócio e acesso aos dados.

---

# 🎯 Benefícios da Implementação

A organização adotada proporciona diversas vantagens:
- código modular;
- fácil manutenção;
- reutilização de componentes;
- separação de responsabilidades;
- arquitetura escalável;
- maior legibilidade;
- facilidade para implementação de testes futuros;
- aderência às boas práticas de desenvolvimento Back-End.

# 🛡 Tratamento de Erros

O sistema implementa tratamento de exceções em todas as operações críticas, garantindo que falhas não interrompam a execução da aplicação.
Todas as operações que realizam acesso ao banco de dados utilizam tratamentos de exceção, permitindo capturar erros de conexão, consultas SQL inválidas e inconsistências de dados.

Essa abordagem garante maior robustez e melhora a experiência do usuário.

---

# 🚨 Situações Tratadas

A aplicação trata diversos cenários de erro, entre eles:
- Autor inexistente;
- Livro inexistente;
- Cliente inexistente;
- Município inexistente;
- Usuário inexistente;
- Empréstimo inexistente;
- Livro indisponível;
- Dados inválidos;
- Erros de conexão com PostgreSQL;
- Falhas de persistência;
- Entradas inválidas informadas pelo usuário.

Sempre que uma operação não pode ser realizada, o sistema apresenta uma mensagem clara ao usuário sem encerrar a aplicação.

---

# 💻 Recursos do TypeScript

Durante o desenvolvimento foram utilizados diversos recursos da linguagem TypeScript.

## Classes

As entidades do domínio foram implementadas utilizando classes.

Exemplos:
- Author
- Book
- Customer
- Borrow
- User
- Profile
- Municipality

---

## Interfaces

O projeto utiliza interfaces para definir contratos entre componentes da aplicação.

Benefícios:
- desacoplamento;
- padronização;
- reutilização;
- tipagem forte.

---

## Modificadores de acesso

Foram utilizados modificadores como:

```typescript
public
private
protected
```

Esses modificadores garantem encapsulamento e proteção dos dados.

---

## Tipagem estática

Todos os parâmetros e retornos dos métodos são tipados.

Exemplo:

```typescript
async findById(id: number): Promise<Book | null>
```

Isso reduz erros durante o desenvolvimento e facilita a manutenção do código.

---

## Async / Await

Toda comunicação com o banco de dados utiliza programação assíncrona.

Exemplo:

```typescript
const books = await repository.findAll();
```

Essa abordagem melhora a legibilidade do código e evita callbacks aninhados.

---

## Programação Orientada a Objetos

Foram aplicados conceitos como:
- encapsulamento;
- abstração;
- reutilização;
- separação de responsabilidades.

---

# 🗃 Consultas SQL

Toda persistência da aplicação é realizada utilizando comandos SQL executados através da biblioteca **pg**.

Entre as operações implementadas estão:

## Inserção

```sql
INSERT INTO
```

---

## Atualização

```sql
UPDATE
```

---

## Exclusão

```sql
DELETE
```

---

## Consulta

```sql
SELECT
```

---

## INNER JOIN

Utilizado para relacionar informações entre:
- livros;
- autores;
- clientes;
- empréstimos.

---

## LEFT JOIN

Utilizado em consultas onde nem todos os registros possuem relacionamento obrigatório.

---

## GROUP BY

Empregado nos relatórios estatísticos.

Exemplo:

Quantidade de empréstimos por livro.

---

## ORDER BY

Utilizado para ordenar resultados por:

- nome;
- data;
- quantidade;
- título.

---

## LIMIT

Empregado para restringir resultados quando necessário.

---

## Funções de agregação

O projeto utiliza funções como:

```sql
COUNT()
MAX()
MIN()
```

Essas funções são utilizadas principalmente na geração de relatórios.

---

# 🔄 Fluxo Geral da Aplicação

A aplicação segue um fluxo organizado em camadas.

```text
Usuário
↓
Menu Principal
↓
View
↓
Service
↓
Repository
↓
PostgreSQL
↓
Repository
↓
Service
↓
View
↓
Usuário
```

Cada camada possui responsabilidade única, reduzindo acoplamento e facilitando manutenção.

---

# 🖥 Exemplos de Utilização

## Cadastro de Autor

```text
Cadastrando autor...
Informe o nome do autor 
nome: Novo autor
Deseja gravar o autor? (S/N): S
Autor cadastrado com sucesso! ID: 8 - Nome: NOVO AUTOR
```

---

## Cadastro de Livro

```text
Cadastrando livro...
Informe os dados do livro
titulo: NOVO LIVRO
editora: EDITORA
edicao: 1ED
ano_publicacao: 2021
baixado: N
codigo: X999123
isbn: 9788598078359
Informe o ID do autor: 8
Autor Novo autor adicionado ao livro.
Deseja adicionar novo autor para este livro? (S/N): N
Continuando...
Deseja gravar o livro? (S/N): S
Livro cadastrado com sucesso! Cod. int. X999123: NOVO LIVRO
```

---

## Registro de Empréstimo

```text
Cadastrando empréstimo...
Informe os dados do empréstimo: 
cliente_id: 1
Informe o ID do livro: 13
Livro MAIS UM LIVRO adicionado ao empréstimo.
Deseja adicionar novo livro para este empréstimo? (S/N): N
Continuando...
Deseja gravar o empréstimo? (S/N): S

Empréstimo cadastrado com sucesso!
```

---

## Registro de Devolução

```text
Registrando devolução...

Pesquisando por Empréstimo...
Informe o ID do empréstimo: 24
----------
Empréstimo ID: #24 Data empréstimo: 19/07/2026
Cliente: #1: MARIA BASTIANA

Livro(s):
#13 - xx955: MAIS UM LIVRO
Autor(es): Sara Shepard
Editora: editora • 1ed • 2020 • ISBN: 85-98078-35-2
Data prevista devolução: 29/07/2026 • Devolução: - 
Status: Em dia



ATENÇÃO! Confira os livros recebidos antes de finalizar a devolução!
Deseja devolver todos os livros deste empréstimo? (S/N): S

Devolução dos livros realizada com sucesso!
```

---

## Livro Indisponível

```text
Cadastrando empréstimo...
Informe os dados do empréstimo: 
cliente_id: 1
Informe o ID do livro: 9
Error: Não é possível emprestar este livro pois ele não está mais disponível.
```

---

## Cliente inexistente

```text
Cadastrando empréstimo...
Informe os dados do empréstimo: 
cliente_id: 65654
Error: Cliente não encontrado
```

---

## Relatório de clientes com empréstimo ativo

```text
Buscar por ID do cliente: (Deixe em branco para listar TODOS) 

================================================================================
   RELATÓRIO DE CLIENTES COM EMPRÉSTIMO ATIVO - DATA GERAÇÃO 19/07/2026
================================================================================
Cliente: #1: MARIA BASTIANA
#8 - Cod. int. xxx987: NOVO
Autor(es): Fabio Aguiar, Paulo Caroli
Editora: novo • 1ed • 2020 • ISBN: 85-01-11206-2 
Empréstimo #13 • Data empréstimo: 15/07/2026 • Data prevista devolução: 25/07/2026
Status: Em dia

#9 - Cod. int. xxx988: OUTRO
Autor(es): Fabio Aguiar
Editora: nova • 1ed • 2020 • ISBN: 85-01-06746-6 
Empréstimo #13 • Data empréstimo: 15/07/2026 • Data prevista devolução: 16/07/2026
Status: **Em atraso há 3 dia(s)**

----------------------------------------
   TOTAL: 2 livro(s) emprestado(s)
--------------------------------------------------------------------------------

Cliente: #2: JOANA DARC
#1 - Cod. int. xxx023: PRETTY LITTLE LIARS
Autor(es): Sara Shepard
Editora: Editora • 1ED • 2020 • ISBN: 85-7980-025-0 
Empréstimo #12 • Data empréstimo: 15/07/2026 • Data prevista devolução: 25/07/2026
Status: Em dia

----------------------------------------
   TOTAL: 1 livro(s) emprestado(s)
--------------------------------------------------------------------------------
================================================================================
```

---

# 📈 GitFlow

Durante o desenvolvimento foi utilizado o fluxo de versionamento baseado em GitFlow.

Branches principais:

```text
main
develop
feat*
docs*
```

Essa estratégia facilita a organização do histórico e o acompanhamento da evolução do projeto.

---

# 🚀 Melhorias Futuras

O projeto foi desenvolvido de forma modular, permitindo diversas evoluções.

Entre elas:

- autenticação completa de usuários;
- autorização por perfil;
- paginação das consultas;
- exportação para PDF;
- exportação para Excel;
- envio de notificações;
- API REST utilizando a mesma camada Service;
- interface Web;
- testes automatizados;
- integração contínua (CI/CD);
- containerização completa com Docker.

---

# 👨‍💻 Integrantes

**Projeto desenvolvido por:**

- Ailem Santos 

Curso:
**Desenvolvedor(a) Back-End Node.js - T1**

Instituição:
**SCTEC**

Ano:
**2026**

---

# 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos, como parte da avaliação do curso **Desenvolvedor(a) Back-End Node.js**.
Sua utilização possui finalidade educacional, demonstrando a aplicação prática dos conceitos estudados durante a formação.

---

# ⭐ Considerações Finais

O **BookStore Manager CLI** foi desenvolvido buscando aproximar-se da estrutura de aplicações corporativas utilizadas no mercado.

Durante sua implementação foram aplicados conceitos fundamentais de engenharia de software, arquitetura em camadas, programação orientada a objetos, persistência de dados com PostgreSQL, programação assíncrona, tratamento de exceções e boas práticas de desenvolvimento.

Além dos requisitos obrigatórios propostos pela atividade, foram implementadas soluções voltadas para escalabilidade, reutilização de código e organização arquitetural, proporcionando uma base sólida para futuras evoluções da aplicação.