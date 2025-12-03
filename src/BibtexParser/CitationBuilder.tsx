export class CitationBuilder {
    private parts: React.ReactNode[] = [];

    add(content: React.ReactNode, separator?: string, prefix?: string): this {
        if (prefix) {
            this.parts.push(prefix);
        }
        if (content) {
            this.parts.push(content, separator);
        }
        if(separator && separator != "\u00A0"){
            this.parts.push("\u00A0");
        }
        return this;
    }

    addIf(condition: any, content: React.ReactNode | (() => React.ReactNode), separator?: string, prefix?: string): this {
        if (condition) {
            const node = typeof content === 'function' ? content() : content;
            this.parts.push(prefix, node, separator);
            if(separator && separator != "\u00A0"){
                this.parts.push("\u00A0");
            }
        }
        return this;
    }

    build(): React.ReactNode {
        if (this.parts.length > 0 && this.parts[this.parts.length - 1] === "\u00A0") {
            this.parts.pop();
        }
        return <>{this.parts}</>;
    }
}