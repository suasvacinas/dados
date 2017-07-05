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
  $.getJSON("https://raw.githubusercontent.com/suasvacinas/suasvacinas/master/_docs/calendario.json", function (dados) {
    console.log(dados);

    dados.shift(); // remover Calendário Nacional de Vacinação 2017
    let nomesVacinas = dados.shift();

    dados.forEach((linha) => {

      let idade: string = linha["FIELD2"];
      let doses: Dose[] = [];
      for (let i = 3; i <= 13; i++) {
        doses.push(new Dose(nomesVacinas["FIELD" + i], linha["FIELD" + i]));
      }

      idades.push(new Idade(idade, doses));
    });

    console.log('resultados');
    console.log(JSON.stringify(idades, null, '\t'));


    let table = $('#doses');
    idades.forEach((idade) => {
      let linha = $("<tr>");
      $("<td>", {text: 'idade: ' + idade.nomeIdade}).appendTo(linha);
      idade.doses.forEach((dose) => {
        if (dose.dose.length) {
          $("<td>", {text: dose.nome + ": " + dose.dose}).appendTo(linha);
        } else {
          $("<td>", {text: "-"}).appendTo(linha);
        }
      });
      table.append(linha);
    });
  });
}

const vacinas = [];
$.getJSON("https://raw.githubusercontent.com/suasvacinas/suasvacinas/master/_docs/descricao.json", function (dados) {
  console.log(dados);

  dados.shift(); // remover Calendário do SUS
  dados.shift(); // remover header

  dados.forEach((linhaVacina) => {
    vacinas.push(new Vacina(
        linhaVacina["FIELD1"],
        linhaVacina["FIELD2"],
        linhaVacina["FIELD3"],
        linhaVacina["FIELD4"])
    );
  });

  console.log('vacinas');
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