# Sidebar

`Sidebar` riceve `groups: readonly SidebarGroup[]`, utente e output logout.
`SidebarNavigation` rende gli stessi gruppi tramite un solo template: link principali e
sezioni con figli, icone opzionali, label tradotte e matching esatto configurabile.

Il layout compone `DEFAULT_SIDEBAR_GROUPS` e registra le icone usate nella configurazione.
Per aggiungere una voce si aggiunge un oggetto con ID stabile, chiave di traduzione e
`commands`; per una sezione si aggiunge `children`. Le destinazioni Movies provengono
esclusivamente da `MOVIES_NAVIGATION`, esportato dalla public API della feature.
Questa configurazione descrive il menu, non definisce route e non sostituisce i guard.

I link sono anchor con RouterLink: supportano tastiera e apertura in nuova scheda.
Il titolo della sezione naviga alla sua destinazione anche nella sidebar ridotta a icone;
il pulsante separato apre o chiude i figli. La sezione della route attiva si apre
all’ingresso e solo il link preciso riceve aria-current. La selezione chiude il pannello mobile.

Le traduzioni della shell vivono in presentation/i18n, con scope `sidebar` privato alla vista della sidebar (`viewProviders`), così le pagine proiettate mantengono il proprio scope di feature.
Il renderer non importa feature, Store o servizi di navigazione imperativa.
