import { newE2EPage } from '@stencil/core/testing';

describe('ticker-timeline', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ticker-timeline domain="localhost"></ticker-timeline>');

    const element = await page.find('ticker-timeline');
    expect(element).toHaveClass('hydrated');
  });
});
