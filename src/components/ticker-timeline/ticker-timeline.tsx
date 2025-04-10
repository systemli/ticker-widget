import { Component, Host, Prop, State, h } from '@stencil/core';
import { format, formatDistance } from 'date-fns';
import linkifyHtml from 'linkify-html';

type Response = {
  data: MessageResponse;
  status: string;
};

type MessageResponse = {
  messages: Array<Message>;
};

type Message = {
  id: number;
  createdAt: string;
  text: string;
  geoInformation: string;
  attachments: Array<Attachment>;
};

type Attachment = {
  url: string;
  contentType: string;
};

@Component({
  tag: 'ticker-timeline',
  styleUrl: 'ticker-timeline.css',
  shadow: false,
})
export class TickerTimeline {
  @State() items: Array<Message> = [];
  @State() error: string = '';

  @Prop() header: string = '';

  @Prop() origin: string;

  @Prop() apiUrl: string = 'https://ticker-api.systemli.org';

  @Prop() limit: number = 10;

  async connectedCallback() {
    fetch(`${this.apiUrl}/v1/timeline?origin=${this.origin}&limit=${this.limit}`)
      .then(response => response.json())
      .then((response: Response) => {
        this.items = response.data.messages;
      })
      .catch(error => {
        this.error = error.message;
      });
  }

  headline(header: string) {
    if (header === '') {
      return;
    }

    return (
      <div>
        <h2 class="ticker-timeline__headline">{header}</h2>
        <p class="ticker-timeline__subheadline">
          from <a href={this.origin}>{this.origin.replace(/https?:\/\//, '')}</a>
        </p>
      </div>
    );
  }

  attachments(attachments: Array<Attachment>) {
    return (
      <div>
        {attachments.map(attachment => (
          <div class="ticker-timeline__attachment">
            <img src={attachment.url} />
          </div>
        ))}
      </div>
    );
  }

  content(text: string) {
    const div = document.createElement('div');
    div.className = 'ticker-timeline__content';

    text.split('\n').forEach(paragraph => {
      const p = document.createElement('p');
      p.innerHTML = linkifyHtml(paragraph, {
        format: (value, type) => {
          if (type === 'url' && value.length > 30) {
            value = value.slice(0, 30) + '…';
          }
          return value;
        },
      });
      div.appendChild(p);
    });

    return <div innerHTML={div.innerHTML}></div>;
  }

  render() {
    if (this.error !== '') {
      return (
        <Host class="ticker-timeline">
          {this.headline(this.header)}
          <div class="ticker-timeline__error">
            <p>Sorry, unable to fetch messages.</p>
          </div>
        </Host>
      );
    }

    if (this.items.length === 0) {
      return (
        <Host class="ticker-timeline">
          {this.headline(this.header)}
          <div class="ticker-timeline__error">
            <p>No messages found.</p>
          </div>
        </Host>
      );
    }

    return (
      <Host class="ticker-timeline">
        {this.headline(this.header)}
        {this.items.map(item => (
          <div class="ticker-timeline__entry">
            {this.content(item.text)}
            {item.attachments !== null && this.attachments(item.attachments)}
            <time class="ticker-timeline__date" dateTime={item.createdAt} title={format(new Date(item.createdAt), 'MMM d, y h:mm')}>
              {formatDistance(new Date(item.createdAt), new Date(), { addSuffix: true })}
            </time>
          </div>
        ))}
      </Host>
    );
  }
}
