# DataTable

Tabella **client-side** riutilizzabile, basata su Spartan Helm e TanStack Angular Table 9.
La feature fornisce l'intera collezione; ricerca, ordinamento e paginazione avvengono localmente.

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
- Pagine da 10, 25, 50 o 100 righe, con conteggio dei risultati filtrati.
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
sono esplicite: una colonna decorativa assorbe lo spazio libero del contenitore, senza
ridistribuirlo alle colonne dei dati durante il ridimensionamento.

## Confini architetturali

`DataTable` non conosce API, facade, modelli di dominio o servizi di `core`.
La pagina legge dati/loading/error dalla facade e gestisce le azioni emesse dal componente
specifico della feature. Mapper, colonne e celle Movies restano nella presentation Movies.
Le traduzioni e la formattazione delle date non entrano nello Store.

Non passare una sola pagina del server a questa tabella aspettandosi un ordinamento globale.
Quando le API introdurranno paginazione remota, servirà un contratto esplicito per query e totale,
con elaborazione manuale lato TanStack e gestione delle richieste nella feature.

## Verifica

Gli spec della tabella verificano i controlli resi disponibili dalla nostra UI: navigazione,
ricerca, stati, ordinamento, ridimensionamento, visibilità, densità e cambio lingua.
L'integrazione Movies verifica scope lazy, date e inoltro delle azioni con l'ID corretto.
