const db = require('./db')
const inquirer = require('inquirer');
module.exports.add = async (val) => {
    //获得数据
    let list = await db.read()
    //添加数据
    list.push({title: val, done: false})
    //添加到数据库
    await db.write(list)
}

module.exports.clear = async () => {
    //删除所有任务
    await db.write([])
}
//已完成
function markAsDome(list,index){
    list[index].done=true
    db.write(list)
}
//未完成
function markAsUndone(list,index){
    list[index].done=false
    db.write(list)
}
//修改标题
function updateTitle(list,index){
    inquirer.prompt({
        type:'input',
        name:"title",
        message:'新的标题',
        default:list[index].title
    }).then((answers3)=>{
        list[index].title=answers3.title
        db.write(list)
    })
}
//删除任务
function remove(list,index){
    list.splice(index,1)
    db.write(list)
}


function askForAction(list,index){
    const actions ={markAsDome, markAsUndone, updateTitle, remove}
    inquirer.prompt({
        type:'list',
        name:'action',
        message:'选择的操作',
        choices:[
            {name:'添加',value:'quit'},
            {name:'已完成',value:'markAsDome'},
            {name:'未完成',value:'markAsUndone'},
            {name:'改标题',value:'updateTitle'},
            {name:'删除',value:'remove'},
        ]

    }).then((answers2)=>{
        const action = actions[answers2.action]
        action && action(list,index)
    })

}
function askForCreateTask(list){
    inquirer.prompt({
        type:'input',
        name:"title",
        message:'新的标题',
    }).then((answers4)=>{
        list.push({
            title:answers4.title,
            done:false
        })
        db.write(list)
    })
}
function printTasks(list){
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'index',
                message: '选择你想操作的任务?',
                choices: [{name:'退出',value:'-1'},...list.map((time,index)=>{
                    return{name:`${time.done ? "[x]":'[]'} ${index + 1}-${time.title}`,value:index.toString()}
                }),{name:'创建任务',value:'-2'}]
            }
        ])
        .then((answers) => {
            const index =parseInt(answers.index)
            //添加一个任务
            if(index>=0){
                askForAction(list,index)
            }else if(index===-2){
                //创建任务
                askForCreateTask(list)
            }
        });
}

module.exports.showAll = async () => {
    //获取任务列表
    const list = await db.read()
    //操作
    printTasks(list)
}