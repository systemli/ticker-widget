# Ticker Widget

A web component to display the latest updates from a ticker instance.

## Usage

!!! important

    We will provide a self hosted version of this component soon. Until then you can use the unpkg.com CDN to include the component in your website.

You need to include the script from unpkg.com and then you can use the component like this:

```html
<script type="module" src="https://unpkg.com/@systemli/ticker-widget"></script>
<ticker-timeline domain="updates.systemli.org" limit="10" header="Latest Updates"></ticker-timeline>
```

## Properties

| Property | Attribute | Description | Type     | Default                             |
| -------- | --------- | ----------- | -------- | ----------------------------------- |
| `apiUrl` | `api-url` |             | `string` | `'https://ticker-api.systemli.org'` |
| `domain` | `domain`  |             | `string` | `undefined`                         |
| `header` | `header`  |             | `string` | `''`                                |
| `limit`  | `limit`   |             | `number` | `10`                                |

## Demo

See <https://systemli.github.io/ticker-widget/demo.html>.

<iframe src="https://systemli.github.io/ticker-widget/demo.html" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="systemli-ticker-widget"></iframe>
