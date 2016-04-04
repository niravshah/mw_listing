(function() {
  $('#mw_listing_form').validate();
    

  submitPBContact = function() {
    $('#pb_contact_submit').prop('disabled', true);
    $('#pb_contact_spinner').show();

      var postData = {
          department:$('#mw_listing_department').val(),
          description: $('#mw_listing_description').val(),
          location: $('#mw_listing_location').val(),
          role: $('#mw_listing_role').val()
      }

    $.post('/api/listing/mw_listing_submit', JSON.stringify(postData), function(result) {
      if(result.code > 1) {
        $('#pb_contact_spinner').hide();
        $('#pb_contact_submit').prop('disabled', false)
                               .removeClass('btn-primary')
                               .addClass('btn-danger');
        $('#pb_contact_error').show();
        return;
      }

      $('#pb_contact_submit').removeClass('btn-primary')
                             .addClass('btn-success');
      $('#pb_contact_spinner i').removeClass('fa-circle-o-notch')
                                .removeClass('fa-spin')
                                .addClass('fa-check');
      $('#pb_contact_success').show();
    });
  }
}());
