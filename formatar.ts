$.getJSON('https://raw.githubusercontent.com/suasvacinas/suasvacinas/master/_docs/calendario.json', function (dados) {
  console.log(dados);

  dados.shift(); // remover Calendário Nacional de Vacinação 2017
  let vacinas = dados.shift();

  let resultados = [];
  dados.forEach((linha) => {
    console.log('linha', linha);
    let resultado = {};
    resultado.idade = linha["FIELD2"];
    resultado.vacinas = [];
    for (let i = 3; i <= 13; i++) {
      resultado.vacinas.push({
        nome: vacinas["FIELD" + i],
        dose: linha["FIELD" + i]
      });
    }
    resultados.push(resultado);
  });

  console.log('resultados');
  console.log(resultados);


  let table = $('table');
  resultados.forEach((resultado) => {
    let linha = $("<tr>");
    $("<td>", {text: 'idade: ' + resultado.idade}).appendTo(linha);
    resultado.vacinas.forEach((vacina) => {
      if (vacina.dose.length) {
        $("<td>", {text: vacina.nome + ": " + vacina.dose}).appendTo(linha);
      } else {
        $("<td>", {text: "-"}).appendTo(linha);
      }
    });
    table.append(linha);
  })
});
