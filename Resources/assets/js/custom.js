/* Form collections */
$(document).ready(function () {
    setupSortableCollectionItem();

    $('body').on('click', 'a.deleteCollectionItem', function (event) {
        event.preventDefault();
        $(this).closest('.form-group').remove();
    });
});

// Support for AJAX loaded modal window.
// Focuses on first input textbox after it loads the window.
$(document).ready(function () {
    $('[data-toggle="modal"]').click(function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        if (url.indexOf('#') == 0) {
            $(url).modal('open');
        } else {
            $.get(url, function (data) {
                $('<div class="modal hide fade">' + data + '</div>').modal();
            }).success(function () {
                    $('input:text:visible:first').focus();
                });
        }
    });

});

/* Setup */
jQuery(function($) {
    $('[data-rel=tooltip]').tooltip({container:'body'});
    $('[data-rel=popover]').popover({container:'body'});
    $(".chosen-select").chosen();
    setTranslatableFields();

    $('.colorbox').colorbox({
        width : 1024,
        height : 728,
        onComplete : function()
        {
            setupColorboxScripts();
        }
    })
});


function setupColorboxScripts()
{
    $(".chosen-select").chosen();
    setTranslatableFields();
    if (CKEDITOR != undefined) {
        var $textAreas = $('#colorbox').find('textarea.ckeditor');
        if ($textAreas.length) {
            $textAreas.each(function() {
                CKEDITOR.replace($(this).attr('id'));
            });
        }
    }
}

/* Portfolio */
$(function() {
    $('.field-media').each(function() {
        $.bigfoot.portfolio(this);
    });
})

/* Translatable fields */
function setTranslatableFields()
{
    if ($('#colorbox').length) {
        var $translatableFields = $('#colorbox .translatable-fields');
    }
    else {
        var $translatableFields = $('.translatable-fields');
    }

    if ($translatableFields.length) {
        setupTranslatableFields($translatableFields);

        $('#locales-container').html(Twig.render(localeTabs, {locales: locales, currentLocale: currentLocale, basePath: basePath}));

        var $localeTab = $('.locale-tabs');
        $localeTab.on('click', 'a', function(event) {
            event.stopPropagation();

            if (!$(this).hasClass('active')) {
                var newLocale = $(this).data('locale');
                $('input[data-locale="'+newLocale+'"], textarea[data-locale="'+newLocale+'"]').closest('div.input-group').show();
                $('input[data-locale="'+currentLocale+'"], textarea[data-locale="'+currentLocale+'"]').closest('div.input-group').hide();

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
    //$tagsSelect.width('100%').select2({tags: arrayTags});
    $('.select2-container').width('100%');
}

/* Functions */
function strpos (haystack, needle, offset) {
    var i = (haystack + '').indexOf(needle, (offset || 0));

    return i === -1 ? false : i;
}

function setupTranslatableFields($translatableFields) {
    $translatableFields.parent().hide();
    // Getting all translated fields to set their parent's data attributes (default locale fields aren't initialized by the translationsubscriber)
    $('input[type="text"], textarea', $translatableFields).each(function() {
        var elementId = $(this).attr('id');
        var parentElementId = elementId.substr(0, elementId.lastIndexOf('-')).replace('_translation', '');

        var $parentElement = $('#'+parentElementId);

        $parentElement
            .data('locale', currentLocale)
            .attr('data-locale', currentLocale);

        $(this).appendTo($parentElement.parent());
    });

    var $wrapper = $('<div class="input-group"></div>');
    var $toWrap = $('input[data-locale], textarea[data-locale]');
    $toWrap.wrap($wrapper);
    $toWrap.each(function() {

        if (!$(this).data('flag')) {
            $(this).parent().addClass($(this).attr('class') + ' no-padding-right no-padding-left');
            $(this).removeClass().addClass('form-control');

            if ($(this).parent().hasClass('ckeditor')) {
                $(this).parent().removeClass('ckeditor');
                $(this).addClass('ckeditor');
            }

            $(this).after($('<span class="input-group-addon"><img src="/bundles/bigfootcore/img/flags/'+$(this).data('locale')+'.gif" /></span>'));
            if ($(this).data('locale') != currentLocale) {
                $(this).closest('div.input-group').hide();
            }
            $(this).data('flag', true);
        }
    });
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

    if (CKEDITOR != undefined) {
        var $textAreas = $form.find('textarea.ckeditor');
        if ($textAreas.length) {
            $textAreas.each(function() {
                CKEDITOR.replace($(this).attr('id'));
            });
        }
    }
}

//Chargement des departements en fonction des regions
$(document).ready(function() {
    var $regions = $('#seh_city_region');
    var $departements = $('#seh_city_department');
    var $path_url = $('#seh_city_region').attr('data-action');

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
