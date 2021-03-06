/* Form collections */
$(document).ready(function () {
    setupSortableCollectionItem();

    $('body').on('click', 'a.deleteCollectionItem', function (event) {
        event.preventDefault();

        var container = $(this).closest('[data-container=collection-item]');

        container.remove();
        destroyCkeditor(container);
    });

    initCkeditor();

    $('.bigfoot_file').ace_file_input({
        no_file:'No File ...',
        btn_choose:'Choose',
        btn_change:'Change',
        droppable:false,
        onchange:null,
        thumbnail:false
    });

    $('body').on('click', 'a.confirm-delete-file', function(event) {
        event.preventDefault();
        var link = $(this).attr('href');
        var that = this;
        bootbox.confirm($(this).data('confirm-message'), function(result) {
            if (result) {
                $.ajax({
                    method:'post',
                    url: link,
                    success: function(){
                        $(that).parents('.bigfoot_file_name').fadeOut(300, function(){
                            $(this).remove();
                        });
                    }
                })
            }
        });
    });

});

/* Setup */
jQuery(function($) {
    $('[data-rel=tooltip]').tooltip({container:'body'});
    $('[data-rel=popover]').popover({container:'body'});

    $(".chosen-select-no-search").chosen({disable_search: true});
    $(".chosen-select").chosen({allow_single_deselect: true});
    $('.date-picker').datepicker({
        'autoclose': true,
        'language': currentLocale
    }).next().on(ace.click_event, function(){
        $(this).prev().focus();
    });
    $('.timepicker').timepicker({
        minuteStep: 15,
        showSeconds: false,
        showMeridian: false
    }).next().on(ace.click_event, function(){
        $(this).prev().focus();
    });

    $.bigfoot.portfolio();
    setTranslatableFields();

    $('.colorbox').colorbox({
        width : 1024,
        height : 728,
        onComplete : function()
        {
            setupColorboxScripts();
        }
    });

    $('body').on('click', 'a.in-modal', function(e) {
        e.preventDefault();

        $.get($(this).attr('href'), function(data) {
            var modal = Twig.render(modaleTemplate, {
                modal_content: data
            });

            var $modal = $(modal);
            $modal.on('shown', function () {
                $('.chosen-select', $modal).chosen();
            });
            $modal.modal('show');
        });
    });

    $('.carousel').each(function(e) {
        var nbVisible = Math.min(5, $(this).children().length);
        $(this).parent('.wrapper').css('width', width+'px');
        var width = 500 + (50 * (nbVisible - 1));
        $(this).carouFredSel({
            width: width,
            height: 250,
            align: false,
            padding: [0, width - (nbVisible * 50), 0, 0],
            items: {
                width: 50,
                height: 250,
                visible: nbVisible,
                minimum: 1
            },
            scroll: {
                items: 1,
                duration: 750,
                onBefore: function( data ) {
                    data.items.old.add( data.items.visible ).find( 'span' ).stop().slideUp();
                },
                onAfter: function( data ) {
                    data.items.visible.last().find( 'span' ).stop().slideDown();
                }
            },
            auto: false
        });
        $(this).children().click(function() {
            $(this).trigger( 'slideTo', [this, (-1 * nbVisible) + 1, 'prev'] );
        });
    });
});


function setupColorboxScripts()
{
    $(".chosen-select").chosen();
    setTranslatableFields();
    setTranslatableFields();
    initCkeditor($('#colorbox'));
}

/* Translatable fields */
function setTranslatableFields()
{
    var $translatableFields = $('.translatable-fields');
    var $translatableLabelContainers = $('.translatable-label-container');
    if ($translatableFields.length || $translatableLabelContainers.length) {
        setupTranslatableFields($translatableFields, $translatableLabelContainers);

        $('.locales-container').html(Twig.render(localeTabs, {locales: locales, currentLocale: currentLocale, basePath: basePath}));

        var $localeTab = $('.locale-tabs');
        $localeTab.on('click', 'a', function(event) {
            event.stopPropagation();

            if (!$(this).hasClass('active')) {
                var newLocale = $(this).data('locale');
                var $translatableLabelContainer = $('.translatable-label-container');
                if ($translatableLabelContainer.length) {
                    $('.translatable-label-container[data-locale="'+newLocale+'"]').closest('.translatable-label-container').show();
                    $('.translatable-label-container[data-locale="'+currentLocale+'"]').closest('.translatable-label-container').hide();
                } else {
                    $('input[data-locale="'+newLocale+'"], textarea[data-locale="'+newLocale+'"]').closest('div.input-group').show();
                    $('input[data-locale="'+currentLocale+'"], textarea[data-locale="'+currentLocale+'"]').closest('div.input-group').hide();
                }

                $('a', $localeTab).removeClass('active');
                $(this).addClass('active');
                currentLocale = newLocale;
            }

            return false;
        });
    }
}

