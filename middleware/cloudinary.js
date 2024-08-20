const cloudinary = require("cloudinary").v2
const dotenv = require("dotenv")


// congig
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const addToCloud = (path, settings) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await cloudinary.uploader.upload(path, settings)
            if (result) {
                resolve(result)
            }
        } catch (error) {
            reject(error)
        }
    })
}

const deleteFromCloud = (uri) => {

    return new Promise(async (resolve, reject) => {
        try {
            console.log('from here')
            if (!uri.startsWith('http')) return resolve()

            const uriSplitted = uri.split('/')
            const folder = uriSplitted[uriSplitted.length - 2].startsWith("v1") ? '' : uriSplitted[uriSplitted.length - 2] + '/'
            const file = uriSplitted[uriSplitted.length - 1]
            const filename = file.split('.')[0]

            const public_id = `${folder}${filename}`
            const result = await cloudinary.uploader.destroy(public_id)
            console.log('from here')
            if (result === "ok") {
                resolve(result)
            } else {
                reject('Not found file')
            }

        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { addToCloud, deleteFromCloud }