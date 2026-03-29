const fs = require('fs');
const path = require('path');
const dir = 'c:\\Users\\Windows 11\\Desktop\\SE_KPS_68_6\\nestjs-wellmate-backend\\src';
const rep = {
    'first_name': 'firstName',
    'last_name': 'lastName',
    'activity_level': 'activityLevel',
    'goal_detail': 'goalDetail',
    'updated_at': 'updatedAt'
};
function walk(d) {
    let res = [];
    fs.readdirSync(d).forEach(f => {
        f = path.join(d, f);
        if (fs.statSync(f).isDirectory() && !f.includes('node_modules') && !f.includes('dist')) {
            res = res.concat(walk(f));
        } else if (f.endsWith('.ts')) {
            res.push(f);
        }
    });
    return res;
}
walk(dir).forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    let n = c;
    for (let [k, v] of Object.entries(rep)) {
        n = n.replace(new RegExp('\\b' + k + '\\b', 'g'), v);
    }
    if (c !== n) { 
        fs.writeFileSync(f, n); 
        console.log('Fixed', f); 
    }
});
