import { ChromeI18nHelper } from '../shared/chrome-i18n-helper';

ChromeI18nHelper(document.querySelector('body')).parseDom();
ChromeI18nHelper(document.querySelectorAll('[data-template]')).parseTemplates();
