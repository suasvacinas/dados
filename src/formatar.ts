class Idade {
  constructor(public nomeIdade: string, public doses: Dose[]) { }
}
class Dose {
  constructor(public nome: string, public dose: string) { }
}
class Vacina {
  constructor(public nomeExtenso: string,
              public descricao: string,
              public redePublica: string,
              public variacao: string) { }
}

const idades = [];
function carregarIdades() {
  $.getJSON("dados/calendario.json", function (dados) {

    dados.shift(); // remover Calendário Nacional de Vacinação 2017
    let nomesVacinas = dados.shift();

    let nomes = [];
    dados.forEach((linha) => {

      let idade: string = linha["FIELD2"];
      nomes.push(idade);
      let doses: Dose[] = [];
      for (let i = 3; i <= 13; i++) {
        let dose = linha["FIELD" + i];
        if (dose.length) {
          doses.push(new Dose(nomesVacinas["FIELD" + i], dose));
        }
      }

      idades.push(new Idade(idade, doses));
    });

    console.log(JSON.stringify(nomes, null, '\t'));
    console.log(JSON.stringify(idades, null, '\t'));


    let table = $('#doses');
    idades.forEach((idade) => {
      let linha = $("<tr>");
      $("<td>", {text: 'idade: ' + idade.nomeIdade}).appendTo(linha);
      idade.doses.forEach((dose) => {
        if (dose.dose.length) {
          $("<td>", {html: dose.nome + ": " + dose.dose, 'class': 'contains-'+contains(dose.nome)}).appendTo(linha);
        } else {
          $("<td>", {text: "-"}).appendTo(linha);
        }
      });
      table.append(linha);
    });
  });
}

function contains(nome) {
  return vacinas.filter((vacina) => vacina.nomeExtenso === nome).length > 0;
}

const vacinas = [];
$.getJSON("dados/descricao.json", function (dados) {

  dados.shift(); // remover Calendário do SUS
  dados.shift(); // remover header

  let nomes = [];
  dados.forEach((linhaVacina) => {
    nomes.push(linhaVacina["FIELD1"]);
    vacinas.push(new Vacina(
        linhaVacina["FIELD1"],
        linhaVacina["FIELD2"],
        linhaVacina["FIELD3"],
        linhaVacina["FIELD4"])
    );
  });

  // console.log('vacinas');
  console.log(JSON.stringify(nomes, null, '\t'));
  console.log(JSON.stringify(vacinas, null, '\t'));

  let table = $('#vacinas');
  vacinas.forEach((vacina) => {
    let linha = $("<tr>");
    $("<td>", {text: vacina.nomeExtenso}).appendTo(linha);
    $("<td>", {text: vacina.descricao}).appendTo(linha);
    $("<td>", {text: vacina.redePublica}).appendTo(linha);
    $("<td>", {text: vacina.variacao}).appendTo(linha);
    table.append(linha);
  });

  carregarIdades();
});