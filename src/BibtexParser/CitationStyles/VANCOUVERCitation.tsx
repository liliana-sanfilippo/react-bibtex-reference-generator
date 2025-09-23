import {AbstractCitation} from "../AbstractCitation";
import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";
import React from "react";
import {allNames} from "@liliana-sanfilippo/author-name-parser";
import {
    address,
    authors, DocEntry,
    doi,
    fromUrl,
    issue,
    journal,
    pages,
    publishedTime, renderingNotPossible,
    title
} from "../../utils/htmlUtils";
import {getAccessDateInfo, getPublisherInfo, getVolumeInfo} from "../../utils/entryinfoUtils";

export class VANCOUVERCitation extends AbstractCitation {
    constructor(bibtexSources: string[]| Entry[] , special?: string, start?: number) {
        super(bibtexSources, special, start);
    }
    formatAuthors(authors: string): string{
        if (authors === "NULL" || authors === undefined || authors == "") {
            return "NULL"
        }
        return allNames(authors).map(full_name => full_name.lastname + " " + (full_name.firstnames.replace("-", " ").split(" ").map(part => part.charAt(0)).join("")) ).join(", ") + "." ;

    }
    renderCitation(entry: Entry, maintenanceMode: boolean, index: number): React.ReactNode {
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
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.month ?? "NULL"), false, true)}
                    ;&nbsp;
                    {getVolumeInfo(entry)}
                    (
                    {issue((entry.number?.toString() ?? "NULL"))}
                    )
                    :
                    {pages((entry.pages ?? "NULL"))}
                    .&nbsp;
                    Available from:
                    &nbsp;
                    {fromUrl((entry.url ?? "NULL"))}
                    &nbsp;
                    {doi((entry.doi ?? "NULL"))}
                </DocEntry>
            );
        } else if (entry.type == "book") {
            return (
                <DocEntry id={id} index={index} type={"Book"}>
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    {title(entry.title)}
                    .&nbsp;
                    {getVolumeInfo(entry)}.
                    &nbsp;
                    {address((entry.address ?? "NULL"))}
                    :&nbsp;
                    {getPublisherInfo((entry))}
                    ;
                    {doi((entry.doi ?? "NULL"))}.
                </DocEntry>
            )
        }  else if (entry.type == "inbook") {
            return (
                <DocEntry id={id} index={index} type={"Chapter"}>
                    {authors(this.formatAuthors(entry.author ?? "NULL"))}
                    &nbsp;
                    {title(entry.title)}
                    . In:&nbsp;
                    {authors(this.formatAuthors(entry.editor ?? "NULL"))}
                    , editors.&nbsp;
                    {title((entry.booktitle ?? "NULL"))}
                    .&nbsp;
                    {address((entry.address ?? "NULL"))}
                    :&nbsp;
                    {getPublisherInfo(entry)}
                    ;
                    {doi((entry.doi ?? "NULL"))}.
                    &nbsp;p.&nbsp;
                    {pages((entry.pages ?? "NULL"))}
                    .
                </DocEntry>
            )
        } else if (entry.type == "misc") {
            return (
                <DocEntry id={id} index={index} type={"WebSite"}>
                    {authors((entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    {title(entry.title)}
                    &nbsp;[Internet].&nbsp;
                    {publishedTime((entry.year ?? "NULL"))}
                    &nbsp;[cited&nbsp;
                    {getAccessDateInfo(entry)}
                    ].&nbsp;Available from:&nbsp;
                    {fromUrl((entry.url ?? "NULL"))}
                </DocEntry>
            )
        }
        else {
            return renderingNotPossible(entry.type)
        }
    }
}