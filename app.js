const URL = "https://v6.exchangerate-api.com/v6/d156fa0a2f2191b4cb159e51/latest/";

const aplicacao = document.querySelector(".conteudo__aplicacao");
const texto = document.querySelector(".conteudo__texto");
const mensagem = document.querySelector(".conteudo__mensagem");
const moeda1 = document.getElementById("moeda1");
const moeda2 = document.getElementById("moeda2");
const valorCnvMoeda1 = document.getElementById("valor__moeda1");
const valorCnvMoeda2 = document.getElementById("valor__moeda2");
const descricaoTexto = document.querySelector(".conteudo__input-txt");
const boxTexto = document.querySelector(".conteudo__texto-code");
const botaoGerarTexto = document.getElementById("botao-texto");
const botaoConverter = document.getElementById("botao-converter");
const botaoCopiar = document.getElementById("botao-copiar");
const botaoVoltar = document.getElementById("botao-voltar");

aplicacao.style.display = "";
mensagem.style.display = "none";
texto.style.display = "none";

let valores = new Object();
valores.tipomoeda1 = "";
valores.tipomoeda2 = "";
valores.valormoeda1 = 1.00;
valores.valormoeda2 = 1.00;
valores.taxadeconversao12 = 1.00;

var conversaoRealizada = false;

let data = JSON.parse(consomeAPI(URL + "CLP"));
let conversionRates = new Object(data["conversion_rates"]);
var valorMoeda2 = conversionRates["BRL"].toFixed(6);
registroValorMoeda("CLP", "BRL", valorMoeda2, true);

valorCnvMoeda1.addEventListener("keypress", digitando, false);
descricaoTexto.addEventListener("keypress", digitandoDescricao, false);
botaoCopiar.addEventListener("click", copiar, false);

function tipoMoeda(){
    var moeda1Selecionada = moeda1.options[moeda1.selectedIndex].value;
    var moeda2Selecionada = moeda2.options[moeda2.selectedIndex].value;

    if (moeda1Selecionada == "BRL"){
        document.querySelector(".tipo_moeda1").innerHTML = "R$";
    }

    if ((moeda1Selecionada == "CLP") || (moeda1Selecionada == "USD")){
        document.querySelector(".tipo_moeda1").innerHTML = "$";
    }

    if (moeda2Selecionada == "BRL"){
        moeda2Ok();
        document.querySelector(".tipo_moeda2").innerHTML = "R$";
    }

    if ((moeda2Selecionada == "CLP") || (moeda2Selecionada == "USD")){
        moeda2Ok();
        document.querySelector(".tipo_moeda2").innerHTML = "$";
    }

    data = JSON.parse(consomeAPI(URL + moeda1Selecionada));
    conversionRates = new Object(data['conversion_rates']);
        
    let dataAgora = new Date(Date.now());
    valorMoeda2 = conversionRates[moeda2Selecionada].toFixed(6);
    registroValorMoeda(moeda1Selecionada, moeda2Selecionada, valorMoeda2, true);

    mensagem.style.display = "";
    mensagemEscrita = "(" + dataAgora.toUTCString() + ")" + '<br>' +  "1.00" + moeda1Selecionada + " = " + valorMoeda2 + moeda2Selecionada + '</br>';
    mensagem.innerHTML = mensagemEscrita;

}

function registroValorMoeda(tipoMoeda1, tipoMoeda2, valorMoeda2, registro){
    if (registro == true){
        valores.tipomoeda1 = tipoMoeda1;
        valores.tipomoeda2 = tipoMoeda2;
        valores.taxadeconversao12 = valorMoeda2;
    } else{
        return valores;
    }
}

function consomeAPI(url){
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();
    jsonData = request.responseText;
    return jsonData;
}

function converteValores(){
    var valMoeda1 = valorCnvMoeda1.value;

    if(valMoeda1 != ""){
        if((valores["tipomoeda1"] != "") && (valores["tipomoeda2"] != "")){
            var valMoeda2 = valMoeda1 * valores["taxadeconversao12"];
            valores["valormoeda1"] = valMoeda1;
            valores["valormoeda2"] = valMoeda2;
            valorCnvMoeda2.value = valMoeda2.toFixed(2);

            conversaoRealizada = true;
            botaoGerarTexto.disabled = false;
        } else{
            if (valores["tipomoeda2"] == ""){
                moeda2Vazio();
                conversaoRealizada = false;
            }
        }
    } else{
        inputVazio();
        conversaoRealizada = false;
    }
}

function moeda2Vazio(){
    moeda2.style.border = "1px solid red";
    mensagem.style.display = "";
    mensagem.style.color = "red"
    mensagem.innerHTML = "POR FAVOR, SELECIONE UMA MOEDA!";
}

function moeda2Ok(){
    moeda2.style.border = "none";
    mensagem.innerHTML = "";
    mensagem.style.color = "#D8C4B6";
    mensagem.style.display = "none";
}

function inputVazio(){
    valorCnvMoeda1.style.border = "1px solid red";
    mensagem.style.display = "";
    mensagem.style.color = "red"
    mensagem.innerHTML = "VALOR NÃO IDENTIFICADO!";
}

function digitando(){
    valorCnvMoeda1.style.border = "none";
    mensagem.innerHTML = "";
    mensagem.style.color = "#D8C4B6";
    mensagem.style.display = "none";
}

function gerarTexto(){
    if(conversaoRealizada){
        var descricao = descricaoTexto.value;
        if (descricao != "") {
            botaoConverter.disabled = true;
            montarTexto(descricao);
        } else {
            semDescricao();
        }
    } else{
        valorNaoConvertido();
    }
}

function valorNaoConvertido(){
    mensagem.style.display = "";
    mensagem.style.color = "red"
    mensagem.innerHTML = "PRIMEIRO É NECESSÁRIO CONVERTER UM VALOR!";

    setInterval(function () {
        mensagem.style.display = "none";
        mensagem.style.color = "#D8C4B6";
    }, 5000);
}

function semDescricao(){
    descricaoTexto.style.border = "5px outset red";
    mensagem.style.display = "";
    mensagem.style.color = "red"
    mensagem.innerHTML = "A DESCRIÇÃO DO .txt É OBRIGATÓRIA!";
}

function digitandoDescricao(){
    descricaoTexto.style.border = "5px outset var(--cor-fonte)";
    mensagem.style.display = "none";
    mensagem.style.color = "#D8C4B6"
    mensagem.innerHTML = "";
}

function montarTexto(valDescricao){
    let data = new Date(Date.now());
    let texto = "(" + data.toLocaleDateString() + ") " + valDescricao.toUpperCase() + ": " +
    valores["valormoeda1"] + valores["tipomoeda1"] + " -> " + valores["valormoeda2"].toFixed(2) + valores["tipomoeda2"];

    montarTelaTexto(texto);
}

function montarTelaTexto(textoVar){
    aplicacao.style.display = "none";
    mensagem.style.display = "none";
    texto.style.display = "";

    boxTexto.value = textoVar;
}

function copiar(){
    var textoCopiado = String(boxTexto.value);
    var clipboard = navigator.clipboard;

    if(clipboard == undefined){
        boxTexto.select();
        document.execCommand('copy');

        botaoCopiar__efeito();
    } 
    
    else{
        navigator.clipboard.writeText(textoCopiado);

        botaoCopiar__efeito();
    }
}

function botaoCopiar__efeito(){
    botaoCopiar.innerHTML = "Copiado";

    setInterval(function () {
        botaoCopiar.innerHTML = "Copiar";
    }, 2000);
}

function voltar(){
    window.location.reload(true);
}
