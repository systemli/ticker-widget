# ticker-timeline

This component shows the timeline of a ticker. The number of entries can be limited by the `limit` property.

```html
<ticker-timeline domain="updates.systemli.org" limit="10" header="Systemli Updates"></ticker-timeline>
```

## Properties

| Property | Attribute | Description | Type     | Default                             |
| -------- | --------- | ----------- | -------- | ----------------------------------- |
| `apiUrl` | `api-url` |             | `string` | `'https://ticker-api.systemli.org'` |
| `domain` | `domain`  |             | `string` | `undefined`                         |
| `limit`  | `limit`   |             | `number` | `10`                                |
| `header` | `header`  |             | `string` | `''`                                |
