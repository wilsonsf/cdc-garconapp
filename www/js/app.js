// Indica quais objetos chamam eventos de modal
$('.modal-trigger').leanModal();

/*
   Ao clicar num item do tipo collection-item, dentro de uma collection
   Se não houer uma badge, ela é inicializada com 0, senão, o seu texto
   é incrementado em 1.
 */
$('.collection')
  .on('click', '.collection-item', function(){

  var $badge = $('.badge', this);
  if ($badge.length === 0) {
    $badge = $('<span class="badge brown-text">0</span>')
                .appendTo(this);
  }

  $badge.text(parseInt($badge.text()) + 1);

  var nomeProduto = this.firstChild.textContent;
  Materialize.toast(nomeProduto + ' adicionado', 1000);
});

// Percorre os itens que possuem quantidade adicionando no resumo
$('#confirmar').on('click', function(){
  var texto = "";

  $('.badge').parent().each(function() {
    texto += this.firstChild.textContent + ': ';
    texto += this.lastChild.textContent + ', ';
  });

  $('#resumo').empty().text(texto);
});

// Ao clicar na quantidade, ela é removida
$('.collection').on('click','.badge', function(){
  $(this).remove();
  return false; //indica se deve deixar outros objetos capturarem a interação
});

// Ao clicar no botão de limpar, apaga as entradas iniciando um novo pedido.
$('.acao-limpar').on('click',function () {
  limpaPedido();
});

// Ao clicar no botão de pedir, indica que o pedido foi realizado e inicia um novo pedido.
$('.acao-finalizar').on('click',function(){
  $.ajax({
    url : 'http://cozinhapp.sergiolopes.org/novo-pedido',
    data : {
      mesa: $('#numero-mesa').val(),
      pedido: $('#resumo').text()
    },
    error: function(erro) {
      Materialize.toast(erro.responseText, 3000, 'red-text');
    },
    success: function(dados) {
      Materialize.toast(dados, 2000);
      limpaPedido();
    }
  });
});

// Código de acionamento da câmera
$('.scan-qrcode').on('click',function(){
  cordova.plugins.barcodeScanner.scan(
    function(resultado) {
      if(resultado.text) {
        Materialize.toast('Mesa '+ resultado.text, 2000);
        $('#numero-mesa').val(resultado.text);
      }
    },
    function(error) {
      Materialize.toast('Erro: ' + error, 3000, 'red-text');
    }
  );
});

//Refactor
function limpaPedido() {
  $('#numero-mesa').val('');
  $('.badge').remove();
};