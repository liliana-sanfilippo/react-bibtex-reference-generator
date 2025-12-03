import {AbstractCitation} from "../AbstractCitation";
import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";
import React from "react";
import {allNames, FullName} from "@liliana-sanfilippo/author-name-parser";
import {
    address,
    authors,
    doi, edition,
    issue,
    journal,
    pages,
    publishedTime,
    publisher,
    title,
    volume
} from "../../utils/htmlUtils";
import {CitationBuilder} from "../CitationBuilder";

export class ACSCitation extends AbstractCitation {
    constructor(bibtexSources: string[] | Entry[] , special?: string, start?: number) {
        super(bibtexSources, special, start);
    }

    formatAuthors(authors: string | undefined): string{
        console.log("Editors: " + authors)
        if (authors === "NULL" || authors === undefined || authors == "") {
            return "NULL"
        } else {
            let authorList: FullName[] = allNames(authors)
            if (authorList.length > 10) {
                authorList= authorList.slice(0, 10)
                return  authorList.map(full_name => full_name.lastname + ", " + full_name.firstnames.charAt(0) + ".").join("; ") + "; et al.";
            } else {
                return  authorList.map(full_name => full_name.lastname + ", " + full_name.firstnames.charAt(0) + ".").join("; ");
            }
          }
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
        console.log("authorField: ")
        console.log(authorField)
        console.log("editorField: ")
        console.log(editorField)
        switch (entry.type) {
            case "article":
                return (
                    <li {...commonProps} typeof="schema:ScholarlyArticle">
                        {new CitationBuilder()
                            .add(authorField, ";")
                            .add(title(entry.title), ".")
                            .add(journal(entry.journal, true, true), "\u00A0")
                            .add(publishedTime(entry.year, undefined, undefined, true), ",")
                            .add(volume(entry.volume))
                            .addIf(entry.number,
                                <>({issue(entry.number?.toString())})</>,
                                ",", "\u00A0"
                            )
                            .add(pages(entry.pages), ".")
                            .addIf(entry.doi, doi(entry.doi, true))
                            .build()
                        }
                    </li>
                );
            case "book":
                return (
                    <li {...commonProps} typeof="schema:Book">
                        {new CitationBuilder()
                            .add(authorField, "\u00A0")
                            /* separator von titel je nachdem ob edition da ist */
                            .addIf(entry.edition, title(entry.title, true), ",")
                            .addIf(!entry.edition, title(entry.title, true), ";")
                            .addIf(entry.edition, edition(entry.edition), " ed. ;")
                            .addIf(entry.editor, editorField, " Eds.;")
                            .addIf(entry.series, entry.series, ",")
                            .addIf(entry.volume, entry.volume, ";", "Vol. ")
                            /* separator von publisher je nachdem ob address da ist */
                            .addIf(entry.address, publisher(entry.publisher), ":")
                            .addIf(!entry.address, publisher(entry.publisher), ",")
                            .addIf(entry.address, address(entry.address), ",")
                            .add(publishedTime(entry.year), ".")
                            .build()
                        }
                    </li>
                );
            case "inbook":
            case "incollection":
                return (
                    <li {...commonProps} typeof="schema:Chapter">
                        {new CitationBuilder()
                            .add(authorField, "\u00A0")
                            .add(title(entry.title,), ":")
                            /* separator von titel je nachdem ob edition da ist */
                            .addIf(entry.edition, title(entry.booktitle, true), ",", "In: ")
                            .addIf(!entry.edition, title(entry.booktitle, true), ";", "In: ")
                            .addIf(entry.edition, edition(entry.edition), " ed. ;")
                            .addIf(entry.editor, editorField, " Eds.;")
                            .addIf(entry.series, entry.series, ",")
                            .addIf(entry.volume, entry.volume, ";", "Vol. ")
                            /* separator von publisher je nachdem ob address da ist */
                            .addIf(entry.address, publisher(entry.publisher), ":")
                            .addIf(!entry.address, publisher(entry.publisher), ",")
                            .addIf(entry.address, address(entry.address), ",")
                            .add(publishedTime(entry.year), ".")
                            .add(pages(entry.pages), ".", "pp. ")
                            .addIf(entry.doi, doi(entry.doi, true))
                            .build()
                        }
                    </li>
                );
            default:
                return ( <li style={{color:  "orange"}}> Sorry, rendering {entry.type} not possible. </li>)

        }
    }
}