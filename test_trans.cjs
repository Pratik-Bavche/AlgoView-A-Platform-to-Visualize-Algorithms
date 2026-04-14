const fs = require('fs');
const https = require('https');

async function translateText(text) {
    // Avoid translating numbers or tiny symbols only
    if (!/[A-Za-z]/.test(text) || text.length < 2) return text;
    
    return new Promise((resolve) => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const translated = parsed[0].map(x => x[0]).join('');
                    resolve(translated);
                } catch(e) {
                    resolve(text); // Fallback
                }
            });
        }).on('error', () => resolve(text));
    });
}

async function run() {
    console.log(await translateText("Comparing characters at index 0 ('a') and 5 ('f')."));
}
run();