/* Sortable */
$(function() {
    $('body').on('click', 'a.addCollectionItem', function (event) {
        event.preventDefault();
        addCollectionItem($(this).data('collection-id'), $(this).data('prototype-name'));
    });
});

/* Delete form */
$(function() {
    $('a#edit-form-delete-action').on(ace.click_event, function() {
        bootbox.confirm($(this).data('confirm-message'), function(result) {
            if (result) {
                $('form#delete-form').submit();
            }
        });
    });
    $('body').on('click', 'a.confirm-action', function(event) {
        event.preventDefault();
        var link = $(this).attr('href');
        bootbox.confirm($(this).data('confirm-message'), function(result) {
            if (result) {
                window.location.replace(link);
            }
        });
    });
});

/* Tags fields */
window.tags = [];
function initSelects() {
    var tags = window.tags;

    if (tags.length == 0) {
        $.ajax({
            url: tagsPath,
            async: false,
            success: function(json) {
                tags = window.tags = $.parseJSON(json);
            }
        });
    }

    var arrayTags = new Array();
    if (tags != undefined && $.isArray(tags) && tags.length > 0) {
        arrayTags = tags;
    }
    var $tagsSelect = $('input.bigfoot_tags_field');

    $tagsSelect.tag({
        placeholder:$tagsSelect.attr('placeholder'),
        source: arrayTags
    });

    $(".chosen-select").chosen();
}

/* Functions */
function strpos (haystack, needle, offset) {
    var i = (haystack + '').indexOf(needle, (offset || 0));

    return i === -1 ? false : i;
}

function setupTranslatableFields($translatableFields, $translatableLabelContainers) {
    if ($translatableFields.length) {
        $translatableFields.parent().hide();
        // Getting all translated fields to set their parent's data attributes (default locale fields aren't initialized by the translationsubscriber)
        $('input[type="text"], textarea', $translatableFields).each(function() {
            var elementId = $(this).attr('id');
            var parentElementId = elementId.substr(0, elementId.lastIndexOf('-')).replace('_translation', '');
            var $parentElement = $('#'+parentElementId);
            var $entityLocale = $('input.entity-locale', $(this).closest('.translatable-fields'));
            var locale = $entityLocale.length ? $entityLocale.val() : defaultLocale;

            $parentElement
                .data('locale', locale)
                .attr('data-locale', locale);

            $(this).appendTo($parentElement.parent());
        });

        var $wrapper = $('<div class="input-group"></div>');
        var $toWrap = $('input[data-locale], textarea[data-locale]');

        $toWrap.each(function() {
            if (!$(this).data('flag')) {
                $(this).wrap($wrapper);
                $(this).parent().addClass($(this).attr('class') + ' no-padding-right no-padding-left');
                $(this).removeClass().addClass('form-control');

                if ($(this).parent().hasClass('ckeditor')) {
                    $(this).parent().removeClass('ckeditor');
                    $(this).addClass('ckeditor');
                }

                $(this).after($('<span class="input-group-addon"><img src="' + basePath + locales[$(this).data('locale')].flag + '" width="16" height="11" /></span>'));
                if ($(this).data('locale') != currentLocale) {
                    $(this).closest('div.input-group').hide();
                }
                $(this).data('flag', true);
            }
        });
    }

    if (typeof $translatableLabelContainers !== "undefined" && $translatableLabelContainers !== null && $translatableLabelContainers.length) {
        $translatableLabelContainers.each(function() {
            $('textarea[data-locale],input[type="text"][data-locale]', $(this)).after($('<span class="input-group-addon"><img src="' + basePath + locales[$(this).data('locale')].flag + '" width="16" height="11" /></span>'));
        });

        $translatableLabelContainers.each(function() {
            if ($(this).data('locale') != currentLocale) {
                $(this).closest('.translatable-label-container').hide();
            }
        });
    }
}

function setupSortableCollectionItem() {
    var $sortableFields = $('input.sortable-field');
    if ($sortableFields.length > 0) {
        $sortableFields.closest('div.sortable-collection-item').parent().each(function() {
            $(this).sortable({
                connectWith: '.'+$(this).attr('class'),
                handle: '.accordion-heading',
                update: function () {
                    var inputs = $('input.sortable-field');
                    var nbElems = inputs.length;
                    $('input.sortable-field').each(function(idx) {
                        $(this).val(idx);
                    });
                }
            });
        });
    }
}

