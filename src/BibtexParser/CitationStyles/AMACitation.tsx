import {AbstractCitation} from "../AbstractCitation";
import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";
import React from "react";
import {allNames} from "@liliana-sanfilippo/author-name-parser";
import {
    accessed, address,
    authors, conference, doi, edition,
    fromUrl, how,
    issue,
    journal,
    pages,
    publishedTime,
    publisher,
    school,
    title,
    volume
} from "../../utils/htmlUtils";

export class AMACitation extends AbstractCitation {
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
        const commonProps = {
            key: index,
            property: "schema:citation",
            id: super.createEntryId(entry.id),
            role: "doc-biblioentry"
        };
        const authorField = authors(this.formatAuthors(entry.author ?? entry.editor ));
        const editorField = authors(this.formatAuthors(entry.editor));
        if (entry.type == "article") {
        return (
            <li {...commonProps}  typeof="schema:ScholarlyArticle">
                {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                &nbsp;
                {title(entry.title)}
                .&nbsp;
                <i>J</i>
                &nbsp;
                {journal((entry.journal ?? "NULL"), true, false)}
                .&nbsp;
                {publishedTime((entry.year ?? "NULL"))}
                ;
                {volume((entry.volume ?? "NULL"))}
                {
                    entry.number && <>(
                        {issue((entry.number?.toString() ?? "NULL"))}
                        )</>
                }:
                {pages((entry.pages ?? "NULL"))}
                .
            </li>
        );
        } else if (entry.type == "book") {
            return (
                <li {...commonProps}  typeof="schema:Book">
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    <i>{title(entry.title)}</i>
                    .&nbsp;
                    {publisher((entry.publisher ?? "NULL"))}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"))}
                    .
                </li>
            )
        } else if (entry.type == "inbook" || entry.type == "incollection") {
            return (
                <li {...commonProps}  typeof="schema:Chapter">
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    {title(entry.title)}
                    . In:&nbsp;
                    <i>{title((entry.booktitle) ?? "NULL")}</i>
                    .&nbsp;
                    {publisher((entry.publisher ?? "NULL"))}
                    ;&nbsp;
                    {
                        entry.number && <>(
                            {issue((entry.number?.toString() ?? "NULL"))}
                            )</>
                    }:
                    {pages((entry.pages ?? "NULL"))}
                    .
                </li>
            )
        } else if (entry.type == "online" || entry.type == "misc") {
            return (
                <li {...commonProps}  typeof="schema:WebSite">
                    {authors((entry.author ?? "NULL"))}
                    &nbsp;
                    {title(entry.title)}
                    . Published&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    .&nbsp;
                    {accessed((entry.note ?? "NULL"))}
                    .&nbsp;
                    {fromUrl((entry.url ?? "NULL"))}
                </li>
            )
        }
        else if (entry.type == "software") {
            // TODO add version at edition
            return (
                <li {...commonProps}  typeof="schema:Software">
                    {title(entry.title)}
                    &nbsp;[Computer Software].&nbsp;
                    {edition((entry.edition  ?? entry.version ?? "NULL"))}
                    .&nbsp;
                    {address((entry.address ?? "NULL"))}
                    :&nbsp;
                    {publisher((entry.publisher ?? this.formatAuthors(entry.author ?? "NULL") ?? entry.organization ??  "NULL"))}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    .
                </li>
            )
        }
        else if (entry.type == "genai") {
                return (
                    <li {...commonProps}  >
                        {title((entry.title ?? "NULL"))}
                        .&nbsp;Version no.&nbsp;
                        {volume((entry.volume) ?? entry.series ?? "NULL")}
                        .&nbsp;
                        {publisher((entry.publisher ?? "NULL"))}
                        .&nbsp;
                        {publishedTime((entry.year ?? "NULL"))}
                        .&nbsp;
                        {fromUrl((entry.url ?? "NULL"))}
                    </li>
                )
        } else if (entry.type == "mastersthesis") {
            return (
                <li {...commonProps}  typeof="schema:Thesis">
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    <i>{title(entry.title)}</i>
                    .&nbsp;Masters Thesis.&nbsp;
                    {school(entry.school ?? entry.institution ?? entry.organization)}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"))}
                    .&nbsp;
                    {entry.url && fromUrl(entry.url)}
                </li>
            )
        } else if (entry.type == "phdthesis") {
            return (
                <li {...commonProps}  typeof="schema:Thesis">
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    <i>{title(entry.title)}</i>
                    .&nbsp;Dissertation.&nbsp;
                    {school(entry.school ?? "NULL")}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"))}
                    .&nbsp;
                    {entry.url && fromUrl(entry.url)}
                </li>
            )
        }
        else if (entry.type == "unpublished") {
            return (
                <li {...commonProps}  typeof="schema:ScholarlyArticle">
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    {title(entry.title)}
                    .&nbsp;
                    <i>{publisher((entry.eventtitle ?? entry.booktitle ?? entry.publisher ?? entry.howpublished))}</i>
                    . Preprint. Posted online&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    .&nbsp;
                    {entry.doi && doi((entry.doi ?? "NULL"))}
                </li>
            );
        }  else if (entry.type == "inproceedings" || entry.type == "proceedings") {
            // TODO add ?? "entry.event" to publisher
            return (
                <li {...commonProps}  typeof="schema:ScholarlyArticle">
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    {title(entry.title)}
                    . Presented at:&nbsp;
                    {conference((entry.booktitle ?? entry.publisher ?? entry.eventtitle ?? entry.journal ?? "NULL" ))}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    ;&nbsp;
                    {address((entry.address ?? "NULL"))}
                    .
                    {entry.url && fromUrl(entry.url)}
                </li>
            );
        }  else if (entry.type == "booklet") {
            return (
                <li {...commonProps}  typeof="schema:Book" property="schema:citation"
                    id={super.createEntryId(entry.id)}>
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    <i>{title(entry.title)}</i>
                    .&nbsp;
                    {publishedTime((entry.year ?? "NULL"))}
                    .
                </li>
            );
        } else if (entry.type == "techreport") {
            return (
                <li {...commonProps}  typeof="schema:Report" property="schema:citation"
                    id={super.createEntryId(entry.id)}>
                    {(entry.author && authors(this.formatAuthors(entry.author))) ?? entry.organization ?? "NULL"}
                    &nbsp;
                    <i>{title(entry.title)}</i>
                    .&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    .&nbsp;Accessed&nbsp;
                    {accessed((entry.note ?? "NULL"))}
                    .
                    {entry.url && fromUrl(entry.url)}
                </li>
            );
        } else if (entry.type == "manual") {
            return (
                <li {...commonProps}  typeof="schema:Manual" property="schema:citation"
                    id={super.createEntryId(entry.id)}>
                    {(entry.author && authors(this.formatAuthors(entry.author))) ?? entry.organization ?? "NULL"}
                    &nbsp;
                    <i>{title(entry.title)}</i>
                    &nbsp;
                    {edition((entry.edition ?? "NULL"))}
                    &nbsp;ed.&nbsp;
                    {address((entry.address ?? "NULL"))}
                    :&nbsp;
                    {publisher((entry.publisher ?? "NULL"))}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    .
                </li>
            );
        } else if (entry.type == "transcript") {
            return (
                <li {...commonProps}  typeof="schema:Transcript" property="schema:citation"
                    id={super.createEntryId(entry.id)}>
                    {title(entry.title)}
                    . Transcript.&nbsp;
                    <i>{publisher(entry.publisher ?? entry.organization ?? entry.institution ?? "NULL")}</i>
                    .&nbsp;
                    {authors(entry.author  ?? "NULL")}
                    .&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    . Accessed&nbsp;
                    {accessed(entry.accessdate ?? entry.note ?? "NULL")}
                    .&nbsp;
                    {entry.url && fromUrl(entry.url)}
                </li>
            );
        } else if (entry.type == "video") {
            return (
                <li {...commonProps}  typeof="schema:Video" property="schema:citation"
                    id={super.createEntryId(entry.id)}>
                    {authors((this.formatAuthors(entry.author ?? "NULL")) ?? entry.organization ?? entry.institution ?? "NULL")}
                    {!entry.author && "."}&nbsp;
                    <i>{title(entry.title)}</i>
                    .&nbsp;
                    {how(entry.howpublished ?? "NULL")}
                    .&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    . Accessed&nbsp;
                    {accessed(entry.accessdate ?? entry.note ?? "NULL")}
                    .&nbsp;
                    {entry.url && fromUrl(entry.url)}
                </li>
            );
        }
        else {
           return ( <li style={{color:  "orange"}}> Sorry, rendering {entry.type} not possible. </li>)
        }
    }
}