
const fs = require('fs')

const nome_arquivo = '/Quake.txt'

const path = __dirname + `${nome_arquivo}`

function meuLeitorDeArquivo(caminho) {
    fs.readFile(caminho, 'utf-8', function(error,data) {
        if(error){
            console.log('erro de leitura: '+ error.message)
        } else {
            console.log(data)
        }
    })
}


meuLeitorDeArquivo(path)


