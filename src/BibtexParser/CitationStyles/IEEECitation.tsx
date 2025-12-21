import {AbstractCitation} from "../AbstractCitation";
import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";
import React from "react";
import {allNames, FullName} from "@liliana-sanfilippo/author-name-parser";
import {
    accessed, address,
    authors,
    doi, edition,
    fromUrl,
    issue,
    journal,
    pages,
    publishedTime,
    publisher,
    title,
    volume
} from "../../utils/htmlUtils";
import {EntryWrapper} from "../Entry";
import {CitationBuilder} from "../CitationBuilder";

export class IEEECitation extends AbstractCitation {
    constructor(bibtexSources: string[] |Entry[] , special?: string, start?: number) {
        super(bibtexSources, special, start);
    }
    formatAuthors(authors: string | undefined): string | undefined {
        try {
            if (authors === "NULL" || authors === undefined || authors == "") {
                throw TypeError
            } else {
                let authorList: FullName[] = allNames(authors)
                if (authorList.length > 6) {
                    return authorList[0].firstnames.charAt(0) + ". " + authorList[0].lastname + " et al."
                } else if (authorList.length > 1) {
                    // todo last cleverer machen
                    const nAuthorList = authorList.slice(0, authorList.length-1)
                    const last = [authorList[authorList.length-1]].map(full_name => (full_name.firstnames.replace("-", " ").split(" ").map(part => part.charAt(0)).join("")) + "." + " " +  full_name.lastname ).join(", ");
                    return nAuthorList.map(full_name => (full_name.firstnames.replace("-", " ").split(" ").map(part => part.charAt(0)).join("")) + "." + " " +  full_name.lastname ).join(", ") + " and " + last;
                }
                return allNames(authors).map(full_name => (full_name.firstnames.replace("-", " ").split(" ").map(part => part.charAt(0)).join("")) + "." + " " +  full_name.lastname ).join(", ");

            }
        } catch (TypeError)
        {
            console.log("Error with " + authors)
        }

}

    renderCitation(entry: Entry, index: number): React.ReactNode {
        const commonProps = {
            property: "schema:citation",
            id: super.createEntryId(entry.id),
            role: "doc-biblioentry"
        };
        let author, editorField, authorField;
        const wrapped = new EntryWrapper(entry);
        switch (entry.type) {
            case "misc":
            case "online":
                authorField = authors(entry.author)
                editorField = authors(entry.editor);
                author = authors(entry.author ?? entry.editor  ?? wrapped.anyOriginator);
                break

            default:
                authorField = authors(this.formatAuthors(entry.author ?? entry.editor));
                editorField = authors(this.formatAuthors(entry.editor));
                author = authors(this.formatAuthors(entry.author ?? entry.editor ) ?? wrapped.anyOriginator)
        }

        switch (entry.type) {
            case "article":
                return (
                    <li {...commonProps} key={index} typeof="schema:ScholarlyArticle">
                        {new CitationBuilder()
                            .add(author, ",")
                            .add(title(entry.title), "\",", "\"")
                            .add(journal(entry.journal, true), ",")
                            .add(volume(entry.volume), ",", "vol. ")
                            .addIf(entry.number, issue(entry.number?.toString()),
                                ",", "no. "
                            )
                            .add(pages(entry.pages), ",", "pp. ")
                            .add(publishedTime(entry.year), ",")
                            .addIf(entry.doi, doi(entry.doi), ".")
                            .build()
                        }
                    </li>
                );
            case "book":
                return (
                    <li {...commonProps} key={index} typeof="schema:Book">
                        {new CitationBuilder()
                            .addIf(!entry.editor || entry.author, authorField, ",")
                            .addIf(!entry.author && entry.editor, editorField, " Ed.,")
                            .addIf(wrapped.hasANumber(), title(entry.title, true), ",")
                            .addIf(!wrapped.hasANumber(), title(entry.title, true), ".")
                            .addIf(wrapped.hasANumber(), edition(wrapped.aNumber), " ed.")
                            .addIf(entry.address, address((entry.address)), ":")
                            .add(publisher((entry.publisher)), ",")
                            .add(publishedTime((entry.year)), ".")
                            .addIf(entry.note, entry.note)
                            .build()
                        }
                    </li>
                );
            case "inbook":
            case "incollection":
                return (
                    <li {...commonProps} key={index} typeof="schema:Chapter">
                        {new CitationBuilder()
                            .add(authorField, ",")
                            .add(title(entry.title,), ",\"", "\"")
                            /* separator von titel je nachdem ob edition da ist */
                            .add(title(entry.booktitle, true), ",", "in ")
                            .addIf(entry.edition, edition(entry.edition), " ed.,")
                            .addIf(entry.editor, editorField, " Ed.,")
                            .addIf(entry.address, address(entry.address), ":")
                            .add(publisher(entry.publisher), ",")
                            .addIf(entry.pages, publishedTime(entry.year), ",")
                            .addIf(!entry.pages, publishedTime(entry.year), ".")
                            .addIf(entry.pages, pages(entry.pages), ".", "pp. ")
                            .build()
                        }
                    </li>
                );
            case "inproceedings":
                return (
                    // todo https://libguides.ntu.edu.sg/citationstyles/IEEE Datum
                    <li {...commonProps} key={index} typeof="schema:ScholarlyArticle">
                        {new CitationBuilder()
                            .add(authorField, ",")
                            .add(title(entry.title), ",\"", "\"")
                            .add(title(wrapped.anyConferenceTitle, true), ",", "in ")
                            .addIf(entry.address, address(entry.address), ",")
                            .add(publishedTime(entry.year, entry.month, entry.day, false, false, true), ".")
                            .build()
                        }
                    </li>
                );
            case "dataset":
                return (
                    <li {...commonProps} key={index} typeof="schema:Dataset">
                        {new CitationBuilder()
                            .add(author, ",")
                            .add(publishedTime(entry.year, entry.month, entry.day, false, false, true), ".")
                            .add(title(entry.title), ",\"", "\"")
                            .addIf(entry.author || entry.editor, publisher(wrapped.anyOriginator), ",")
                            .addIf(entry.doi, doi(entry.doi), ".")
                            .addIf(!entry.doi && entry.url, fromUrl(entry.url), ".")
                            .build()
                        }
                    </li>
                );
            default:
                return (
                    <li {...commonProps} key={index} typeof="schema:Nix">
                        {new CitationBuilder()
                            .add(author, ",")
                            .add(publishedTime(entry.year, entry.month, entry.day, false, false, true), ".")
                            .add(title(entry.title), ",\"", "\"")
                            .addIf(entry.doi, doi(entry.doi), ".")
                            .addIf(!entry.doi && entry.url, fromUrl(entry.url), ".")
                            .build()
                        }
                    </li>
                );


        }

    }
}