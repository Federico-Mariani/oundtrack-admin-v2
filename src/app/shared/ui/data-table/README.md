# DataTable

Tabella riutilizzabile, basata su Spartan Helm e TanStack Angular Table 9.
Senza `remote` ricerca, ordinamento e paginazione avvengono localmente sull’intera collezione.

## Contratto

| Input / output            | Scopo                                                                       |
| ------------------------- | --------------------------------------------------------------------------- |
| `columns`                 | Definizioni TanStack tipizzate con `DataTableFeatures` e il modello di riga |
| `data`                    | Collezione readonly di righe                                                |
| `getRowId`                | Funzione che restituisce un ID stabile e univoco, indipendente dall'indice  |
| `caption`                 | Nome accessibile della tabella, tradotto dalla feature                      |
| `loading`                 | Caricamento iniziale o aggiornamento della collezione                       |
| `errorMessage`            | Messaggio già tradotto, oppure `null`                                       |
| `searchable`              | Mostra la ricerca testuale; default `true`                                  |
| `initialColumnVisibility` | Visibilità iniziale delle colonne, ripristinata dal reset                   |
| `retry`                   | Richiesta di ripetere il caricamento, gestita dalla pagina tramite facade   |

Per un esempio completo consultare `features/movies/presentation/components/movies-table/`.

## Comportamenti

- Ricerca sulle colonne accessor abilitate con `enableGlobalFilter`.
- Ordinamento singolo tramite gli header e il menu «Ordina», anche sulle colonne nascoste; definire `sortFn` per date e numeri.
- Pagine da 10, 20, 25, 50 o 100 righe, con conteggio dei risultati filtrati.
- Menu delle colonne visibili e densità compatta/comoda.
- Ridimensionamento tramite mouse o touch; frecce sinistra/destra da tastiera
  (10 px, oppure 40 px con Shift). Invio o doppio clic ripristinano la larghezza.
- `size`, `minSize`, `maxSize` e `enableResizing` sono definiti dalle colonne della feature.
- Le colonne indispensabili possono usare `enableHiding: false`.
- Il pulsante di ripristino azzera filtri e preferenze della vista.
- Le preferenze durano quanto l'istanza del componente; non vengono salvate in storage o NgRx.

I testi generici appartengono allo scope locale `dataTable`; i titoli delle colonne e le azioni
appartengono alla feature. Per gli header testuali, il menu delle colonne riusa il testo dell'header;
per header personalizzati usa l'ID della colonna. Non usare ID tradotti: devono rimanere stabili.

Ricerca, menu e paginazione sono esterni al contenitore arrotondato dei dati e riusano
i componenti condivisi `Button`, `IconButton` e `Select`. Le larghezze delle colonne
sono esplicite: lo spazio libero viene distribuito alle colonne ridimensionabili, rispettando
`maxSize`. Non vengono aggiunte colonne vuote dopo le azioni. Prevedere almeno una colonna
con `maxSize` sufficiente per riempire i viewport supportati.

Il trascinamento sposta il confine tra due colonne adiacenti ridimensionabili, mantenendo
fermi gli altri confini e rispettando entrambi i limiti. Al confine finale la tabella può
allargarsi con scroll orizzontale, ma non si restringe sotto la larghezza del contenitore.
Le colonne fisse (come le azioni) mantengono la loro dimensione. Su schermi stretti
le colonne conservano dimensioni leggibili e la tabella scorre orizzontalmente.

## Confini architetturali

`DataTable` non conosce API, facade, modelli di dominio o servizi di `core`.
La pagina legge dati/loading/error dalla facade e gestisce le azioni emesse dal componente
specifico della feature. Mapper, colonne e celle Movies restano nella presentation Movies.
Le traduzioni e la formattazione delle date non entrano nello Store.

## Modalità server

Passare `remote: { page, limit, total, search, filtered }` e in `data` solo la pagina restituita.
Le pagine del contratto partono da 1; l’indice TanStack parte da 0, convertito solo nel componente.
`total` è il totale filtrato del server. La tabella non filtra, ordina o pagina nuovamente le righe.

Gestire `pageChange`, `searchChange`, `resetQuery` nella presentation tramite facade. In modalità
server i controlli di ordinamento locale sono disattivati: il consumatore configura solo gli
ordinamenti supportati dalle proprie API, ad esempio nel pannello `ListFilters`. Durante il
caricamento i controlli di pagina sono disabilitati; ricerca e filtri possono sostituire una richiesta.

I contratti `PageRequest`, `PageResult<T>` e `ListQuery<TFilters, TSort>` sono in `shared/types/pagination`.
Gli adattatori per query HTTP e risposta `{ data, meta }` sono in `core/http`. La tabella non importa
questi adattatori, né conosce i filtri Movies. `ListFilters` riceve campi/etichette/opzioni e valori,
gestisce una bozza, valida numeri/intervalli e invia i criteri solo su Applica.

Ogni feature mantiene query e risultato nel proprio Store, con mapper espliciti e `switchMap`
per annullare le richieste superate. Movies applica 300 ms di debounce alla ricerca, conserva i
criteri tra pagine/refresh, torna a pagina 1 su nuovi criteri e recupera l’ultima pagina valida
se il totale diminuisce. Non costruire un repository generico o un unico Store globale per le liste.

## Verifica

Gli spec della tabella verificano i controlli resi disponibili dalla nostra UI: navigazione,
ricerca, stati, ordinamento, ridimensionamento, visibilità, densità e cambio lingua.
L'integrazione Movies verifica scope lazy, date e inoltro delle azioni con l'ID corretto.
