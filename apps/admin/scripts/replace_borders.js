const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('src');

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;

    // Replace the shouty google grey border with a subtle Supabase dark mode grey
    // Supabase often uses #2A2A2A or #2E2E2E, which is equivalent to gray-800 in tailwind.
    // Let's use #2E2E2E to be specific and subtle.
    content = content.replace(/dark:border-\[#5f6368\]/g, 'dark:border-[#2E2E2E]');
    content = content.replace(/dark:border-gray-600/g, 'dark:border-[#2E2E2E]');
    
    // Also change the ID grid display background if it's too shouty? The text was text-[#5f6368] 
    // "the grey color is too shouty and looks more like white than grey."
    // Maybe they meant text-[#5f6368] is too bright? #5b5e61ff is grey.
    // They explicitly said "use superbase type of grey thin borders". So it was about borders.
    
    // Actually, in the dark mode background, they said "superbase type of dark mode color #1A1A1A".
    // I'll leave the text as is, just change the borders.
    // If the ID's borders were also #5f6368, they will be updated by the regex above to #2E2E2E.

    if (content !== original) {
        fs.writeFileSync(f, content, 'utf8');
        console.log(`Updated ${f}`);
    }
});
