export enum CitationStylesEnum {
    ACS = "acs",
    AMA = "ama",
    IEEE = "ieee",
    NLM = "nlm",
    VANCOUVER = "vancouver",
    CSE = "cse"
}

export type CitationType =
      "ScholarlyArticle"
    | "Software"
    | "Book"
    | "Chapter"
    | "WebSite"
    | "GenAI"
    | "Thesis"
    | "Transcript"
    | "Manual"
    | "Report";