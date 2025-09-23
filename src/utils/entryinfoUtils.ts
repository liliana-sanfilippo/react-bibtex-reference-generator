import {Entry} from "@liliana-sanfilippo/bibtex-ts-parser";
import {accessed, conference, publisher, volume} from "./htmlUtils";

export function getAccessDateInfo(entry: Entry) {
    return accessed(entry.accessdate ?? entry.note ?? "NULL")
}

export function getConferenceInfo(entry: Entry) {
    return conference((entry.journal ?? entry.publisher ?? entry.eventtitle ?? entry.institution ?? entry.organization ?? "NULL" ))
}

export function getPublisherInfo(entry: Entry) {
    return publisher((entry.journal ?? entry.publisher ?? entry.institution ?? entry.organization ?? "NULL" ))
}

export function getVolumeOrSeriesInfo(entry: Entry) {
    return volume((entry.volume) ?? entry.series ?? "NULL")
}


export function getVolumeInfo(entry: Entry) {
return volume((entry.volume ?? "NULL"))
}