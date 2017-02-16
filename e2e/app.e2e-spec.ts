import { WebportalUiPage } from './app.po';

describe('webportal-ui App', function() {
  let page: WebportalUiPage;

  beforeEach(() => {
    page = new WebportalUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
