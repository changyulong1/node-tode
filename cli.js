#!/usr/bin/env nodech
const program  = require('commander');
const api = require('./index')
const pkg=require('./package.json')
program
    .version(pkg.version)
    .option('-d, --ddd', 'output extra debugging')

program
    .command('add')
    .description('add name')
    .action((val) => {
        api.add(val).then(()=>{console.log('添加成功')},()=>{console.log('添加失败')})
    });
program
    .command('clear')
    .description('clear')
    .action(() => {
        api.clear().then(()=>{console.log('删除成功')},()=>{console.log('删除失败')})
    });
program.parse(process.argv);
//process.argv输入的内容
if(process.argv.length===2){
    api.showAll()
}
