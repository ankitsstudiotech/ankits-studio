const { chromium } = require("@playwright/test");

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const checks = await p.evaluate(() => {
    const shell = getComputedStyle(document.body);
    const practical = document.querySelector("#practical");
    const ps = practical ? getComputedStyle(practical) : null;
    const footer = document.querySelector("footer");
    const logo = document.querySelector("header img");
    const logoParent = logo && logo.parentElement;
    const infoLi = document.querySelector(".pulse-info-grid li");
    const titles = Array.from(
      document.querySelectorAll("#services a h3, #services a h4"),
    ).map((el) => ({
      text: el.textContent,
      font: getComputedStyle(el).fontFamily,
      transform: getComputedStyle(el).textTransform,
    }));
    return {
      bodyBg: shell.backgroundColor,
      practicalBg: ps && ps.backgroundColor,
      practicalColor: ps && ps.color,
      hasNeighbourhood: /open neighbourhood studio/i.test(document.body.innerText),
      footerText: footer && footer.innerText.slice(0, 800),
      logoParentTag: logoParent && logoParent.tagName,
      logoParentBg: logoParent && getComputedStyle(logoParent).backgroundColor,
      logoSrc: logo && logo.getAttribute("src"),
      infoGridBg: infoLi && getComputedStyle(infoLi).backgroundColor,
      faqBg: document.querySelector("#faq") && getComputedStyle(document.querySelector("#faq")).backgroundColor,
      trialH2Color:
        document.querySelector("#home-trial-title") &&
        getComputedStyle(document.querySelector("#home-trial-title")).color,
      titles,
    };
  });
  console.log(JSON.stringify(checks, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
