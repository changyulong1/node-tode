const homedir = require('os').homedir()
const home = process.env.Home || homedir
const p = require('path')
const dbpath = p.join(home, '.todo')
const fs = require('fs')
const db = {
    read(path = dbpath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {encoding: "utf-8", flag: 'a+'}, (error, data) => {
                if (error) return reject(error)
                let list
                try {
                    list = JSON.parse(data.toString())
                } catch (error1) {
                    list = []
                }
                resolve(list)
            })
        })
    },
    write(list,path=dbpath) {
        return new Promise((resolve,reject)=>{
            const string= JSON.stringify(list)
            fs.writeFile(path,string,(error)=>{
                if(error){return reject(error)}
                resolve()
            })
        })

    }
}
module.exports = db