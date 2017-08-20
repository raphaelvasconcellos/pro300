function InscricoesController($scope, $http, $location, 
    DialogUtils, TableUtils, SelectUtils, StringUtils,
    AtividadeService, InscricaoService, GrupoService, AvaliacaoService) {

    $scope.init = function() {
        $scope.atividade = AtividadeService.getAtividade();
        buscarInscricoes();
    }

    $scope.excluir = function(id) {
        InscricaoService.excluir(id, buscarInscricoes);
    }

    $scope.gerarGrupos = function() {
        var listaInscricoes = $scope.lista;

        if (GrupoService.existemGruposGerados(listaInscricoes) &&
            !confirm('Alunos já possuem grupos. Deseja realizar uma nova geração de grupos?'))
            return;
        
        var numeroMinimoAlunosPorGrupo = prompt("Qual o número minimo de alunos por grupo?");
        if(numeroMinimoAlunosPorGrupo)
            GrupoService.gerarGrupos(numeroMinimoAlunosPorGrupo, $scope.lista);
    }

    $scope.salvar = function() {
        InscricaoService.salvar($scope.lista, function(response) {
            DialogUtils.showMessage("Inscrições alteradas com sucesso!");
            buscarInscricoes();
        });
    }

    $scope.iniciarAvaliacaoColegas = function() {
        AvaliacaoService.iniciarAvaliacaoColegas($scope.atividade.id, function(response) {
            DialogUtils.showMessage("Foi iniciada a avaliação da ajuda dos colegas do grupo. Informe os alunos que eles devem acessar o sistema para responder as avaliações pendêntes.");
            
            AtividadeService.buscarAtividadePorId($scope.atividade.id, function(atividade) {
                AtividadeService.setAtividade(atividade);
                $scope.atividade = atividade;
            });
            
            buscarInscricoes();
        });
    }

    $scope.voltar = function() {
        $location.path('/');
    }

    $scope.avaliacaoDosColegasIniciada = function() {
        return StringUtils.isNotNullOrEmpty($scope.atividade.dt_inicio_avaliacao);
    }

    function buscarInscricoes() {
        $scope.lista = {};

        InscricaoService.buscarPorAtividade($scope.atividade.id, function(response) {
            $scope.lista = response.data.lista;
            configDataTable();
            SelectUtils.configField();
        });
    }

    function configDataTable() {
        TableUtils.configOrderDataType();

        TableUtils.configDataTable('table-inscricoes', {
            "order": [
                [1, "desc"]
            ],
            "columns": [
                null, null,
                { "orderDataType": "dom-text", type: 'string' },
                { "orderDataType": "dom-checkbox" },
                { "orderDataType": "dom-text-numeric" },
                { "orderDataType": "dom-text-numeric" },
                { "orderDataType": "dom-text-numeric" },
                null
            ]
        });
    }
}
