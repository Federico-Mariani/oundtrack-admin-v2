# DataTable

Tabella esclusivamente server-side, con Spartan Helm e TanStack Angular Table.
Riceve solo la pagina restituita dall’API. Non contiene motori di filtro, ricerca,
ordinamento o paginazione locale: ordine e righe rimangono quelli ricevuti.

## Contratto

- `data`, `columns`, `getRowId`, `caption`: righe, colonne e identità stabile.
- `remote` obbligatorio: `{ page, limit, total, search, filtered }`, pagina a partire da 1.
- `pageChange`: emette `{ page, limit }`; il cambio limite torna a pagina 1.
- `controls`: template dei controlli della feature, inserito nella barra condivisa.
- `loading`, `errorMessage`, `retry`: caricamento, errore e ripetizione della richiesta.
- `resetQuery`: richiesta di rimuovere i criteri dallo stato vuoto filtrato.
- `initialColumnVisibility`: preferenze iniziali della vista.

La feature mantiene query e dati nel proprio Store. La pagina usa solo la facade;
HTTP, DTO e traduzioni non entrano nella tabella. `PageRequest`, `PageResult<T>` e
`ListQuery<TFilters, TSort>` rimangono contratti puri in `shared/types/pagination`.
Gli adattatori HTTP sono in `core/http`.

## Barra dei controlli

`DataTableControls` compone ricerca/filtri della feature, menu vista e paginazione
nella barra superiore fuori dal box dei dati. La paginazione rimane sotto la tabella. Il menu vista contiene aggiornamento, colonne,
densità e ripristino delle preferenze. Le preferenze non cambiano la query.

La larghezza del contenitore determina il layout: sotto 64rem i filtri si aprono
in un dialog. La paginazione resta sempre sotto, con precedente/successiva e
selettore del limite; prima/ultima pagina vengono nascoste sui contenitori stretti. Lo spazio viene quindi misurato rispetto alla
barra, anche con sidebar aperta. Il riepilogo dei risultati accompagna la paginazione. La ricerca è limitata a 16rem; i campi usano placeholder con label accessibili
visivamente nascoste. La tabella conserva lo scroll orizzontale
quando le colonne raggiungono la loro larghezza minima o vengono allargate.
Il main della shell deve avere min-width: 0: il contenuto largo non deve
aumentare la dimensione minima del flex item accanto alla sidebar.

## Form reattivi riutilizzabili

La feature crea il proprio `AppFormController` con `AppFormField` e regole in
`core/forms`. `ListControls`, `ListFilters`, `TextInput` e `SelectField` ricevono
campi Angular Signal Forms già costruiti: shared non importa core o Movies.
Un solo renderer genera i filtri dalla configurazione `ListFilterField[]`.

Movies usa regole riutilizzabili per interi, limiti, lunghezza e intervalli tra
campi. Le modifiche valide aggiornano la query automaticamente, con debounce di
300 ms e annullamento delle richieste superate. Non esiste un pulsante Applica.
Valori non validi rimangono modificabili senza essere inviati. Cambiare pagina o
lingua dell’interfaccia non cancella le modifiche non valide; il reset le elimina.
La lingua dei metadati non è un filtro del catalogo.

Per aggiungere una lista: definire modello e regole del form nella feature,
passare i suoi campi ai componenti condivisi, mappare i valori nella query e usare
la facade per caricare la pagina. Non duplicare input, dialog, repository generici
o uno Store globale per tutte le liste.

## Dialog

`ModalService.open(ListFiltersModal, params, { viewContainerRef })` apre un componente dedicato.
Il chiamante non include template o elementi dialog nel proprio HTML. I parametri mantengono
il riferimento ai campi reattivi e il reset; chiudere la finestra non annulla i filtri applicati.
Vedere `shared/ui/modal/README.md` per parametri, risultati e gestione del ciclo di vita.

La paginazione deriva direttamente dai metadati server reattivi. I pulsanti e il callback
bloccano richieste oltre il totale e durante il caricamento. Gli shimmer sostituiscono le
righe durante ogni richiesta, mantenendo le colonne visibili; un solo stato accessibile
annuncia il caricamento. Le animazioni rispettano `prefers-reduced-motion`.

## Dimensionamento e verifica

`size`, `minSize`, `maxSize`, `enableResizing` appartengono alle colonne della
feature. Lo spazio libero riempie le colonne ridimensionabili; un confine interno
regola solo le due colonne adiacenti. Le azioni mantengono la larghezza fissa.

Gli spec verificano navigazione controllata, assenza di elaborazione locale,
form reattivi e validazione, reset, stato vuoto/errore, dimensionamento e traduzioni.
Le prove nel browser verificano la composizione responsive e i dialog.
