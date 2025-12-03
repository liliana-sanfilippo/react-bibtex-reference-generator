import React from "react";

export function title(title:string|undefined, italic?: boolean): React.ReactNode {
    if (title === undefined) {
        return ( <span style={{color: "red"}}> NO BOOK TITLE </span>)
    }
    if(italic){
        return (
            <i><span property="schema:name">{title.replace(/[?!.]/g, '').replace(/\n/g, ' ').trim()}</span></i>
        )
    }
    return (
      <><span property="schema:name">{title.replace(/[?!.]/g, '').replace(/\n/g, ' ').trim()}</span></>
    )
}

export function journal(journal: string | undefined, italic?: boolean, jot?: boolean): React.ReactNode {
    let warning = false;
    if (journal === undefined) {
        warning = true;
        journal = "NO JOURNAL"
    }
    if (jot) {
        journal = "J. " + journal;
    }
    if (italic) return (<i style={warning ? { color: "red" } : {}} property="schema:publisher" typeof="schema:Organization">{journal}</i>)
    else return (<span style={warning ? { color: "red" } : {}} property="schema:publisher" typeof="schema:Organization">{journal}</span>)
}

export function issue(issue:string|undefined, no?: boolean): React.ReactNode {
    let warning = false;
    if (issue === undefined) {
        warning = true;
        issue = "NO ISSUE"
    }
    if (no) {
        return (<span style={warning ? { color: "red" } : {}} property="issueNumber" typeof="PublicationIssue">no. {issue as string}</span>)
    } else  return (<span style={warning ? { color: "red" } : {}} property="issueNumber" typeof="PublicationIssue">{issue as string}</span>)
}

export function volume(volume:string | number | undefined, vol?: boolean, big?: boolean): React.ReactNode {
    let warning = false;
    if (volume === undefined) {
        warning = true;
        volume = "NO VOLUME"
    }
    if (vol) {
        return (<span style={warning ? { color: "red" } : {}} property="volumeNumber" typeof="PublicationVolume">{big ? "VOL" : "vol."} {volume as string}</span>)
    } else  return (<span style={warning ? { color: "red" } : {}} property="volumeNumber" typeof="PublicationVolume">{volume as string}</span>)
}

export function publishedTime(year: number | string | undefined, month?: string, day?: string, big?: boolean, yearFist?: boolean, web?: boolean) {
    let warning = false;
    if (year === undefined) {
        warning = true;
        year = "NO YEAR"
    }
    if(year != null) {
        if (month) {
            if (month === "NULL") {
                warning = true;
                month = "NO MONTH"
            }
            if (day) {
                if (day === "NULL") {
                    warning = true;
                    day = "NO DAY"
                }
                if (web) {
                    return (<span style={warning ? { color: "red" } : {}}><time property="schema:datePublished" dateTime={month + (year as string)}>{month} {day}, {year}</time></span>)
                } else return (<span style={warning ? { color: "red" } : {}}><time property="schema:datePublished" dateTime={month + (year as string)}>{year} {month} {day}</time></span>)
            } else if (yearFist) {
                return (<span style={warning ? { color: "red" } : {}}><time property="schema:datePublished" dateTime={month + (year as string)}>{year} {month}</time></span>)
            }
            return (<span style={warning ? { color: "red" } : {}}><time property="schema:datePublished" dateTime={month + (year as string)}>{month} {year}</time></span>)
        }
        else if (big) {
            return (<b style={warning ? { color: "red" } : {}}><time property="schema:datePublished" dateTime={(year as string)}>{year}</time></b>)
        }
        else return (<span style={warning ? { color: "red" } : {}}><time property="schema:datePublished" dateTime={(year as string)}>{year}</time></span>)
    }
}

export function doi(doi: string | undefined, big?: boolean): React.ReactNode {
    if (doi === undefined) {
        return (<span style={{color: "red"}}> NO DOI </span>)
    } else {
        if (!doi.includes("https")) {
            doi  = "https://doi.org/" + doi;
        }
    }
    return (
        <span>{big ? "DOI" : "doi"}: <span><a className="doi" href={doi}>{doi}</a></span></span>
    )
}

export function pages(pages: string | undefined): React.ReactNode {
    if(pages === undefined) {
        return <span style={{color: "red"}}>NO PAGES</span>
    }
    if (pages && pages.length > 0) {
        const pageRangeRegex = /--|-|–|â€“/;
        if (pageRangeRegex.test(pages)) {
            const pag = pages.split(pageRangeRegex).map(p => p.trim());
            const begin = pag[0];
            const end = pag[1];

            return (
                <>
                    <span property="schema:pageBegin">{begin}</span>-<span property="schema:pageEnd">{end}</span>
                </>
            );
        } else if (/^\d+(-\d+)?$/.test(pages)) {
            return (
                <>
                    <span property="schema:pageBegin">{pages}</span>
                </>
            );
        } else {
            console.warn(`Non-numeric page information detected ('${pages}'). Still showing it.`);
           return  <span property="schema:pageBegin">{pages}</span>
        }
    } else {
        console.warn("Sorry, no page information.");
        return <span style={{color: "red"}}>NO PAGES</span>;
    }
}


export function fromUrl(url: string| undefined): React.ReactNode {
    if (url === undefined) {
        return (
            <span style={{color: "red"}}> NO URL </span>
        )
    }
    return (
       <a property="url" datatype="url" href={url}>{url}</a>
    )
}

export function authors(authors: string|undefined): React.ReactNode {
    if (authors === undefined) {
        return ( <span style={{color: "red"}}> NO AUTHORS OR INSTITUTION </span>)
    }
    return (<span>{authors}</span>)
}
export function publisher(publisher: string|undefined, italic?: boolean): React.ReactNode {
    if (publisher === undefined) {
        return ( <span style={{color: "red"}}> NO PUBLISHER </span>)
    }
    if (italic) {
        return ( <i>{publisher}</i>)
    }
    return (<span>{publisher}</span>)
}

export function how(how: string|undefined): React.ReactNode {
    if (how === undefined) {
        return ( <span style={{color: "red"}}> NO WEBSITE </span>)
    }
    return (<span>{how}</span>)
}


export function accessed(accessed: string|undefined, braces?: boolean): React.ReactNode {
    if (accessed === undefined) {
        return ( <span style={{color: "red"}}> NO ACCESS DATE </span>)
    }
    if (braces) {
        (<span>{accessed}</span>)
    }
    return (<span>({accessed})</span>)
}

export function genaitype(genaitype: string|undefined, braces?: boolean): React.ReactNode {
    if (genaitype === undefined) {
        return ( <span style={{color: "red"}}> NO GEN AI TYPE </span>)
    }
    if (braces) {
        (<span>{genaitype}</span>)
    }
    return (<span>({genaitype})</span>)
}

export function address(address: string|undefined): React.ReactNode {
    if (address === undefined) {
        return ( <span style={{color: "red"}}> NO ADDRESS / LOCATION </span>)
    }
    return (<span>{address}</span>)
}


export function school(school: string|undefined): React.ReactNode {
    if (school === undefined) {
        return ( <span style={{color: "red"}}> NO SCHOOL </span>)
    }
    return (<span>{school}</span>)
}

export function edition(edition: string|undefined): React.ReactNode {
    if (edition === undefined) {
        return ( <span style={{color: "red"}}> NO EDITION </span>)
    }
    return (<span>{edition}</span>)
}


export function conference(conference: string): React.ReactNode {
    if (conference === "NULL") {
        return ( <span style={{color: "red"}}> NO CONFERENCE OR EVENT </span>)
    }
    return (<span>{conference}</span>)
}
