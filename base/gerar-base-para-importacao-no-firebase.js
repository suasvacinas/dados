const fs = require('fs');

const base = JSON.parse(fs.readFileSync('base.json', 'utf8'));

/*

 "doses": [
 {
 "chave": "filha-ao-nascer",
 "idadeDose": "Ao nascer",
 "meses": 0,
 "doses": [
 {"chavedose": "bcg-0",                        "nomevacina": "BCG",                        "idadedosemeses": 0,    "idadedoseextenso": "Ao nascer", "dosevacina": "Dose única",        "fontedose": "SUS"},
 {"chavedose": "hepatite-b-0",                 "nomevacina": "Hepatite B",                 "idadedosemeses": 0,    "idadedoseextenso": "Ao nascer", "dosevacina": "Dose ao nascer",    "fontedose": "SUS"}
 ]
 },

 "descricoes-vacinas": [
 {
 "doses": [
 {"chavedose": "bcg-0",                        "nomevacina": "BCG",                        "idadedosemeses": 0,    "idadedoseextenso": "Ao nascer", "dosevacina": "Dose única",        "fontedose": "SUS"}
 ]
 },

 */

let dosesAgregadasObj = {};
let descricoes = base['descricoes-vacinas'];

function adicionarDoseAoDosesAgregadas(dose) {
    dosesAgregadasObj[dose.idadedoseextenso] = dosesAgregadasObj[dose.idadedoseextenso] || {};
    dosesAgregadasObj[dose.idadedoseextenso].idadeDose = dose.idadedoseextenso;
    dosesAgregadasObj[dose.idadedoseextenso].meses = dose.idadedosemeses;
    dosesAgregadasObj[dose.idadedoseextenso].doses = dosesAgregadasObj[dose.idadedoseextenso].doses || [];
    dosesAgregadasObj[dose.idadedoseextenso].doses.push(dose);
}

descricoes.forEach((descricao) => {
    (descricao.doses || []).forEach((dose) => {
        adicionarDoseAoDosesAgregadas(dose);
    })
});

function converterDosesAgregadasObjParaArray() {
    let keys = Object.keys(dosesAgregadasObj);
    let doses = [];
    keys.forEach((key) => {
        doses.push(dosesAgregadasObj[key]);
    });
    doses.sort(function(a, b) {
        return a.meses - b.meses;
    });
    return doses;
}

base.doses = converterDosesAgregadasObjParaArray();

fs.writeFile('base-para-importacao-no-firebase.json', JSON.stringify(base, null, '\t'), 'utf8');