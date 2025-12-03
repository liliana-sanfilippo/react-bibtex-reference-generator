import {AbstractCitation} from "../AbstractCitation";
import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";
import React from "react";
import {allNames, FullName} from "@liliana-sanfilippo/author-name-parser";
import {
    accessed,
    address,
    authors,
    doi, edition, fromUrl,
    issue,
    journal,
    pages,
    publishedTime, genaitype,
    publisher,
    title,
    volume, how, school
} from "../../utils/htmlUtils";
import {CitationBuilder} from "../CitationBuilder";
import {EntryWrapper} from "../Entry";

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
        const wrapped = new EntryWrapper(entry);
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
                            .addIf(entry.edition, edition(entry.edition), " ed.;")
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
                            .addIf(entry.edition, edition(entry.edition), " ed.;")
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
            case "genai":
                return (
                    <li {...commonProps}>
                        {new CitationBuilder()
                            .add(title(entry.title, true), "\u00A0")
                           /* .add(volume((entry.volume?? entry.number ?? entry.version)), "\u00A0")*/
                            .add(genaitype((entry.howpublished ?? entry.type), true), ".")
                            .add(publisher(entry.publisher), ".")
                            .add(fromUrl(entry.url), "\u00A0")
                            .add(accessed(entry.note, true))
                            .build()
                        }
                    </li>
                );
            case "online":
            case "misc":
                return (
                    <li {...commonProps} typeof="schema:WebSite">
                        {new CitationBuilder()
                            .addIf(entry.author, authorField, "\u00A0")
                            .addIf(!entry.author, authors(wrapped.anyOriginator), ".")
                            .add(title(entry.title, true), ".")
                            .addIf(entry.subtitle, title(entry.title), ".")
                            .addIf(entry.author, publisher(entry.institution ?? entry.publisher), ",")
                            .add(publishedTime((entry.year), (entry.month), (entry.day), false, false, false, true), ".")
                            .add(fromUrl(entry.url), "\u00A0")
                            .add(accessed(entry.note, true))
                            .build()
                        }
                    </li>
                );
            case "video":
                return (
                    <li {...commonProps} typeof="schema:Video">
                        {new CitationBuilder()
                            .add(authorField, "\u00A0")
                            .add(title(entry.title, true), ".")
                            .addIf(entry.subtitle, title(entry.title), ".")
                            .addIf(!entry.howpublished, publisher(entry.publisher), ",")
                            .addIf(entry.howpublished, publisher(entry.publisher), ".")
                            .addIf(entry.howpublished, how(entry.howpublished), ",")
                            .addIf(!entry.month || !entry.day, publishedTime((entry.year), false, false, false, true), ".")
                            .addIf(entry.month && !entry.day, publishedTime((entry.year), entry.month, false, false, false, true), ".")
                            .addIf(entry.day, publishedTime((entry.year), entry.month, entry.day), ".")
                            .add(fromUrl(entry.url), "\u00A0")
                            .add(accessed(entry.note, true))
                            .build()
                        }
                    </li>
                );
            case "proceedings":
                return (
                    <li {...commonProps} typeof="schema:ScholarlyArticle">
                        {new CitationBuilder()
                            .add(authorField, ";")
                            .add(title(entry.title), ".")
                            .addIf(entry.editor, editorField, " Eds.;")
                            /* separator von publisher je nachdem ob address da ist */
                            .addIf(entry.address, publisher(entry.publisher), ":")
                            .addIf(!entry.address, publisher(entry.publisher), ",")
                            .addIf(entry.address, address(entry.address), ",")
                            .add(publishedTime(entry.year), ";")
                            .build()
                        }
                    </li>
                );
            case "inproceedings":
                return (
                    <li {...commonProps} typeof="schema:ScholarlyArticle">
                        {new CitationBuilder()
                            .add(authorField, ";")
                            .add(title(entry.title), ".")
                            .add(title(wrapped.anyConferenceTitle, true, true), ";", "In: ")
                            .addIf(entry.editor, editorField, " Eds.;")
                            /* separator von publisher je nachdem ob address da ist */
                            .addIf(entry.address, publisher(entry.publisher), ":")
                            .addIf(!entry.address, publisher(entry.publisher), ",")
                            .addIf(entry.address, address(entry.address), ",")
                            .add(publishedTime(entry.year), ";")
                            .add(pages(entry.pages), ".")
                            .build()
                        }
                    </li>
                );
            case "unpublished":
                return (
                    <li {...commonProps}>
                        {new CitationBuilder()
                            .add(authorField, ";")
                            .add(title(entry.title), ".")
                            .add(publisher(wrapped.anyUnpublishedOrigin), ",")
                            .add(address(entry.address), ",")
                            .addIf(entry.eventtitle && !entry.year, entry.eventdate , ".")
                            .addIf(!entry.month && !entry.day, publishedTime(entry.year, false, false, false, true), ".")
                            .addIf(entry.month && !entry.day, publishedTime(entry.year, entry.month, false, false, false, true), ".")
                            .addIf(entry.day, publishedTime(entry.year, entry.month, entry.day), ".")
                            .build()
                        }
                    </li>
                );
            case "mastersthesis":
                return (
                    <li {...commonProps}>
                        {new CitationBuilder()
                            .add(authorField, ";")
                            .add(title(entry.title), ".")
                            .add("M.S. Thesis", ",")
                            .add(school(wrapped.thesisOriginator), ",")
                            .add(publishedTime(entry.year), ".")
                            .addIf(entry.url, fromUrl(wrapped.anyLink, true))
                            .build()
                        }
                    </li>
                );
            case "phdthesis":
                return (
                    <li {...commonProps}>
                        {new CitationBuilder()
                            .add(authorField, ";")
                            .add(title(entry.title), ".")
                            .add("Ph.D. Thesis", ",")
                            .add(school(wrapped.thesisOriginator), ",")
                            .add(publishedTime(entry.year), ".")
                            .addIf(entry.url, fromUrl(wrapped.anyLink, true))
                            .build()
                        }
                    </li>
                );
            case "software":
                return (
                    <li {...commonProps}>
                        {new CitationBuilder()
                            .addIf(entry.author, authorField, "\u00A0")
                            .addIf(!entry.author, wrapped.anyOriginator, ".")
                            .addIf(wrapped.hasANumber, title(entry.title, true), ",")
                            .addIf(!wrapped.hasANumber,title(entry.title, true), ".")
                            .addIf(wrapped.hasANumber, wrapped.aNumber, ".")
                            .addIf(entry.url, fromUrl(wrapped.anyLink, true))
                            .addIf(entry.note, accessed(entry.note, true))
                            .build()
                        }
                    </li>
                );
            default:
                return ( <li style={{color:  "orange"}}> Sorry, rendering {entry.type} not possible. </li>)

        }
    }
}