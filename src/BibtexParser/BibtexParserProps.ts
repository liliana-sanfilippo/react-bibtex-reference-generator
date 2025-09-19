import {CitationStylesEnum} from "./types";
import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";

export interface BibtexParserProps {
    bibtexSources: string[] | Entry[];
    special?: string,
    start?: number,
    style?: CitationStylesEnum | string
}