const fs = require("fs/promises");
const express = require("express");
const path = require("path");
// const { response } = require("express");


const app = express();

//*UTILIZAMOS UN MIDDLEWARE INCORPORADO
app.use(express.json());


const pathJSON = path.resolve("./files/toDo.json");
// console.log(pathJSON);


//todo---->obtener los toDos
app.get("/tasks", async (req, res)=>{
    //leemos el archivo toDO.json
    const toDoList = await fs.readFile(pathJSON, "utf-8");
    // console.log(toDoList);
    res.send(toDoList)
    // res.end();
});


//todo---->crear un toDO
app.post("/tasks", async(req, res)=>{

    const toDo = req.body;

    const toDoList = JSON.parse(await fs.readFile(pathJSON, "utf-8"));
    const lastToDo = toDoList.length -1;
    const newId = toDoList[lastToDo].id +1;

    if(toDo.title){
        
        toDoList.push({ id:newId, ...toDo})
    }
    else{
        res.send("you dont create a toDo without an title");
    }

    await fs.writeFile(pathJSON, JSON.stringify(toDoList));

    res.send(`a new toDO has been added`);
});


//todo---->editar el status de un toDO
app.put("/tasks", async (req, res)=>{
    const {id, status} = req.body;
    const toDoList = JSON.parse(await fs.readFile(pathJSON, "utf-8"));
    
    toDoList.forEach(toDo => {
        if(toDo.id === id ){
            toDo.status = status;
        }
    });

    await fs.writeFile(pathJSON, JSON.stringify(toDoList));
    res.send(`update !!`)

    res.end();
});

//todo ----> borrar el toDO
app.delete("/tasks", async(req, res)=>{
    const toDoList = JSON.parse(await fs.readFile(pathJSON, "utf-8"));
    const{id} = req.body;

    const indexToDO = toDoList.findIndex(todo => todo.id === id);
    if(indexToDO >= 0){

            toDoList.splice(indexToDO, 1)
            await fs.writeFile(pathJSON , JSON.stringify(toDoList));
            res.send(" a toDo has been delete");
    }
    else{
        res.send("you dont delete a toDo without an id");
    }
    res.end();
    
});


const PORT = 8000;

app.listen(PORT, () => {
    console.log(`server listen in the ${PORT} PORT `);
});