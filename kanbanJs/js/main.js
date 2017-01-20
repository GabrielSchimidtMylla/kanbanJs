/*
    Desenvolvido por: Gabriel S. Mylla
    Data: 20/01/2017
    Versão: 1.0.0.0    
 */

(function ($) {

    "use strict";

    $.fn.Kanban = (function (args) {

        var _config = {};

        if (args) { $.extend(_config, args); }

        return this.each(function () {

            //Variaveis
            var $containerKanban = $(this);
            var $panels = $(_config.panels);
            var _allCards = _config.cards;
            var _templateCard = _config.templateCard;
            var _identificadorBasePanels = "_kanban_panel_";

            function configureScroll(element) {
                element.niceScroll({
                    cursorcolor: "#4A8BC2",
                    cursorwidth: '8',
                    cursorborderradius: '6px',
                    background: '#404040',
                    cursorborder: '',
                    zindex: "auto",
                    autohidemode: true
                });
            }

            function configureScrollContainer() {
                configureScroll($containerKanban);
                //Correção de posição dos scrolls filhos
                $containerKanban.on("scroll", function () {
                    refreshScroll(false);
                });
            }

            function refreshScroll(container) {
                if (container)
                    $containerKanban.getNiceScroll().resize();

                $(".panel-cards").getNiceScroll().resize();
            }

            function attachListenerCollapse(element) {

                element.off("click", ".close-kanban")
                    .on("click", ".close-kanban", function () {                        

                        var $this = $(this);
                        var $thisIcon = $this.find("i");
                        var $description = $("<div class='vertical-description'></div>");

                        var $parent = $(this).parents(".panel-kanban");

                        $description.text($parent.find(".title-kanban").text());

                        $parent.toggleClass("kanban-panel-collapse");
                        $this.toggleClass("close-kanban-adjust");
                        $thisIcon.toggleClass("fa-chevron-right").toggleClass("fa-chevron-left");                        

                        if($parent.hasClass("kanban-panel-collapse"))
                            $parent.append($description);
                        else
                            $parent.find(".vertical-description").remove();

                        setTimeout(function () {
                            refreshScroll(true);
                        }, 1200);
                    });
            }

            function createPanels() {
                $panels.each(function () {

                    //Variaveis
                    var _idPanel = this.id;
                    var _cardsPanel = [];

                    //Templates                   
                    var $templateIconClose = $("<span class='close-kanban'><i class='fa fa-chevron-left' aria-hidden='true'></i></span>");
                    var $templatePanelKanban = $("<div class='panel-kanban'></div>");
                    var $templateHeaderKanban = $("<div class='panel-header'></div>");
                    var $templateTitleKanban = $("<h4 class='title-kanban'></h4>");
                    var $templatePanelCardsKanban = $("<div class='panel-cards'></div>");

                    //Set Values
                    $templateTitleKanban.text(this.title);
                    //Identificador interno
                    $templatePanelCardsKanban.attr("id", _identificadorBasePanels + _idPanel);

                    _cardsPanel = createCards(_idPanel);

                    //Create Elements in Dom
                    $templateHeaderKanban.append($templateIconClose);
                    $templateHeaderKanban.append($templateTitleKanban);
                    $templatePanelCardsKanban.append(_cardsPanel);
                    $templatePanelKanban.append($templateHeaderKanban);
                    $templatePanelKanban.append($templatePanelCardsKanban);
                    $containerKanban.append($templatePanelKanban);

                    configureScroll($templatePanelCardsKanban);
                });

                //Cria as ligações
                $panels.each(function () {
                    //Identificador interno
                    var _idPanel = "#" + _identificadorBasePanels + this.id;
                    //Correção de identificador
                    var _targets = this.connectWith.map((item) => { return "#" + _identificadorBasePanels + item });

                    createSortable(_idPanel, _targets, this.onReceive, this.onSort);
                });

                attachListenerCollapse($containerKanban);
            }

            function createCards(idPanel) {
                var _cards = [];
                var _reflectionProps = [];
                var $templateCard = $(_templateCard);

                var _itens = _allCards.filter((item) => { return item.panelId === idPanel });

                if (_itens.length > 0)
                    _reflectionProps = Object.getOwnPropertyNames(_itens[0].content);

                $(_itens).each(function () {
                    var _temp = $templateCard.clone();
                    var _html = _temp.html();

                    _temp.attr("data-id", this.id);
                    _temp.addClass(this.cssColor);

                    for (var i = 0; i < _reflectionProps.length; i++) {
                        var _regex = new RegExp("{{\\s*" + _reflectionProps[i] + "\\s*}}", "g");

                        _html = _html.toString().replace(_regex, this.content[_reflectionProps[i]]);
                    }

                    _temp.html(_html);
                    _cards.push(_temp);
                });

                return _cards;
            }

            function createSortable(element, targets, onReceive, onSort) {
                $(element).sortable({
                    connectWith: targets,
                    placeholder: "card-placeholder",
                    revert: true,
                    receive: onReceive,
                    stop: onSort
                }).disableSelection();
            }

            function initialize() {
                createPanels();
                configureScrollContainer();
            }

            initialize();
        });
    });

    $.fn.revertKanban = (function (args) {
        var _config = {};

        if (args) { $.extend(_config, args); }

        return this.each(function () {

            if (_config === null || _config === undefined)
                return;

            var $target = _config.sender;
            var $card = _config.item;
            var $base = _config.item[0].parentElement;

            $(this).find($base).find($card).remove();
            $(this).find($target).append($card);
        });
    });

})(jQuery);