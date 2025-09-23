import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";
import {accessed} from "./htmlUtils";

export function accessDate(entry: Entry) {
    return accessed(entry.accessdate ?? entry.note ?? "NULL")
}