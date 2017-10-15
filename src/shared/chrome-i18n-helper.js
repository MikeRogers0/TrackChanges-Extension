export function ChromeI18nHelper(data) {

  function parseDomForI18ns(dom){
    var i18ns = dom.querySelectorAll('[data-i18n]');

    for (var i = 0, len = i18ns.length; i < len; i++) {
      i18ns[i].innerHTML = chrome.i18n.getMessage('@' + i18ns[i].getAttribute('data-i18n'));
    }

    return dom;
  }

  function parseDom(){
    parseDomForI18ns(data);
  }

  function parseTemplates(){
    var templateDom = document.createElement('div');
    for (var i = 0, len = data.length; i < len; i++) {
      templateDom.innerHTML = data[i].innerHTML;
      data[i].innerHTML = parseDomForI18ns(templateDom).innerHTML;
    }

    return data;
  }

  return {
    parseDom: function(){
      return parseDom();
    },
    parseTemplates: function(){
      return parseTemplates();
    }
  }
}
