<?php
    require_once '../../Config.php';

    LOG::Debug("API: atividade/buscarPorId");

    acessoRestrito(array($ADMINISTRADOR, $COORDENADOR, $PROFESSOR));

    try {
        $lista = Atividade::buscarPorId($_GET['id']);
        
        respostaListaJson($lista);
    } catch(Exception $e) {
        LOG::Error($e);
        respostaErroJson($e);
    }
?>