const PDFGenerator = require('pdfkit')
const fs = require('fs')

class pdfFileGenerator {
    constructor(invoice,pdfName) {
        this.invoice = invoice
        this.pdfName=pdfName
    }

    generateHeaders(doc) {
        const Address = this.invoice.addresses.billing

        doc
            .image('starmatifyP/../image/starmatelogo.png', 50, 50, { width: 100,height: 100,})
            .fillColor('#000')
            .fontSize(20)
            .text('STARMATIFY', 275, 90, {align: 'right'})
            .fontSize(10)
     
            .text(Address.address, {align: 'right'})
    
        const beginningOfPage = 50
        const endOfPage = 550

        doc.moveTo(beginningOfPage,200)
           // .lineTo(endOfPage,200)
           // .stroke()
                
        doc.text(`Memo: ${this.invoice.memo || 'N/A'}`, 50, 210)

        doc.moveTo(beginningOfPage,250)
            .lineTo(endOfPage,250)
            .stroke()

    }

    generateTable(doc) {
        const tableTop = 270
        const itemCodeX = 50
        const descriptionX = 100
        const quantityX = 250
        const priceX = 300
        const amountX = 350

        doc
            .fontSize(10)
            .text('Item Code', itemCodeX, tableTop, {bold: true})
            .text('Description', descriptionX, tableTop)
            .text('Quantity', quantityX, tableTop)
            .text('Price', priceX, tableTop)
            .text('Amount', amountX, tableTop)

        const items = this.invoice.items
        let i = 0


        for (i = 0; i < items.length; i++) {
            const item = items[i]
            const y = tableTop + 25 + (i * 25)

            doc
                .fontSize(10)
                .text(item.itemCode, itemCodeX, y)
                .text(item.description, descriptionX, y)
                .text(item.quantity, quantityX, y)
                .text(`$ ${item.price}`, priceX, y)
                .text(`$ ${item.amount}`, amountX, y)
        }
    }

    generateFooter(doc) {
        doc
            .fontSize(10)
            .text(`Payment due upon receipt. `, 50, 700, {
                align: 'center'
            })
    }

    generate() {
        let theOutput = new PDFGenerator 

        theOutput.pipe(fs.createWriteStream(`starmatifyP/../client/public/uploads/QoutePDF/${this.pdfName}.pdf`));

        this.generateHeaders(theOutput)

        theOutput.moveDown()

        this.generateTable(theOutput)

        this.generateFooter(theOutput)
        

        // write out file
        theOutput.end()

    }
}

module.exports = pdfFileGenerator