const fs = require('fs');
const readline = require('readline');
async function readFileByLine(file) {
  const fileStream = fs.createReadStream(file);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    console.log(">>>" + line);
  }
 }
 
readFileByLine('Quake.txt')


// const fs = require('fs')

// const nome_arquivo = '/Quake.txt'

// const path = __dirname + `${nome_arquivo}`

// function meuLeitorDeArquivo(caminho) {
//     fs.readFile(caminho, 'utf-8', function(error,data) {
//         if(error){
//             console.log('erro de leitura: '+ error.message)
//         } else {
//             console.log(data)
//         }
//     })
// }

// meuLeitorDeArquivo(path)


