import http from "node:http";

http.get("http://127.0.0.1:3723/", (res) => {
  let d = "";
  res.on("data", (c) => (d += c));
  res.on("end", () => {
    const queued = /__next_s[\s\S]{0,120}motion-pending/.test(d);
    const idx = d.indexOf("motion-preference");
    console.log(
      JSON.stringify(
        {
          queued,
          snippet: d.slice(Math.max(0, idx - 60), idx + 180),
        },
        null,
        2,
      ),
    );
  });
});
