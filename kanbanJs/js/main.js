(function ($) {

    "use strict";

    $.fn.Kanban = (function (args) {

        return this.each(function () {

            var _config = {
            };

            if (args) { $.extend(_config, args); }

           //Variaveis
           var $containerKanban = $(this);
           var $panels          = $(_config.panels);
           var _allCards           = _config.cards;
           var _templateCard    = _config.templateCard;

           function createPanels()
           {
               $panels.each(function() {

                   //Variaveis
                   var _idPanel = this.id;
                   var _cardsPanel = [];

                   //Templates                   
                   var $templatePanelKanban  = $("<div class='panel-kanban'></div>");
                   var $templateHeaderKanban = $("<div class='panel-header'></div>");
                   var $templateTitleKanban  = $("<h4 class='title'></h4>");
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
                });
           }

           function createCards(idPanel)
           {
               var _cards = [];
               var $templateCard = $(_templateCard);

               var _itens = _allCards.filter((item) => { return item.panelId === idPanel});

               $(_itens).each(function(){
                   var _temp = $templateCard.clone();                   

                   _temp.addClass(this.cssColor);
                   _temp.text(this.text);

                   _cards.push(_temp);
               });

               return _cards;
           }

           function createSortable()
           {
               $(function () {
                    $(".panel-cards").sortable({
                        connectWith: ".panel-cards",
                        placeholder: "card-placeholder"
                    }).disableSelection();
                });
           }

           function initialize()
           {
               createPanels();
               createSortable();
           }

           initialize();
        });
    });

})(jQuery);