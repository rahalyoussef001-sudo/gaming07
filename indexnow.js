const fs = require("fs");
const https = require("https");
const path = require("path");

const host = "gaming07.com";
const key = "f6323c68bc3e4337a7f45778841a1a74";
const keyLocation = `https://gaming07.com/${key}.txt`;

// 1. Read sitemap.xml to extract URLs
const sitemapPath = path.join(__dirname, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
    console.error("❌ sitemap.xml not found! Cannot fetch URLs.");
    process.exit(1);
}

const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
const urlRegex = /<loc>(https:\/\/gaming07\.com\/[^<]+)<\/loc>/g;
const urlList = [];
let match;

while ((match = urlRegex.exec(sitemapContent)) !== null) {
    urlList.push(match[1]);
}

if (urlList.length === 0) {
    console.error("❌ No URLs found in sitemap.xml!");
    process.exit(1);
}

console.log(`Found ${urlList.length} URLs to submit to IndexNow...`);

// 2. Prepare the payload
const payload = JSON.stringify({
    host: host,
    key: key,
    keyLocation: keyLocation,
    urlList: urlList
});

// 3. Define the post request options
const options = {
    hostname: "www.bing.com",
    path: "/indexnow",
    method: "POST",
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(payload)
    }
};

// 4. Send the request
const req = https.request(options, (res) => {
    let responseData = "";
    res.on("data", (chunk) => {
        responseData += chunk;
    });

    res.on("end", () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
            console.log(`🎉 Successfully submitted all URLs to IndexNow (Bing/Yandex)! HTTP Status: ${res.statusCode}`);
        } else {
            console.error(`❌ IndexNow submission failed. HTTP Status: ${res.statusCode}`);
            console.error("Response:", responseData);
        }
    });
});

req.on("error", (err) => {
    console.error("❌ Connection error:", err.message);
});

req.write(payload);
req.end();
