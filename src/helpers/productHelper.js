import { getProductFromCsvById, readCsvById } from "./csvHelper"

export const checkPrice = async (id,oldPrice, newPrice) => {

    const product = getProductFromCsvById(id)
    return new Promise((resolve, reject) => {
        if (oldPrice == newPrice) {
            resolve(false)
        } else {
            resolve(true)
        }
    })
}