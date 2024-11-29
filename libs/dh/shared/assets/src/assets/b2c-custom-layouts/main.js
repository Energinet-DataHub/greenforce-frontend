const Utils = {
  showContent: function () {
    Utils.waitFor('main', (main) => {
      main.style.display = 'block';

      const element = document.getElementById('otpCode');
      if (element) {
        const previousSibling = element.previousElementSibling;
        const parent = element.parentElement;

        if (previousSibling) {
          parent.insertBefore(element, previousSibling);
        }
      }
    });
  },
  waitFor: function (selector, callback) {
    const elm = document.querySelector(selector);

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
      const parent = inputElement.parentElement;
      const errorElement = inputElement.previousElementSibling;
      const hasError =
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
