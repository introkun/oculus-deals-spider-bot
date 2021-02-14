class DealsItem {
    constructor(dbItem, tags=[]) {
        this.doc = dbItem
        this.tags = tags
    }

    toString() {
        let result = `*${this.doc.name}* \`-${this.doc.discountPercent}%\` `

        result += `(_${this.doc.priceCurrency}${this.doc.price}_ ➡ ` +
            `_${this.doc.salePriceCurrency}${this.doc.salePrice}_)`

        if (this.doc.endsUtc) {
            result += ` until ${(new Date(this.doc.endsUtc)).toUTCString()}`
        }

        if (this.tags && this.tags.length > 0)
            result += ` ${this.tags.map(el => "#" + el).join(" ")}`

        if (this.doc.url)
            result += `\n${this.doc.url}`

        return result
    }
}

export default DealsItem