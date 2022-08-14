// const csv = require('csv-parser')
import csvParser from 'csv-parser'

import { createObjectCsvWriter } from 'csv-writer'
import fs from 'fs/promises'
import { createWriteStream, createReadStream } from 'fs'
import { CSV_FILE_PATH } from './Constants.js'


export const readCsv = () => {

    let products = []
    return new Promise((resolve, reject) => {
        createReadStream(CSV_FILE_PATH)
            .pipe(csvParser())
            .on('data', row => products.push(row))
            .on("error", err => reject(err))
            .on('end', () => resolve(products))
    })

}

export const getProductFromCsvById = async (id) => {

    const products = await readCsv()
    return new Promise((resolve, reject) => resolve(products.find(product => parseInt(product.id) === id)))
}

export const writeCsv = (products) => {

    createObjectCsvWriter({
        path: CSV_FILE_PATH,
        header: [{ id: 'id', title: 'id' }, { id: 'name', title: 'name' }, { id: 'vendor', title: 'vendor' }, { id: 'url', title: 'url' }, { id: 'price', title: 'price' }, { id: 'date', title: 'date' }]
    })
        .writeRecords(products)
        .then(() => console.log('The CSV file was written successfully'))
        .catch((err) => console.log('Error writing CSV file: ', err))

}

export const readCsvCore = async (path) => {
    let arrayTemp = []
    try {
        const data = await fs.readFile(path, { encoding: "utf-8" })

        const fichero = data.split("\n")

        const header = fichero.shift().split(",")
        // console.log(header)
        fichero.forEach(row => {
            const rowItems = row.split(",")
            let obj = new Object
            header.forEach((e, i) => {
                obj[e] = rowItems[i]
            })
            arrayTemp.push(obj)
        })
        return arrayTemp

    } catch (error) {
        console.log(error)
    }
}

export const writeCsvCore = async (path,data) => {
    
    try {
        await fs.writeFile(path,data)

       

    } catch (error) {
        console.log(error)
    }
}

