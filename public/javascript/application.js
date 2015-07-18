$(function() {
  var mdconverter = new showdown.Converter();
  var editor = $("#editor");
  var preview = $("#preview");

  function updatePreview(){
    preview.html(mdconverter.makeHtml(editor.val()));
  }

  updatePreview();

  editor.on('keyup', function(){
   updatePreview();
   console.log('keyup updatePreview');
  });

  var Accordion = function(el, multiple) {
    this.el = el || {};
    this.multiple = multiple || false;

    // Variables privadas
    var links = this.el.find('.link');
    // Evento
    links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
  }

  Accordion.prototype.dropdown = function(e) {
    var $el = e.data.el;
      $this = $(this),
      $next = $this.next();

    $next.slideToggle();
    $this.parent().toggleClass('open');

    if (!e.data.multiple) {
      $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
    };
  } 

  var accordion = new Accordion($('#accordion'), false);

  $("#accordion").on('click', 'a.note-link', function(e)
  {
    e.stopPropagation();
    e.preventDefault();
    $.get(this.href).then(function(data)
    {
      debugger
      editor.val(data);
      updatePreview();
      console.log('click accordion updatePreview');
    });
    return false;
  });

  $("#newnoteform").submit(function(e)
  {
    // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'title'              : $('input[name=title]').val(),
            'notebook_guid'      : $('input[name=notebook_guid]').val()
        };

        // process the form
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/notes', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
                        encode          : true
        })
            // using the done promise callback
            .done(function(data) {
                $("#newModal").modal('hide');
                // log data to the console so we can see
                console.log(data);
                insertNote(data);
                // here we will handle errors and validation messages
            });

        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();

    console.log('form submission')
  });

  function insertNote(data) {
    var notebook_guid = data.notebook_guid;
    var title = data.title;
    var guid = data.guid;
    var newnote = "<li id='"+guid+"'><a class='note-link' href='/notes/"+guid+"'>"+title+"</a></li>";
    $("#"+notebook_guid).siblings('ul').prepend(newnote);
  }

  $(document).ajaxStart(function(){
    console.log('start ajax');
    $(".submenu a").css({'cursor' : 'wait'});
  });
  $(document).ajaxStop(function(){
    console.log('stopped ajax');
    $(".submenu a").css({'cursor' : 'default'});
  });
});
