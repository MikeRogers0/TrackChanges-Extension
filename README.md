# Change Diff

See the differences made to a page.

## TODO

  - Handle max storage limits.
  - Dynamic Elements "Machine Learning"
    - Needs more magic.
  - Figure out better UTF-8
  - Analytics on Marketing Site

  - Write "OMG life is hard" blog post

  ### Submit to (Monday!)

  - http://embedhunt.com/
  - Product Hunt
  - HackerNews

### Sites to test against:

These are the sites that are likely to just fuck my shit up.

 - http://www.right-staff.com/ - Wix mess, the settings
 - https://bleech.de/
 - http://smart-magazine.com/
 - https://www.buddyguard.io
 - http://partswholesale.mercedes-benz.com/ru/
 - Also the ruler extension
 - Bootstrap 4/3 & Foundation.

## Future Stuff

  - Slack Integration?
  - Fix weird scrollbars - It happens when the user had a mouse...
  - Diff Summary at top of file.
  - Keyboard Shortcut
  - Delete single snapshot
  - Translate more.
  - Drag and drop as Markdown 
    -- https://stackoverflow.com/questions/25657626/how-to-copy-html-formatted-text-on-to-clipboard-from-google-chrome-extension#25662380
    -- https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

## Handy scripts for local development

Setup the environment 

    npm install

### Build the CSS & JS

    npm run build

Or if your want to watch

    npm run watch

### Building the release

Want to get all the files working for the Chrome Store? Nice! 

First off bump the version and tag it:

    git tag VERSION

Then run:

    release.sh release
