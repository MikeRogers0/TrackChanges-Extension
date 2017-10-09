# Change Diff

See the differences made to a page.

## TODO

  - https://yarnpkg.com/en/docs/usage - Use Yarn for dependencies. 
  - Landing page - use https://developer.chrome.com/webstore/branding
  - Promo Material
      - https://www.canvasflip.com/visual-inspector/
  - Handle max storage limits.
  - Handle when user presses back button.
  - After install, make the button in the browser do something.
  - Fix weird scrollbars
  - In diff, link to MHTML files.
  - Timestamps in zip file.
  - Popup should contains link to download current page.
  - http://embedhunt.com/
  - Screenshots
  - Link to mhtmls in diff.html
  - Time snapshot was taken, not just date.
  - Ignore inline styles
      - https://bleech.de/
          - Lazy Loading
              - Listen for document change/image loads?
        - Add a panel to the elements document, when it's added that marks the last snapshot as initial?
  - Figure out better UTF-8

## Future Stuff

  - Slack Integration?
  - Diff Summary at top of file.
  - Keyboard Shortcut
  - Save and Download button
  - Delete single snapshot
  - Translate more.
  - Full page screenshots - http://html2canvas.hertzen.com/documentation.html#getting-started could be the way to do this.
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
