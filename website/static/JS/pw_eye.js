$(document).ready(function() {
    $('.toggle-password').click(function() {
      $(this).toggleClass('active');
      var password = $(this).prev('input');
      if (password.attr('type') === 'password') {
        password.attr('type', 'text');
        $(this).find('i').removeClass('ri-eye-off-line').addClass('ri-eye-line');
      } else {
        password.attr('type', 'password');
        $(this).find('i').removeClass('ri-eye-line').addClass('ri-eye-off-line');
      }
    });
  });