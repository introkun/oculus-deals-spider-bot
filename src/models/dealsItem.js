class DealsItem {
    constructor(dbItem) {
        this.doc = dbItem
    }

    toString() {
        let result = `*${this.doc.name}* \`-${this.doc.discountPercent}%\` `

        result += `(_${this.doc.priceCurrency}${this.doc.price}_ ➡ ` +
            `_${this.doc.salePriceCurrency}${this.doc.salePrice}_)`

        if (this.doc.url)
          result += `\n${this.doc.url}`

        return result
    }
}

export default DealsItem