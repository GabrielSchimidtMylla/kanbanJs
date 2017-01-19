(function ($) {

    "use strict";

    $.fn.Kanban = (function (args) {

        return this.each(function () {

            var _config = {
            };

            if (args) { $.extend(_config, args); }

            //Variaveis
            var $containerKanban = $(this);
            var $panels = $(_config.panels);
            var _allCards = _config.cards;
            var _templateCard = _config.templateCard;

            function configureScroll(element) {
                element.niceScroll({
                    cursorcolor: "#4A8BC2",
                    cursorwidth: '8',
                    cursorborderradius: '6px',
                    background: '#404040',
                    cursorborder: '',
                    zindex: "auto",
                    autohidemode: false
                });
            }

            function configureScrollContainer() {
               configureScroll($containerKanban);
                //Correção de posição dos scrolls filhos
                $containerKanban.on("scroll", function () {
                    $(".panel-cards").getNiceScroll().resize();
                });
            }

            function createPanels() {
                $panels.each(function () {

                    //Variaveis
                    var _idPanel = this.id;
                    var _cardsPanel = [];

                    //Templates                   
                    var $templatePanelKanban = $("<div class='panel-kanban'></div>");
                    var $templateHeaderKanban = $("<div class='panel-header'></div>");
                    var $templateTitleKanban = $("<h4 class='title-kanban'></h4>");
                    var $templatePanelCardsKanban = $("<div class='panel-cards'></div>");

                    //Set Values
                    $templateTitleKanban.text(this.title);

                    _cardsPanel = createCards(_idPanel);

                    //Create Elements in Dom
                    $templateHeaderKanban.append($templateTitleKanban);
                    $templatePanelCardsKanban.append(_cardsPanel);
                    $templatePanelKanban.append($templateHeaderKanban);
                    $templatePanelKanban.append($templatePanelCardsKanban);
                    $containerKanban.append($templatePanelKanban);

                    configureScroll($templatePanelCardsKanban);
                });
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

            function createSortable() {
                $(function () {
                    $(".panel-cards").sortable({
                        connectWith: ".panel-cards",
                        placeholder: "card-placeholder"
                    }).disableSelection();
                });
            }

            function initialize() {
                createPanels();
                createSortable();
                configureScrollContainer();
            }

            initialize();
        });
    });

})(jQuery);