function safeHtmlRenderer(instance, td, row, col, prop, value, cellProperties) {
  var escaped = Handsontable.helper.stringify(value);
  escaped = strip_tags(escaped, '<em><b><strong><a><big>'); //be sure you only allow certain HTML tags to avoid XSS threats (you should also remove unwanted HTML attributes)
  td.innerHTML = escaped;

  return td;
}

function strip_tags(input, allowed) {
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
  commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

  // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
  return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });
}
// Init handsontable which can be edited
function initEditableHandsOnTable(root) {
  root.find(".editable-table").each(function() {
    var $container = $(this).find(".hot");
    var data = null;
    var contents = $(this).find('.hot-contents');
    if (contents.attr("value")) {
      data = JSON.parse(contents.attr("value")).data;
    }
    $container.handsontable({
      data: data,
      startRows: 5,
      startCols: 5,
      minRows: 1,
      minCols: 1,
      rowHeaders: true,
      colHeaders: true,
      preventOverflow: 'horizontal',
      formulas: true,
      beforeChange: function (change, source) {
        console.log(change)
      console.log(source)
        console.log(window.clipboardData.getData('Text'))
      },
      contextMenu: {
        callback: function(key, options) {
          console.log(this.getSelected())
          if (key === 'bold') {
            for (var i = this.getSelected()[0]; i <= this.getSelected()[2]; i++) {
              for (var k = this.getSelected()[1]; k <= this.getSelected()[3]; k++) {
                  if (this.getDataAtCell(i, k)
                    && !this.getDataAtCell(i, k).startsWith('=')) {
                      this.setDataAtCell(i, k, '<b>' + this.getDataAtCell(i, k) +
                        '</b>');
                  }
              }
            }
          }
        },
        items: {
          "bold": {
            name: 'Make bold'
          },
          "normal": {
            name: 'Make normal'
          }
        }
      }
    });
  });
}


function onSubmitExtractTable($form) {
  $form.submit(function(){
    var hot = $(".hot").handsontable('getInstance');
    var contents = $('.hot-contents');
    var data = JSON.stringify({data: hot.getData()});
    contents.attr("value", data);
    return true;
  });
}

// Edit result table button behaviour
function applyEditResultTableCallback() {
  $(".edit-result-table").on("ajax:success", function(e, data) {
    var $result = $(this).closest(".result");
    var $form = $(data.html);
    var $prevResult = $result;
    $result.after($form);
    $result.remove();

    formAjaxResultTable($form);
    initEditableHandsOnTable($form);
    onSubmitExtractTable($form);

    // Cancel button
    $form.find(".cancel-edit").click(function () {
      $form.after($prevResult);
      $form.remove();
      applyEditResultTableCallback();
      toggleResultEditButtons(true);
    });

    toggleResultEditButtons(false);

    $("#result_name").focus();
  });

  $(".edit-result-table").on("ajax:error", function(e, xhr, status, error) {
    //TODO: Add error handling
  });
}
// New result text behaviour
$("#new-result-table").on("ajax:success", function(e, data) {
  var $form = $(data.html);
  $("#results").prepend($form);

  formAjaxResultTable($form);
  initEditableHandsOnTable($form);
  onSubmitExtractTable($form);

  // Cancel button
  $form.find(".cancel-new").click(function () {
    $form.remove();
    toggleResultEditButtons(true);
  });

  toggleResultEditButtons(false);

  $("#result_name").focus();
});

$("#new-result-table").on("ajax:error", function(e, xhr, status, error) {
  //TODO: Add error handling
});

// Apply ajax callback to form
function formAjaxResultTable($form) {
  $form.on("ajax:success", function(e, data) {
    $form.after(data.html);
    $result = $(this).next();
    initFormSubmitLinks($result);
    $(this).remove();

    applyEditResultTableCallback();
    applyCollapseLinkCallBack();
    initHandsOnTables($result);
    toggleResultEditButtons(true);
    initResultCommentTabAjax();
    expandResult($result);
  });
  $form.on("ajax:error", function(e, xhr, status, error) {
    var data = xhr.responseJSON;
    $form.renderFormErrors("result", data);
  });
}

applyEditResultTableCallback();
