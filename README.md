# Oundtrack Admin v2

Pannello di amministrazione di **Oundtrack**, sviluppato con **Angular 22** seguendo i principi
di **Clean Architecture**, **DDD pragmatico** e lo **NgRx Global Store** (`createFeature` /
`createActionGroup` / `createReducer` / effects funzionali / facades).

---

## Indice

- [Stack tecnologico](#stack-tecnologico)
- [Prerequisiti](#prerequisiti)
- [Installazione](#installazione)
- [Configurazione degli environment](#configurazione-degli-environment)
- [Avvio del progetto per environment](#avvio-del-progetto-per-environment)
- [Build per environment](#build-per-environment)
- [Qualità del codice](#qualità-del-codice)
- [Test](#test)
- [Architettura](#architettura)
- [Struttura del progetto](#struttura-del-progetto)
- [Path alias](#path-alias)
- [Regole e convenzioni](#regole-e-convenzioni)

---

## Stack tecnologico

- **Angular 22** (standalone components, signals, native control flow, `inject()`, `OnPush`).
- **TypeScript 6** in strict mode.
- **NgRx 22** Global Store (`@ngrx/store`, `@ngrx/effects`, `@ngrx/store-devtools`).
- **RxJS 7.8**.
- **Tailwind CSS 4** (`@tailwindcss/postcss`, `tw-animate-css`).
- **Spartan UI** (`@spartan-ng/brain` + componenti `helm` in `libs/ui/*`) e **@ng-icons** (Lucide).
- **@tanstack/angular-charts** per i grafici, **embla-carousel**, **ngx-scrollbar**.
- **jwt-decode** per la gestione dei token di autenticazione.
- **Vitest** (via `ng test`) come test runner.
- **ESLint 10** (flat config) + **Prettier 3** per qualità e formattazione.

## Prerequisiti

- **Node.js**: `^22.22.3 || ^24.15.0 || >=26.0.0` (vedi campo `engines` in `package.json`).
- **npm** `11.19.1` (indicato in `packageManager`).

## Installazione

```bash
npm install
```

## Configurazione degli environment

Gli environment vivono in `src/environments/` e vengono sostituiti a build time tramite i
`fileReplacements` definiti in `angular.json`.

| File                         | Configurazione Angular | Descrizione                                   |
| ---------------------------- | ---------------------- | --------------------------------------------- |
| `environment.ts`             | (default / base)       | Usato se nessuna sostituzione viene applicata |
| `environment.development.ts` | `development`          | Sviluppo locale                               |
| `environment.staging.ts`     | `staging`              | Ambiente di staging                           |
| `environment.production.ts`  | `production`           | Ambiente di produzione                        |
| `environment.example.ts`     | —                      | Template di riferimento (da copiare)          |

Ogni file espone un oggetto `environment` con la seguente forma:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  authStorageKey: 'oundtrack-admin.auth-session',
};
```

- `apiUrl`: base URL delle API consumate dalla UI.
- `authStorageKey`: chiave di `localStorage` usata per persistere la sessione di autenticazione.

> I valori reali di staging e produzione (host, credenziali, URL) sono segnaposto:
> sostituirli con i valori effettivi prima del deploy. Non committare credenziali reali.
> Per un nuovo ambiente partire da `environment.example.ts`.

> Nota sulle regole di import: `environment` è importato **solo** da infrastructure e dai
> composition root, tramite l'alias `@environments/*`.

## Avvio del progetto per environment

Il dev server (`ng serve`) usa di default la configurazione `development`.

```bash
# Development (default) — http://localhost:4200/
npm start
# equivalente:
ng serve

# Development (esplicito)
ng serve --configuration development

# Staging
ng serve --configuration staging

# Production
ng serve --configuration production
```

Una volta avviato il server, apri il browser su `http://localhost:4200/`. L'applicazione si
ricarica automaticamente a ogni modifica dei file sorgente.

## Build per environment

La build (`ng build`) usa di default la configurazione `production`.

```bash
# Production (default)
npm run build
# equivalente:
ng build

# Staging
ng build --configuration staging

# Development
ng build --configuration development

# Build in watch mode (configurazione development)
npm run watch
```

Gli artefatti vengono generati nella cartella `dist/`. La build di produzione ottimizza
l'applicazione (minificazione, `outputHashing`, budget sui bundle).

## Qualità del codice

Una modifica al codice **non è completa** finché tutti i comandi applicabili non passano.

```bash
# Lint (ESLint, --max-warnings=0)
npm run lint

# Lint con auto-fix sicuri
npm run lint:fix

# Formattazione (Prettier)
npm run format          # scrive
npm run format:check    # solo verifica

# Type check (app + spec)
npm run typecheck

# Tutto insieme: lint + format:check + typecheck (CI-ready)
npm run quality
```

## Test

```bash
# Unit test con Vitest (via ng test)
npm test
```

I file di test (`*.spec.ts`) risiedono accanto al codice che verificano. Fake e fixture a livello
di feature stanno in `features/<feature>/testing/`.

## Architettura

Clean Architecture **feature-first**. La regola delle dipendenze è:

```
presentation → facade → application/state → domain
infrastructure → domain / application ports
```

- `shared` e `core` non dipendono mai dalle feature.
- Le feature comunicano tra loro **solo** tramite la public API `@features/<feature>` (`index.ts`).
- NgRx: niente `@ngrx/signals`/SignalStore, niente `createFeatureSelector`, niente `Store` nella
  presentation, nessuno stato globale di loading/pending (ogni operazione ha il suo `RequestState`).

I confini sono **vincoli**, non suggerimenti: sono verificati da ESLint (`eslint.config.mjs` + `eslint/*.mjs`). Le
regole dettagliate e vincolanti vivono in `.junie/rules/`:

| File                                 | Ambito                                                 |
| ------------------------------------ | ------------------------------------------------------ |
| `.junie/rules/architecture.md`       | Layer, regola delle dipendenze, public API, alias      |
| `.junie/rules/ngrx.md`               | Convenzioni NgRx, facades, request state, concorrenza  |
| `.junie/rules/angular-typescript.md` | API Angular moderne, TypeScript strict, organizzazione |
| `.junie/rules/routing.md`            | Routing feature-owned: path, navigazione, guard, lazy  |
| `.junie/rules/testing.md`            | Cosa testare, dove e come                              |
| `.junie/rules/quality-gates.md`      | Comandi che devono passare prima di chiudere un task   |

## Struttura del progetto

```text
src/
├── main.ts
├── index.html
├── styles.css
├── environments/                 # environment configuration (dev, staging, prod, example, base)
└── app/
    ├── app.config.ts             # composition root (router, http, store, devtools, provideAuth)
    ├── app.routes.ts             # composizione delle routing API pubbliche delle feature + fallback
    ├── app.ts / app.html
    ├── core/                     # concern applicativi trasversali (es. http, forms)
    ├── shared/                   # primitive riutilizzabili e domain-agnostic (state/request, types)
    ├── presentation/             # layout e componenti UI condivisi a livello app
    └── features/                 # un folder per bounded context / vertical slice
        ├── auth/                 # autenticazione (login, sessione, guard, interceptor)
        └── home/                 # home
libs/ui/                          # componenti Spartan UI (helm)
```

Ogni feature segue lo schema:

```text
features/<feature>/
├── index.ts                      # PUBLIC API (unico punto d'ingresso cross-feature)
├── <feature>.providers.ts        # composition root (DI bindings, provideState, provideEffects)
├── domain/                       # modello di business in TypeScript puro
├── application/                  # ports, tokens, state (NgRx: actions/reducers/effects/facades)
├── infrastructure/               # HTTP, storage, DTO, mapper, interceptor
├── presentation/                 # pagine, componenti e routing della feature
└── testing/                      # fake e fixture per gli spec della feature
```

## Path alias

Definiti in `tsconfig.json`:

- `@app/*` → `src/app/*`
- `@shared/*` → `src/app/shared/*`
- `@features/*` → `src/app/features/*`
- `@environments/*` → `src/environments/*`
- `@spartan-ng/helm/*` → componenti UI in `libs/ui/*`

Dentro una feature usare import **relativi**; gli alias servono solo per attraversare i confini.

## Regole e convenzioni

- File piccoli e focalizzati, un concetto principale per file, nomi in **kebab-case**.
- Vietati `any`, file catch-all generici (`utils.ts`, `helpers.ts`, `types.ts`, ...).
- Solo API Angular moderne: standalone, `inject()`, `OnPush`, signals, native control flow.
- Non bypassare un errore di lint (`eslint-disable`, severità abbassata, ecc.): correggere il codice.
- Prima di considerare completato un task che tocca codice: `npm run quality`, poi `npm test` e
  `npm run build` quando la modifica può impattarli.

---

> Progetto generato inizialmente con [Angular CLI](https://github.com/angular/angular-cli) 22.2.1.
> Per il riferimento completo ai comandi CLI vedi la
> [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

## Rinnovo automatico della sessione

L'interceptor di autenticazione applica il bearer token solo alle richieste verso l'API configurata. Gli endpoint `auth/sign-in`, `auth/sign-up` e `auth/refresh` sono esclusi. Un errore HTTP 401 su una richiesta autenticata attiva il rinnovo; il testo localizzato dell'errore non viene interpretato.

Il coordinatore HTTP condivide un solo rinnovo tra le richieste concorrenti. L'operazione attraversa una porta applicativa: un effect NgRx chiama il repository con `POST /auth/refresh` e body `{ "refreshToken": "..." }`. La risposta aggiorna access token e refresh token nello store e nella persistenza. Ogni richiesta viene ripetuta al massimo una volta, conservando metodo, body, query e header.

La generazione della sessione cambia durante login, logout, ripristino e scadenza. Le risposte di una generazione precedente non possono ripristinare la sessione o ripetere richieste con le credenziali di un altro utente. Un 401 arrivato dopo un rinnovo già completato riutilizza la sessione aggiornata.

Un refresh token scaduto, un rinnovo rifiutato con 401/403 o un secondo 401 sul token aggiornato fanno scadere la sessione. Il layout protetto rimanda al login. Errori di rete e del server propagano l'errore senza cancellare la sessione; una richiesta successiva può tentare nuovamente. Al riavvio, una sessione con refresh token ancora valido viene ripristinata anche se l'access token è scaduto.

I test di integrazione usano store ed effect reali con backend HTTP simulato e coprono concorrenza, rotazione, persistenza, replay, errori e logout durante il rinnovo. Il coordinamento riguarda la singola istanza dell'applicazione, non schede browser diverse.
