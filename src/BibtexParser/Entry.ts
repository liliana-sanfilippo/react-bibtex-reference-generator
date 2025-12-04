import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";

export class EntryWrapper {
    constructor(private entry: Entry) {}


    get anyOriginator(): string {
        console.log('organization:', this.entry.organization, 'type:', typeof this.entry.organization);
        console.log('institution:', this.entry.institution, 'type:', typeof this.entry.institution);
        console.log('publisher:', this.entry.publisher, 'type:', typeof this.entry.publisher);
        console.log('school:', this.entry.school, 'type:', typeof this.entry.school);

        return (this.entry.organization ?? this.entry.institution ?? this.entry.publisher ?? this.entry.school) }
    get anySoftwareOriginator(): string {
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
    get anyLink(): string { return (this.entry.url ?? this.entry.doi) }
    get address(): string { return this.entry.address ?? ""; }
    get series(): string { return this.entry.series ?? ""; }
    get edition(): string { return this.entry.edition ?? ""; }
    get thesisOriginator(): string {
        return (this.entry.school ?? this.entry.organization ?? this.entry.institution )
    }
    get anyUnpublishedOrigin(): string {
        return (this.entry.eventtitle ?? this.entry.booktitle ?? this.entry.publisher ?? this.entry.howpublished)
    }

    get anyConferenceTitle(): string {
        return (this.entry.booktitle ?? this.entry.eventtitle ?? this.entry.publisher ?? this.entry.journal)
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

    get aNumber(): string | number {
        return (this.entry.version ??  this.entry.number ?? this.entry.edition)
    }


    getRaw(): Entry {
        return this.entry;
    }
}