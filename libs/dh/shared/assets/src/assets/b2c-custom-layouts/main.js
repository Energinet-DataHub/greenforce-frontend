const Utils = {
  waitFor: function (selector, callback) {
    var elm = document.querySelector(selector);

    if (elm) {
      callback(elm);
    } else {
      setTimeout(function () {
        Utils.waitFor(selector, callback);
      }, 100);
    }
  },
  toggleErrorClasses: function () {
    document.querySelectorAll('input').forEach((inputElement) => {
      var parent = inputElement.parentElement;
      var errorElement = inputElement.previousElementSibling;
      var hasError =
        inputElement.classList.contains('highlightError') ||
        errorElement.classList.contains('show');
      if (!parent) return;

      if (hasError) {
        parent.classList.add('entry-item-error');
      } else {
        parent.classList.remove('entry-item-error');
      }
    });
  },
};
