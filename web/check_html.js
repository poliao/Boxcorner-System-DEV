const fs = require('fs');
const content = fs.readFileSync('src/app/demo/forms/pages/dcsm37/dcsm37-detail.component.html', 'utf8');
const lines = content.split('\n');
let stack = [];
let isComment = false;

for(let i=0; i<lines.length; i++) {
  let line = lines[i];
  if(line.includes('<!--')) {
    isComment = true;
  }
  if(line.includes('-->')) {
    isComment = false;
    continue;
  }
  if(!isComment) {
    let tags = line.match(/<\/?(?:div|ng-container|span|ul|li|button|mat-icon|table|thead|tbody|tr|td|th|ng-template|h5|strong|b)[^>]*>/g) || [];
    for(let tag of tags) {
      if(tag.startsWith('</')) {
        let name = tag.replace('</', '').replace('>', '').trim();
        if(stack.length > 0 && stack[stack.length-1].name === name) {
          stack.pop();
        } else {
          console.log('Unexpected close tag at line ' + (i+1) + ': ' + tag);
          console.log('Expected: ' + (stack.length > 0 ? stack[stack.length-1].name : 'empty stack'));
          process.exit(1);
        }
      } else if(!tag.endsWith('/>')) {
        let name = tag.split(/[\s>]/)[0].replace('<', '').trim();
        if(['img', 'br', 'hr', 'input'].includes(name)) continue;
        stack.push({name, line: i+1});
      }
    }
  }
}
console.log('Done. Remaining open tags:');
console.log(stack);
