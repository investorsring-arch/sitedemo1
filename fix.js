const fs = require('fs')
// Lire le fichier original uploadé
const src = fs.readFileSync('public/tools/reference-logistique.html')
// Réécrire en UTF-8 explicite
fs.writeFileSync('public/tools/reference-logistique.html', src, { encoding: 'utf8' })
console.log('OK - taille:', src.length)
