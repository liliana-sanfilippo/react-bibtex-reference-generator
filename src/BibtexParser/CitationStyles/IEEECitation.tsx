import {AbstractCitation} from "../AbstractCitation";
import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";
import React from "react";
import {allNames} from "@liliana-sanfilippo/author-name-parser";
import {
    accessed, address,
    authors, DocEntry,
    doi,
    fromUrl,
    issue,
    journal,
    pages,
    publishedTime,
    publisher, renderingNotPossible,
    title
} from "../../utils/htmlUtils";
import {getAccessDateInfo, getVolumeInfo} from "../../utils/entryinfoUtils";

export class IEEECitation extends AbstractCitation {
    constructor(bibtexSources: string[] |Entry[] , special?: string, start?: number) {
        super(bibtexSources, special, start);
    }
    formatAuthors(authors: string): string{
        if (authors === "NULL" || authors === undefined || authors == ""){
            return "NULL"
        }
        return allNames(authors).map(full_name => (full_name.firstnames.replace("-", " ").split(" ").map(part => part.charAt(0)).join("")) + "." + " " +  full_name.lastname ).join("; ") + ",";
    }

    renderCitation(entry: Entry, index: number): React.ReactNode {
        const id = super.createEntryId(entry.id);
        if (entry.type == "article") {
            return (
                <DocEntry id={id} index={index} type={"ScholarlyArticle"}>
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;"{title(entry.title)}",&nbsp;
                    {journal((entry.journal ?? "NULL"), true)}
                    ,&nbsp;vol.&nbsp;
                    {getVolumeInfo(entry)}
                    ,&nbsp;
                    {issue((entry.number?.toString() ?? "NULL"), true)}
                    , pp.&nbsp;
                    {pages((entry.pages ?? "NULL"))}
                    ,&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"))}
                    ,
                    {doi((entry.doi ?? "NULL"))}.
                </DocEntry>
            );
        } else if (entry.type == "book") {
                return (
                    <DocEntry id={id} index={index} type={"Book"}>
                        {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                        &nbsp;
                        <i>{title(entry.title)}</i>
                        .&nbsp;
                        {address((entry.address ?? "NULL"))}
                        :&nbsp;
                        {publisher((entry.publisher ?? "NULL"))}
                        ,&nbsp;
                        {publishedTime((entry.year ?? "NULL"))}
                        .
                    </DocEntry>
                )
            }
            else if (entry.type == "misc") {
                return (
                    <DocEntry id={id} index={index} type={"WebSite"}>
                        {authors((entry.author ?? entry.editor ?? "NULL"))}
                        &nbsp;
                        {title(entry.title)}
                        . Published&nbsp;
                        {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                        .&nbsp;
                        {fromUrl((entry.url ?? "NULL"))}
                        &nbsp;(accessed&nbsp;
                        {getAccessDateInfo(entry)}
                        ).
                    </DocEntry>
                )
            } else {
            return renderingNotPossible(entry.type)
        }
    }
}