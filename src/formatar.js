var Idade = (function () {
    function Idade(nomeIdade, doses) {
        this.nomeIdade = nomeIdade;
        this.doses = doses;
    }
    return Idade;
}());
var Dose = (function () {
    function Dose(nome, dose) {
        this.nome = nome;
        this.dose = dose;
    }
    return Dose;
}());
var Vacina = (function () {
    function Vacina(nomeExtenso, descricao, redePublica, variacao) {
        this.nomeExtenso = nomeExtenso;
        this.descricao = descricao;
        this.redePublica = redePublica;
        this.variacao = variacao;
    }
    return Vacina;
}());
var idades = [];
function carregarIdades() {
    $.getJSON("dados/calendario.json", function (dados) {
        dados.shift(); // remover Calendário Nacional de Vacinação 2017
        var nomesVacinas = dados.shift();
        dados.forEach(function (linha) {
            var idade = linha["FIELD2"];
            var doses = [];
            for (var i = 3; i <= 13; i++) {
                var dose = linha["FIELD" + i];
                if (dose.length) {
                    doses.push(new Dose(nomesVacinas["FIELD" + i], dose));
                }
            }
            idades.push(new Idade(idade, doses));
        });
        console.log(JSON.stringify(idades, null, '\t'));
        var table = $('#doses');
        idades.forEach(function (idade) {
            var linha = $("<tr>");
            $("<td>", { text: 'idade: ' + idade.nomeIdade }).appendTo(linha);
            idade.doses.forEach(function (dose) {
                if (dose.dose.length) {
                    $("<td>", { html: dose.nome + ": " + dose.dose, 'class': 'contains-' + contains(dose.nome) }).appendTo(linha);
                }
                else {
                    $("<td>", { text: "-" }).appendTo(linha);
                }
            });
            table.append(linha);
        });
    });
}
function contains(nome) {
    return vacinas.filter(function (vacina) { return vacina.nomeExtenso === nome; }).length > 0;
}
var vacinas = [];
$.getJSON("dados/descricao.json", function (dados) {
    dados.shift(); // remover Calendário do SUS
    dados.shift(); // remover header
    dados.forEach(function (linhaVacina) {
        vacinas.push(new Vacina(linhaVacina["FIELD1"], linhaVacina["FIELD2"], linhaVacina["FIELD3"], linhaVacina["FIELD4"]));
    });
    // console.log('vacinas');
    console.log(JSON.stringify(vacinas, null, '\t'));
    var table = $('#vacinas');
    vacinas.forEach(function (vacina) {
        var linha = $("<tr>");
        $("<td>", { text: vacina.nomeExtenso }).appendTo(linha);
        $("<td>", { text: vacina.descricao }).appendTo(linha);
        $("<td>", { text: vacina.redePublica }).appendTo(linha);
        $("<td>", { text: vacina.variacao }).appendTo(linha);
        table.append(linha);
    });
    carregarIdades();
});
//# sourceMappingURL=formatar.js.map