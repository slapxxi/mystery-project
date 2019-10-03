it('changes colors in dark mode', async () => {
  await page.goto('http://localhost:3000/settings');
  await page.waitForSelector('#__next #theme');
  await page.click('#__next #theme');
  await page.select('#__next #theme', 'dark');

  let image = await page.screenshot({ fullPage: true });

  expect(image).toMatchImageSnapshot();
});
