import { AgencyManagementSystemPage } from './app.po';

describe('agency-management-system App', () => {
  let page: AgencyManagementSystemPage;

  beforeEach(() => {
    page = new AgencyManagementSystemPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
