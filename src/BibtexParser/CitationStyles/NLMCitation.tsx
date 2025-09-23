import {AbstractCitation} from "../AbstractCitation";
import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";
import React from "react";
import {allNames} from "@liliana-sanfilippo/author-name-parser";
import {
    authors,
    DocEntry,
    doi,
    issue,
    journal,
    pages,
    publishedTime,
    renderingNotPossible,
    title
} from "../../utils/htmlUtils";
import {getVolumeInfo} from "../../utils/entryinfoUtils";

export class NLMCitation extends AbstractCitation {
    constructor(bibtexSources: string[] | Entry[] , special?: string, start?: number) {
        super(bibtexSources, special, start);
    }
    formatAuthors(authors: string): string{
        if (authors === "NULL" || authors === undefined || authors == "") {
            return "NULL"
        }
        return allNames(authors).map(full_name => full_name.lastname + " " + (full_name.firstnames.replace("-", " ").split(" ").map(part => part.charAt(0)).join(""))).join(", ") + ".";

    }
    renderCitation(entry: Entry, index: number): React.ReactNode {
        const id = super.createEntryId(entry.id);
        if (entry.type == "article") {
        return (
            <DocEntry id={id} index={index} type={"ScholarlyArticle"}>
                {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                &nbsp;
                {title(entry.title)}
                .&nbsp;
                {journal((entry.journal ?? "NULL"))}
                .&nbsp;
                {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), undefined, false, true)}
                ;
                {getVolumeInfo(entry)}
                (
                {issue((entry.number?.toString() ?? "NULL"))}
                ):
                {pages((entry.pages ?? "NULL"))}
                .
                {doi((entry.doi ?? "NULL"))}.
            </DocEntry>
        );
        } else {
            return renderingNotPossible(entry.type)
        }
    }
}

