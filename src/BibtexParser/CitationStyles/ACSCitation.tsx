import {AbstractCitation} from "../AbstractCitation";
import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";
import React from "react";
import {allNames} from "@liliana-sanfilippo/author-name-parser";
import {
    authors,
    DocEntry,
    journal,
    pages,
    publishedTime,
    renderingNotPossible,
    title,
    volume
} from "../../utils/htmlUtils";

export class ACSCitation extends AbstractCitation {
    constructor(bibtexSources: string[] | Entry[] , special?: string, start?: number) {
        super(bibtexSources, special, start);
    }

    formatAuthors(authors: string): string{
        if (authors === "NULL" || authors === undefined || authors == "") {
            return "NULL"
        } else return allNames(authors).map(full_name =>  full_name.lastname + ", " + full_name.firstnames.charAt(0) + ".").join("; ");
    }

    renderCitation(entry: Entry, index: number): React.ReactNode {
        const id = super.createEntryId(entry.id);
        if (entry.type == "article") {
        return (
            <DocEntry id={id} index={index} type={"ScholarlyArticle"}>
                {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                &nbsp;
                {title(entry.title)}.
                &nbsp;
                {journal((entry.journal ?? "NULL"), true, true)}
                .&nbsp;
                {publishedTime((entry.year ?? "NULL"), undefined, undefined, true)}
                ,&nbsp;
                {volume((entry.volume ?? "NULL"))}
                ,&nbsp;
                {pages((entry.pages ?? "NULL"))}
                .
            </DocEntry>
        );
        } else {
            return renderingNotPossible(entry.type)
        }
    }
}