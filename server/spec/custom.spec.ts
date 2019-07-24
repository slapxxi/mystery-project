it('takes screenshot of test page', async () => {
  await page.goto('http://localhost:3000/test');
  let image = await page.screenshot({ fullPage: true });

  expect(image).toMatchImageSnapshot();
});