function addCollectionItem(id, name) {
    var collectionHolder = $(id);
    var prototypeName = '__name__';

    if (name != undefined) {
        prototypeName = name;
    }

    var prototype = collectionHolder.attr('data-prototype');
    var reg = new RegExp(prototypeName, 'g');
    var form = prototype.replace(reg, collectionHolder.children().length);
    var $form = $(form);

    collectionHolder.append($form);

    setupSortableCollectionItem();
    setupTranslatableFields($form.find('div.translatable-fields'));

    initCkeditor($form);

    $('.chosen-select').chosen();

    $('.bigfoot_file').ace_file_input({
        no_file:'No File ...',
        btn_choose:'Choose',
        btn_change:'Change',
        droppable:false,
        onchange:null,
        thumbnail:false
    });
}

function destroyCkeditor($container)
{
    if (CKEDITOR != undefined) {
        var $ckEditor = $('.ckeditor', $container);

        if (CKEDITOR && $ckEditor.length) {
            $ckEditor.each(function() {
                var editorId = $(this).attr('id');

                if (editorId) {
                    if (CKEDITOR.instances[editorId] !== undefined) {
                            delete CKEDITOR.instances[editorId];
                    }
                }
            });
        }
    }
}

function initCkeditor($container)
{
    $container = $container || $('body');

    if (CKEDITOR != undefined) {
        var $ckEditor = $('.ckeditor', $container);

        if (CKEDITOR && $ckEditor.length) {
            $ckEditor.each(function() {
                var editorId = $(this).attr('id');

                if (editorId) {
                    var
                        userConfig = $(this).data('config'),
                        richTextConfigs = window.richTextConfigs || {},
                        config = richTextConfigs['default'] || {}
                    ;

                    if (userConfig != undefined && userConfig in richTextConfigs) {
                        config = richTextConfigs[userConfig];
                    }

                    config['filebrowserImageUploadUrl'] = Routing.generate('bigfoot_media_upload');
                    config.allowedContent = true;

                    if (CKEDITOR.instances[editorId] !== undefined) {
                        CKEDITOR.instances[editorId].destroy();
                    }
                    CKEDITOR.replace(editorId, config);
                }
            });
        }
    }
}

//Chargement des departements en fonction des regions
$(document).ready(function() {
    var $regions = $('#seh_city_region');
    var $departements = $('#seh_city_department');
    var $path_url = $regions.attr('data-action');

    $regions.on('change', function() {
        var val = $(this).val();

        if(val != '') {
            $departements.empty();

            $.ajax({
                type: "POST",
                url: $path_url,
                data: 'idRegion='+ val,
                success: function(resp) {
                    $departements.html(resp);
                    $departements.removeAttr('disabled');
                    $departements.trigger("chosen:updated");
                }
            });
        }
    });
});

/* Process management */
$(document).ready(function() {
    window.processInterval = null;
    window.$processList = $('ul.process-list');

    if ($('li[data-process-token]', window.$processList).length > 0) {
        setProcessInterval();
    }
});

function setProcessInterval() {
    window.processInterval = setInterval(function() {
        $.get(Routing.generate('bigfoot_process_list'), function(data) {
            var
                tokens = data,
                nbOngoing = 0,
                nbDone = 0
            ;

            if (Object.keys(tokens).length > 0) {
                $('.process-dropdown').show();
            } else {
                $('.process-dropdown').hide();
            }


            $.each(tokens, function(index, value) {
                var $processContainer = $('li[data-process-token="' + index + '"]', window.$processList);

                if ($processContainer.length == 0) {
                    $processContainer = $('<li data-process-token="' + index + '"></li>');
                    window.$processList.append($processContainer);
                }

                var url = Routing.generate('bigfoot_process_progress', { 'token': index });

                $.get(url, function(data) {
                    $processContainer.html(Twig.render(bigfootProcessItem, { 'process': data }));
                });

                if (value == 1) {
                    nbOngoing++;
                } else {
                    nbDone++;
                }
            });

            if (nbOngoing == 0) {
                clearInterval(window.processInterval);
            }

            $('.process-count').html(nbOngoing);
            $('li[data-process-token]', window.$processList).each(function() {
                if (! $(this).data('process-token') in tokens) {
                    $(this).remove();
                }
            });
        });
    }, 2000);
}
