● Debuggo passo per passo. Prendo +-SON ES (58371335) che dovrebbe avere 2 editions.

● Sanity - query_documents (MCP)(resource: {"projectId":"98dco624","dataset":"production"}, query: "*[_id ==
                                \"58371335-01f6-4965-ab15-6181dae5edd5\"][0] {\n  _id,\n  name,\n  language,\n
                                \"metaDoc\": *[_type == \"translation.metadata\" && references(^._id)][0] {\n    _id,\n
                                   \"enRef\": translations[_key == \"en\"][0].value._ref\n  }\n}", perspective:
                                "published")
  ⎿  Query executed successfully. Found 1 total document, returning 1:
     <documents>{
       "_id": "58371335-01f6-4965-ab15-6181dae5edd5",
     … +9 lines (ctrl+o to expand)

● Il lookup funziona. Ora testo il coalesce() dentro la sub-query delle editions.

● Sanity - query_documents (MCP)(resource: {"projectId":"98dco624","dataset":"production"}, query: "*[_id ==
                                \"58371335-01f6-4965-ab15-6181dae5edd5\"][0] {\n  _id,\n  name,\n  \"resolvedEnId\":
                                coalesce(\n    *[_type == \"translation.metadata\" &&
                                references(^._id)][0].translations[_key == \"en\"][0].value._ref,\n    ^._id\n  ),\n
                                \"editions\": *[_type == \"residency\" && program._ref == coalesce(\n    *[_type ==
                                \"translation.metadata\" && references(^._id)][0].translations[_key ==
                                \"en\"][0].value._ref,\n    ^._id\n  )] { _id, year }\n}", perspective: "published")
  ⎿  Query executed successfully. Found 1 total document, returning 1:
     <documents>{
       "_id": "58371335-01f6-4965-ab15-6181dae5edd5",
     … +6 lines (ctrl+o to expand)

● Trovato il bug. Il resolvedEnId è corretto, ma dentro la sub-query delle editions il ^ si sposta di scope — dentro
  *[_type == "translation.metadata" && references(^._id)], il ^ punta alla residency in corso, non al programma ES.
  Serve ^^ per risalire al livello corretto.

  Testo subito:

● Sanity - query_documents (MCP)(resource: {"projectId":"98dco624","dataset":"production"}, query: "*[_id ==
                                \"58371335-01f6-4965-ab15-6181dae5edd5\"][0] {\n  _id,\n  name,\n  \"editions\": *[_type
                                 == \"residency\" && program._ref == coalesce(\n    *[_type == \"translation.metadata\"
                                && references(^^._id)][0].translations[_key == \"en\"][0].value._ref,\n    ^^._id\n  )]
                                { _id, year }\n}", perspective: "published")
  ⎿  Error: Error executing GROQ query: Invalid GROQ query: Syntax error in GROQ query at position 83

● Il ^ si shifta di scope nella sub-query annidata — è questo il bug. Testo un approccio alternativo che dereferenzia
  direttamente il documento EN.

● Sanity - query_documents (MCP)(resource: {"projectId":"98dco624","dataset":"production"}, query: "*[_id ==
                                \"58371335-01f6-4965-ab15-6181dae5edd5\"][0] {\n  _id,\n  name,\n  \"enProgram\":
                                *[_type == \"translation.metadata\" && references(^._id)][0]\n    .translations[_key ==
                                \"en\"][0]\n    .value-> {\n      _id,\n      \"editions\": *[_type == \"residency\" &&
                                program._ref == ^._id] { _id, year }\n    }\n}", perspective: "published")
  ⎿  Query executed successfully. Found 1 total document, returning 1:
     <documents>{
       "_id": "58371335-01f6-4965-ab15-6181dae5edd5",
     … +17 lines (ctrl+o to expand)

● Funziona — 2 editions trovate. Ora costruisco la query completa con select() per gestire sia EN che ES in un'unica
  query.

● Sanity - query_documents (MCP)(resource: {"projectId":"98dco624","dataset":"production"}, query: "*[_type ==
                                \"residencyProgram\" && language == $lang] | order(name asc) {\n  _id,\n  name,\n
                                slug,\n  tagline,\n  logo { asset->{ url } },\n  \"editions\": select(\n    language ==
                                \"en\" => *[_type == \"residency\" && program._ref == ^._id] | order(year desc) {\n
                                 _id, year, slug, coverImage { asset->{ url } }, residencyDates, callDates\n    },\n
                                *[_type == \"translation.metadata\" && references(^._id)][0]\n      .translations[_key
                                == \"en\"][0]\n      .value-> {\n        \"e\": *[_type == \"residency\" && program._ref
                                 == ^._id] | order(year desc) {\n          _id, year, slug, coverImage { asset->{ url }
                                }, residencyDates, callDates\n        }\n      }.e\n  )\n}", perspective: "published",
                                params: {"lang":"es"})
  ⎿  Query executed successfully. Found 5 total documents, returning 5:
     <documents>{
       "_id": "58371335-01f6-4965-ab15-6181dae5edd5",
     … +53 lines (ctrl+o to expand)

● Perfetto — tutti e 5 i programmi ES restituiscono le editions correttamente. Risposta al frontend:

  ---
  Query risolta — usa questa per getAllPrograms():

  *[_type == "residencyProgram" && language == $lang] | order(name asc) {
    _id,
    name,
    slug,
    tagline,
    logo { asset->{ url } },
    "editions": select(
      language == "en" => *[_type == "residency" && program._ref == ^._id] | order(year desc) {
        _id, year, slug, coverImage { asset->{ url } }, residencyDates, callDates
      },
      *[_type == "translation.metadata" && references(^._id)][0]
        .translations[_key == "en"][0]
        .value-> {
          "e": *[_type == "residency" && program._ref == ^._id] | order(year desc) {
            _id, year, slug, coverImage { asset->{ url } }, residencyDates, callDates
          }
        }.e
    )
  }

  Come funziona:
  - Per lang == "en": query diretta via program._ref == ^._id
  - Per lang == "es": naviga attraverso translation.metadata → dereferenzia il documento EN → da lì fa la sub-query
  delle editions con il ^._id corretto
  - Il bug del coalesce() era che il ^ si shiftava di scope dentro la sub-query annidata. La soluzione è usare ->{ ... }
   per creare un nuovo scope pulito sul documento EN

  Verificato su tutti e 5 i programmi ES — tutte le editions tornano correttamente.