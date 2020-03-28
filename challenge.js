const input = document.getElementById("inputUsr");
const btn = document.getElementById("btnUsr");
const display = document.getElementById("display");
const btnClear = document.getElementById("btnClear");

btnClear.addEventListener("click",() =>{ 
    display.innerHTML = '';
});

btn.addEventListener("click", () => {
    var txt = String(input.value).trim();
    txt = txt.toLowerCase();
    //Gambiarra que eu inventei em apenas 3 minutos
    var txtArr = [] = txt.split(" ");
    txt2 = String(txtArr);
    var txtArr2 = [] = txt2.split(",");   
    txtArr2 = txtArr2.filter( (item) => {return item!="";})
    
    if(txtArr2[0] != "" && txtArr2[0]!=','){

        for(let i = 0; i<txtArr2.length ; i++){
            var promise = get("https://api.github.com/users/"+txtArr2[i].trim());
            
            if(promise != null){
                promise.then( (response)=>{
                    insertTable(response);
                }).catch((error) => {
                    console.log(error);
                    
                    alert('Something went fucking wrong, MORON\n'+error);
                });
            }
        }
        
    }
    else{
        alert('Insert a valid String of characters. \n Don\'t fuck with me');        
    }
    

});


function get (url){
    return new Promise((resolve, reject) => {
        var xhtpp = new XMLHttpRequest();
        xhtpp.open("GET", url, true);

        xhtpp.onload = () =>{
            if(xhtpp.status === 200){
                resolve(JSON.parse(xhtpp.response));
                
            }
            else{
                reject(xhtpp.statusText);
            }
        }
        xhtpp.onerror = ()=>{
            reject(xhtpp.statusText);
        }
        xhtpp.send();
    });
}


function insertTable(objectUsr){
    
    
    let img = document.createElement('img');
    let td = [];
    
    for (let i = 0; i<=3; i++){
        td[i] = document.createElement('td');
    }

    //Alocando as table datas (cellistRepas)
    display.appendChild(td[0]); //Img
    display.appendChild(td[1]); //Rep
    display.appendChild(td[2]); //Bio

    //Image
    td[0].innerHTML = "<div style='font-family:Helvetica,Arial, sans-serif;'>"+objectUsr.login+"</div>"; //objectUsr.login
    td[0].style = "display:table-cell";

    img.classList.add('img-thumbnail');
    img.src = objectUsr.avatar_url; //objectUsr.avatar_url
    img.title = objectUsr.name; // objectUsr.name
    img.alt = "Responsive image";

    img.addEventListener('click', () =>  {window.open(objectUsr.html_url)});
    td[0].appendChild(img);

    //Repositories
    
    let repositories = get("https://api.github.com/users/"+objectUsr.login+"/repos"); //objectUsr.login  
    if(repositories != null){
        repositories.then( (responseRep) => {
            showRepositories(responseRep, td[1]);
        }).catch((error) => {alert("Something went wrong with the repositories\n"+error)});
    }
    
    //Bio
    td[2].style = "font-family: Helvetica; text-align: center;text-color = white";
    td[2].innerHTML = objectUsr.bio;


    let nextRow = document.createElement("tr");
    display.appendChild(nextRow);
    
}


function showRepositories(objectRep, tdRep){  
    let listRep = document.createElement("ul"); 
    listRep.classList.add("list-group");
    listRep.style = 'display:inline';
    

    tdRep.appendChild(listRep); //Insert list on table cell

    objectRep.forEach((repository, index, allReps) => { //Insert items on list
        
        //Value of item on list
        let listRepValue = document.createElement('a');
        listRepValue.href = repository.html_url;
        listRepValue.innerHTML = repository.name;
        
        //The item on list itself
        let listRepItem = document.createElement("li");
        listRepItem.classList = ("list-group-item"); //Funcionando 
        listRepItem.style = "display:inline-block;margin:10px";
        listRepItem.appendChild(listRepValue);

        listRep.appendChild(listRepItem);
        
    });
    return;

}
