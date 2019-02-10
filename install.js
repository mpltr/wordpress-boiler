const request = require('request');
const fs = require('fs-extra');
const extract = require('extract-zip');
const readline = require('readline-sync');

function slugify(string) {
  const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
  const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
  const p = new RegExp(a.split('').join('|'), 'g')
  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with ‘and’
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple — with single -
    .replace(/^-+/, '') // Trim — from start of text .replace(/-+$/, '') // Trim — from end of text
}

console.log('Downloading Latest Wordpress...');
request('http://wordpress.org/latest.zip')
  .pipe(fs.createWriteStream('wordpress.zip'))
  .on('close', function () {
    console.log('Wordpress Downloaded.');
    console.log('Extracting Wordpress...');
    extract('wordpress.zip', {dir: __dirname},function(err) {
      if(err){
        console.log('Error extracting files:');
        console.log(err);
        return;
      }        
      console.log('Wordpress Extracted.');
      const projectName = readline.question("Enter Project Name: ");
      console.log('Moving Files to Project... [this can take a minute]');
      fs.moveSync(`${__dirname}/wordpress`, `${__dirname}/../${projectName}`, err => {
        if(err) return console.error(err);
      });
      console.log('Files Moved.');
      const themeName = readline.question("Enter Theme Name: ");
      const themeSlug = slugify(themeName);
      console.log('Building Theme Directory...');
      fs.mkdirSync(`${__dirname}/../${projectName}/wp-content/themes/${themeSlug}`);
      fs.copySync(`${__dirname}/theme-files`, `${__dirname}/../${projectName}/wp-content/themes/${themeName}`);
      const themeSassContent = `/* Theme Name: ${themeName} */`;
      fs.writeFile(`../${projectName}/wp-content/themes/${themeSlug}/src/sass/components/__Theme.scss`, themeSassContent, err => {
        if(err) throw err;
      });
      console.log('Theme Directory Built.');
      console.log('Enjoy!');
    })
  });