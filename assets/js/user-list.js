'use strict';

$(function () {
  $('#delete-cancel').click(function (e) {
    e.preventDefault();
    location.href = '/user/list';
  });
  //
  // $('#delete-confirm')
  //
  //
  // $('.delete', '#user-list').click(function () {
  //   $.ajax('/user/delete', {method: 'DELETE', data: {id: this.dataset.id}})
  //     .success(function () { location.href = '/user/list'; })
  //     .fail(function () { console.error(arguments); });
  // });
});
