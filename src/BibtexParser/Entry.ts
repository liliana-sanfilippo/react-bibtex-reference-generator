import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";

export class EntryWrapper {
    constructor(private entry: Entry) {}


    get anyOriginator(): string | undefined {
        {/* console.log('organization:', this.entry.organization, 'type:', typeof this.entry.organization);
        console.log('institution:', this.entry.institution, 'type:', typeof this.entry.institution);
        console.log('publisher:', this.entry.publisher, 'type:', typeof this.entry.publisher);
        console.log('school:', this.entry.school, 'type:', typeof this.entry.school);


        */}
        console.log("HIER")
        console.log((this.entry.organization ?? this.entry.institution ?? this.entry.publisher ?? this.entry.school))
        console.log(this.hasAnyOriginator())
        console.log(this.entry.institution)
        console.log(this.entry.author ? true:  false)
        console.log(this.entry)

        return (this.entry.organization ?? this.entry.institution ?? this.entry.publisher ?? this.entry.school) }
    get anySoftwareOriginator(): string | undefined {
        return ( this.entry.author ?? this.entry.organization ?? this.entry.institution ?? this.entry.publisher ?? this.entry.school) }

    get title(): string { return this.entry.title; }
    get author(): string { return this.entry.author ?? ""; }
    get editor(): string { return this.entry.editor ?? ""; }
    get booktitle(): string { return this.entry.booktitle ?? ""; }
    get publisher(): string { return this.entry.publisher ?? ""; }
    get year(): string | number { return this.entry.year ?? ""; }
    get pages(): string { return this.entry.pages ?? ""; }
    get journal(): string { return this.entry.journal ?? ""; }
    get volume(): string { return this.entry.volume ?? ""; }
    get number(): string | number { return this.entry.number ?? ""; }
    get anyLink(): string | undefined { return (this.entry.url ?? this.entry.doi) }
    get address(): string { return this.entry.address ?? ""; }
    get series(): string { return this.entry.series ?? ""; }
    get edition(): string { return this.entry.edition ?? ""; }
    get thesisOriginator(): string | undefined {
        return (this.entry.school ?? this.entry.organization ?? this.entry.institution )
    }
    get anyUnpublishedOrigin(): string | undefined {
        return (this.entry.eventtitle ?? this.entry.booktitle ?? this.entry.publisher ?? this.entry.howpublished ?? this.entry.note)
    }

    get anyConferenceTitle(): string | undefined {
        return (this.entry.booktitle ?? this.entry.eventtitle ?? this.entry.publisher ?? this.entry.journal)
    }

    get anyBookletPublisher(): string | undefined {
        return (this.entry.school ?? this.entry.organization ?? this.entry.institution ?? this.entry.howpublished ?? this.entry.note )
    }
    get authorOrEditor(): string {
        return this.entry.author ?? this.entry.editor ?? "NULL";
    }

    get yearOrNull(): string {
        return this.entry.year?.toString() ?? "NULL";
    }

    hasANumber(): boolean {
         return (
            (this.entry.edition !== undefined && this.entry.edition !== "" && this.entry.edition !== null) ||
            (this.entry.version !== undefined && this.entry.version !== "" && this.entry.version !== null) ||
            (this.entry.number !== undefined && this.entry.number !== "" && this.entry.number !== null)
        );
    }

    hasAnyOriginator(): boolean {
        return (
            (this.entry.organization !== undefined && this.entry.organization !== "" && this.entry.organization !== null) ||
            (this.entry.institution !== undefined && this.entry.institution !== "" && this.entry.institution !== null) ||
            (this.entry.publisher !== undefined && this.entry.publisher !== "" && this.entry.publisher !== null) ||
            (this.entry.school !== undefined && this.entry.school !== "" && this.entry.school !== null)
        )
    }

    hasAnyOriginatorOrAuthor(): boolean {
        return this.hasAnyOriginator() || (this.entry.author !== undefined && this.entry.author !== "" && this.entry.author !== null)
    }

    hasAnyBookletOriginatorOrAuthor(): boolean {
        return this.hasAnyOriginatorOrAuthor() || (this.entry.howpublished !== undefined && this.entry.howpublished !== "" && this.entry.howpublished !== null)
    }

    get aNumber(): string | undefined {
        return (this.entry.version?.toString() ??  this.entry.number?.toString() ?? this.entry.edition?.toString())
    }


    getRaw(): Entry {
        return this.entry;
    }
}