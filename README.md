# Change Diff

See the differences made to a page.

## TODO

  - Handle max storage limits.
  - Analytics on Marketing Site
  - Write "OMG life is hard" blog post
  - Options - Hide/Show

  ### Submit to (Wednesday!)

  - http://embedhunt.com/
  - Product Hunt
  - HackerNews

## Future Stuff

  - Diff Summary at top of file.
  - Delete single snapshot
  - Slack Integration?
  - Fix weird scrollbars - It happens when the user had a mouse...
  - Keyboard Shortcut
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

    bash release.sh
