import {AbstractCitation} from "../AbstractCitation";
import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";
import React from "react";
import {allNames} from "@liliana-sanfilippo/author-name-parser";
import {
    address,
    authors, DocEntry, doi, edition,
    fromUrl, how,
    issue,
    journal,
    pages,
    publishedTime,
    publisher, renderingNotPossible,
    title
} from "../../utils/htmlUtils";
import {
    getAccessDateInfo,
    getConferenceInfo,
    getPublisherInfo, getSchoolInfo, getVolumeInfo,
    getVolumeOrSeriesInfo
} from "../../utils/entryinfoUtils";

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
    renderCitation(entry: Entry,maintenanceMode: boolean, index: number): React.ReactNode {
        const id = super.createEntryId(entry.id);
        if (entry.type == "article") {
        return (
            <DocEntry id={id} index={index} type={"ScholarlyArticle"}>
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
                {getVolumeInfo(entry)}
                (
                {issue((entry.number?.toString() ?? "NULL"))}
                ):
                {pages((entry.pages ?? "NULL"))}
                .
            </DocEntry>
        );
        } else if (entry.type == "book") {
            return (
                <DocEntry id={id} index={index} type={"Book"}>
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    <i>{title(entry.title)}</i>
                    .&nbsp;
                    {getPublisherInfo(entry)}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"))}
                    .
                </DocEntry>
            )
        } else if (entry.type == "inbook" || entry.type == "incollection") {
            return (
                <DocEntry id={id} index={index} type={"Chapter"}>
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    {title(entry.title)}
                    . In:&nbsp;
                    <i>{title((entry.booktitle) ?? "NULL")}</i>
                    .&nbsp;
                    {getPublisherInfo(entry)}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"))}
                    :
                    {pages((entry.pages ?? "NULL"))}
                    .
                </DocEntry>
            )
        } else if (entry.type == "online" || entry.type == "misc") {
            return (
                <DocEntry id={id} index={index} type={"WebSite"}>
                    {authors((entry.author ?? "NULL"))}
                    &nbsp;
                    {title(entry.title)}
                    . Published&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    .&nbsp;
                    {getAccessDateInfo(entry)}
                    .&nbsp;
                    {fromUrl((entry.url ?? "NULL"))}
                </DocEntry>
            )
        }
        else if (entry.type == "software") {
            return (
                <DocEntry id={id} index={index} type={"Software"}>
                    {title(entry.title)}
                    &nbsp;[Computer Software].&nbsp;
                    {edition((entry.edition ?? entry.version ??"NULL"))}
                    .&nbsp;
                    {address((entry.address ?? "NULL"))}
                    :&nbsp;
                    {publisher((entry.publisher ?? this.formatAuthors(entry.author ?? "NULL") ?? entry.organization ??  "NULL"))}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    .
                </DocEntry>
            )
        }
        else if (entry.type == "genai") {
                return (
                    <DocEntry id={id} index={index} type={"GenAI"}>
                        {title((entry.title ?? "NULL"))}
                        .&nbsp;Version no.&nbsp;
                        {getVolumeOrSeriesInfo(entry)}
                        .&nbsp;
                        {getPublisherInfo(entry)}
                        .&nbsp;
                        {publishedTime((entry.year ?? "NULL"))}
                        .&nbsp;
                        {fromUrl((entry.url ?? "NULL"))}
                    </DocEntry>
                )
        } else if (entry.type == "mastersthesis") {
            return (
                <DocEntry id={id} index={index} type={"Thesis"}>
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    <i>{title(entry.title)}</i>
                    .&nbsp;Masters Thesis.&nbsp;
                    {getSchoolInfo(entry)}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"))}
                    .&nbsp;
                    {entry.url && fromUrl(entry.url)}
                </DocEntry>
            )
        } else if (entry.type == "phdthesis") {
            return (
                <DocEntry id={id} index={index} type={"Thesis"}>
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    <i>{title(entry.title)}</i>
                    .&nbsp;Dissertation.&nbsp;
                    {getSchoolInfo(entry)}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"))}
                    .&nbsp;
                    {entry.url && fromUrl(entry.url)}
                </DocEntry>
            )
        }
        else if (entry.type == "unpublished") {
            return (
                <DocEntry id={id} index={index} type={"ScholarlyArticle"}>
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    {title(entry.title)}
                    .&nbsp;
                    <i>{getPublisherInfo(entry)}</i>
                    . Preprint. Posted online&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    .&nbsp;
                    {entry.doi && doi((entry.doi ?? "NULL"))}
                </DocEntry>
            );
        }  else if (entry.type == "inproceedings" || entry.type == "proceedings") {
            return (
                <DocEntry id={id} index={index} type={"ScholarlyArticle"}>
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    {title(entry.title)}
                    . Presented at:&nbsp;
                    {getConferenceInfo(entry)}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    ;&nbsp;
                    {address((entry.address ?? "NULL"))}
                    .
                    {entry.url && fromUrl(entry.url)}
                </DocEntry>
            );
        }  else if (entry.type == "booklet") {
            return (
                <DocEntry id={id} index={index} type={"Book"}>
                    {authors(this.formatAuthors(entry.author ?? entry.editor ?? "NULL"))}
                    &nbsp;
                    <i>{title(entry.title)}</i>
                    .&nbsp;
                    {publishedTime((entry.year ?? "NULL"))}
                    .
                </DocEntry>
            );
        } else if (entry.type == "techreport") {
            return (
                <DocEntry id={id} index={index} type={"Report"}>
                    {(entry.author && authors(this.formatAuthors(entry.author))) ?? entry.organization ?? "NULL"}
                    &nbsp;
                    <i>{title(entry.title)}</i>
                    .&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    .&nbsp;Accessed&nbsp;
                    {getAccessDateInfo(entry)}
                    .
                    {entry.url && fromUrl(entry.url)}
                </DocEntry>
            );
        } else if (entry.type == "manual") {
            return (
                <DocEntry id={id} index={index} type={"Manual"}>
                    {(entry.author && authors(this.formatAuthors(entry.author))) ?? entry.organization ?? "NULL"}
                    &nbsp;
                    <i>{title(entry.title)}</i>
                    &nbsp;
                    {edition((entry.edition ?? "NULL"))}
                    &nbsp;ed.&nbsp;
                    {address((entry.address ?? "NULL"))}
                    :&nbsp;
                    {getPublisherInfo(entry)}
                    ;&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    .
                </DocEntry>
            );
        } else if (entry.type == "transcript") {
            return (
                <DocEntry id={id} index={index} type={"Transcript"}>
                    {title(entry.title)}
                    . Transcript.&nbsp;
                    <i>{getPublisherInfo(entry)}</i>
                    .&nbsp;
                    {authors(entry.author  ?? "NULL")}
                    .&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    . Accessed&nbsp;
                    {getAccessDateInfo(entry)}
                    .&nbsp;
                    {entry.url && fromUrl(entry.url)}
                </DocEntry>
            );
        } else if (entry.type == "video") {
            return (
                <DocEntry id={id} index={index} type={"Transcript"}>
                    {authors((this.formatAuthors(entry.author ?? "NULL")) ?? entry.organization ?? entry.institution ?? "NULL")}
                    {!entry.author && "."}&nbsp;
                    <i>{title(entry.title)}</i>
                    .&nbsp;
                    {how(entry.howpublished ?? "NULL")}
                    .&nbsp;
                    {publishedTime((entry.year ?? "NULL"), (entry.month ?? "NULL"), (entry.day ?? "NULL"), false, false, true)}
                    . Accessed&nbsp;
                    {getAccessDateInfo(entry)}
                    .&nbsp;
                    {entry.url && fromUrl(entry.url)}
                </DocEntry>
            );
        }
        else {
           return renderingNotPossible(entry.type)
        }
    }
}