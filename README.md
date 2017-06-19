# midipipe

midipipe is a WebMIDI-enabled site that allows you to route MIDI hardware through the browser, replacing the need for a hardware MIDI patchbay. Visit [http://midipipe.com](midipipe.com) to see it in action.

**Note**: midipipe only works on Chrome as this is the only browser that supports the WebMIDI API!

## Install

```
npm install
```

## Running

### Production

```
npm run build
```

Then serve the files - You can do this with python via `python -m SimpleHTTPServer`, then browse to `http://localhost:8000`.

### Development

```
npm run start
```

Then browse to `http://localhost:8082/index.dev.html`

## Contributing

If you have discovered a bug or have a feature suggestion please feel free to create an issue on Github. Pull requests are welcome but please be aware that my aim for this project is simplicity. Additions that over-complicate functionality will not be merged in.