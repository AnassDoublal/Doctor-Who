let dataArray = [];
let dataDetails = [];
let dataSeasons = [];
let filteredEps=[];

let doctors=["Christopher Eccleston", "David Tennant", "Matt Smith", "Peter Capaldi", "Jodie Whittaker"];

let C = {};

C.init = function(){
    V.init();
}

let ep=1;

C.handler_content=function()
{
    V.btn_saisons.innerHTML = V.btn_saisons.innerHTML.replace("{{saison}}", "1");

    let nbEps = 0;

    let xhr = new XMLHttpRequest();
    xhr.open('get', 'https://www.omdbapi.com/?apikey=d407d0fb&t=Doctor%20Who&Season=1', false);

    let handler_Response = function(){
        let data = JSON.parse(xhr.responseText);
        nbEps = data.Episodes.length;
    }
    
    xhr.addEventListener('load', handler_Response);
    xhr.send();
    
    for(i=1; i<nbEps+1 ; i++)
    {
        let xhr=new XMLHttpRequest();
        xhr.open('get', 'https://www.omdbapi.com/?apikey=d407d0fb&t=Doctor%20Who&Season=1&Episode='+i, false);
    
        let handler_Response=function(){
            let data=JSON.parse(xhr.responseText);
            dataArray.push(data);
            V.renderAllInfo(dataArray);
        }
        
        xhr.addEventListener('load', handler_Response);
        xhr.send();
    }
        
}

C.handler_details=function(ev)
{   
    dataDetails=[];

    let id=ev.target.parentElement.dataset.id;

    if(id!=undefined)
    {
        let xhr = new XMLHttpRequest();
        xhr.open('get', 'https://www.omdbapi.com/?apikey=d407d0fb&i='+id+'&plot=full', false);
    
        let handler_Response = function(){
            let data = JSON.parse(xhr.responseText);
            dataDetails.push(data);
            V.renderDetails(dataDetails);
        }
        
        xhr.addEventListener('load', handler_Response);
        xhr.send();

        document.body.classList.add("prevent_click");

        document.querySelector("#dark_overlay").classList.add("overlay");
    }


}

C.handler_popup = function(ev){
    if(ev.target.id == "croix_details" || ev.target.id == "dark_overlay")
    {
        let div_popup = document.querySelectorAll(".div_details");
    
        for(i=0; i<div_popup.length; i++)
        {
            div_popup[i].remove();
        }
    
        document.body.classList.remove("prevent_click");
        document.querySelector("#dark_overlay").classList.remove("overlay");
    }
}

C.handler_seasons = function(){

    nbSaisons = 0;

    let xhr = new XMLHttpRequest();
    xhr.open('get', 'https://www.omdbapi.com/?apikey=d407d0fb&t=Doctor%20Who', false);

    let handler_Response = function(){
        let data = JSON.parse(xhr.responseText);
        nbSaisons = parseInt(data.totalSeasons, 10);
    }
    
    xhr.addEventListener('load', handler_Response);
    xhr.send();

    for(i=1; i<nbSaisons+1; i++)
    {
        let xhr = new XMLHttpRequest();
        xhr.open('get', 'https://www.omdbapi.com/?apikey=d407d0fb&t=Doctor%20Who&Season='+i, false);
    
        let handler_Response = function(){
            let data = JSON.parse(xhr.responseText);
            dataSeasons.push(data);
            V.renderSeasons(dataSeasons);
        }
        
        xhr.addEventListener('load', handler_Response);
        xhr.send();
    }
}

C.handler_dropDown = function(){

    let fleche_saisons = document.querySelector(".btn_saisons img");

    if(V.contenu_saisons.style.display == "none")
    {
        V.contenu_saisons.style.display = "block";
        fleche_saisons.style.transform = "scaleY(-1)";
    }
    else
    {
        V.contenu_saisons.style.display = "none";
        fleche_saisons.style.transform = "scaleY(1)"; 
    }
}

C.handler_dropDownSort = function(){

    let fleche_sort = document.querySelector(".btn_sort img");

    if(V.contenu_sort.style.display == "none")
    {
        V.contenu_sort.style.display = "block";
        V.fleche_sort.style.transform = "scaleY(-1)";
    }
    else
    {
        V.contenu_sort.style.display = "none";
        V.fleche_sort.style.transform = "scaleY(1)";
    }
}

C.handler_showSeason = function(ev){
    dataArray = [];
    
    nbEps = 0;

    let season = parseInt(ev.target.textContent.split(" ")[1], 10);
    let currentSeason = V.btn_saisons.textContent.split(" ")[1];

    let before = new Date();

    let xhr = new XMLHttpRequest();
    xhr.open('get', 'https://www.omdbapi.com/?apikey=d407d0fb&t=Doctor%20Who&Season='+season, false);

    let handler_Response = function(){
        let data = JSON.parse(xhr.responseText);
        nbEps = data.Episodes.length;
    }

    let fleche_saisons = document.querySelector(".btn_saisons img");

    V.contenu_saisons.style.display = "none";
    fleche_saisons.style.transform = "scaleY(1)";

    V.btn_saisons.innerHTML = V.btn_saisons.innerHTML.replace(currentSeason, season);

    xhr.addEventListener('load', handler_Response);
    xhr.send();
    
    for(i=1; i<nbEps+1 ; i++)
    {
        let xhr=new XMLHttpRequest();
        xhr.open('get', 'https://www.omdbapi.com/?apikey=d407d0fb&t=Doctor%20Who&Season='+season+'&Episode='+i, false);
    
        let handler_Response=function(){
            let data=JSON.parse(xhr.responseText);
            dataArray.push(data);
            V.renderAllInfo(dataArray);
        }
        
        xhr.addEventListener('load', handler_Response);
        xhr.send();
    }

    let now = new Date();
    let diff = now - before;

    setTimeout(function(){
        V.div_porte.style.zIndex = "-1";
    }, diff);
    V.porte_gauche.classList.remove("move_right");
    V.porte_droite.classList.remove("move_left");
    V.ouvrir_porte.play();
}

C.handler_animateDoor = function(ev){
    V.div_porte.style.zIndex = "3";
    V.porte_gauche.classList.add("move_right");
    V.porte_droite.classList.add("move_left");
    setTimeout(function(){
        V.fermer_porte.play();
        C.handler_showSeason(ev);
    }, 300);
}

C.handler_sort = function(ev){

    let fleche_sort = document.querySelector(".btn_sort img");

    V.contenu_sort.style.display = "none";
    fleche_sort.style.transform = "scaleY(1)";

    if(ev.target.textContent == "Default")
    {
        dataArray.sort(function(a, b){
            return a.Episode - b.Episode;
        });

        V.renderAllInfo(dataArray);
    }
    else
    {
        dataArray.sort(function(a, b){
            if(a.imdbRating > b.imdbRating)
                return -1;
            else
                return 1;
            
            return 0;
        });
    
        V.renderAllInfo(dataArray);
    }
}

C.handler_scroll = function(ev){
    if(ev.target.className == "nav_item1")
        V.pres.scrollIntoView();
    else if(ev.target.className == "nav_item2")
        V.eps.scrollIntoView();
}

C.handler_filter=function(){
    filteredEps = [];

    let rate_value = document.querySelector("input").value;

    for (let i=0; i<dataSeasons.length; i++) 
    {
        for(let j=0; j<dataSeasons.length; j++)
        {
            filteredEps.push(dataSeasons[i].Episodes[j]);

            if(dataSeasons[i].Episodes[j] != undefined)
                (dataSeasons[i].Episodes[j])["Season"] = dataSeasons[i].Season;
        }
    }

    if(rate_value >= 0  && rate_value < 10)
    {
        filteredEps = filteredEps.filter(function(obj)
        {
            if(obj != undefined)
                return obj.imdbRating >= rate_value;
        });
    }
    else if(rate_value == 10)
    {
        filteredEps = filteredEps.filter(function(obj)
        {
            if(obj != undefined)
                return obj.imdbRating == "N/A";
        });
    }
    else
        filteredEps = [];

    V.renderAllRate(filteredEps);
}
  
let V = {
    template_ep: document.querySelector(".template_ep"),
    template_rate: document.querySelector(".template_rate"),
    sec_eps: document.querySelector(".section_eps"),
    template_details: document.querySelector(".template_details"),
    div_details: document.querySelector("#details"),
    div_popup: document.querySelector(".div_details"),
    btn_saisons: document.querySelector(".btn_saisons"),
    btn_sort: document.querySelector(".btn_sort"),
    contenu_saisons: document.querySelector(".contenu_saisons"),
    contenu_sort: document.querySelector(".contenu_sort"),
    fleche_saisons: document.querySelector(".btn_saisons img"),
    fleche_sort: document.querySelector(".btn_sort img"),
    template_saisons: document.querySelector(".template_saisons"),
    nav_list: document.querySelector(".nav_list"),
    pres: document.querySelector("#pres"),
    eps: document.querySelector("#main"),
    input_submit: document.querySelector(".input_submit"),
    div_porte: document.querySelector(".div_porte"),
    porte_gauche: document.querySelector(".porte_gauche"),
    porte_droite: document.querySelector(".porte_droite"),
    ouvrir_porte: new Audio("son/ouvrir_porte.m4a"),
    fermer_porte: new Audio("son/fermer_porte.m4a"),
};

V.init = function(){
    C.handler_content();
    C.handler_seasons();

    this.sec_eps.addEventListener("click", C.handler_details);
    window.addEventListener("click", C.handler_popup);
    V.btn_saisons.addEventListener("click", C.handler_dropDown);
    V.btn_sort.addEventListener("click", C.handler_dropDownSort);
    V.contenu_saisons.addEventListener("click", C.handler_animateDoor);
    V.contenu_sort.addEventListener("click", C.handler_sort);
    V.nav_list.addEventListener("click", C.handler_scroll);
    V.input_submit.addEventListener("click", C.handler_filter);
}

V.formatInfo = function(info){
    let html = this.template_ep.innerHTML;
    html = html.replace('{{id}}', info.imdbID);
    html = html.replace('{{numero}}', info.Episode);
    html = html.replace('{{image}}', info.Poster);
    html = html.replace('{{titre}}', info.Title);
    html = html.replace('{{date}}', info.Released);
    html = html.replace('{{note}}', info.imdbRating);
    html = html.replace('{{duree}}', info.Runtime);
    return html;
}

V.renderAllInfo = function(data){
    let allEps = "";
  
    for(i=0; i<data.length; i++)
    {
        allEps += this.formatInfo(data[i]);
    }

    this.sec_eps.innerHTML = allEps;
}

V.formatRate = function(info){
    let html = this.template_rate.innerHTML;
    html = html.replace('{{id}}', info.imdbID);
    html = html.replace('{{saison}}', info.Season);
    html = html.replace('{{numero}}', info.Episode);
    html = html.replace('{{titre}}', info.Title);
    html = html.replace('{{date}}', info.Released);
    html = html.replace('{{note}}', info.imdbRating);
    return html;
}

V.renderAllRate = function(data){
    let allEps = "";
  
    for(i=0; i<data.length; i++)
    {
        if(data[i] != undefined)
        {
            allEps += this.formatRate(data[i]);
        }
    }

    this.sec_eps.innerHTML = allEps;
}

V.formatDetails = function(details){
    let html = this.template_details.innerHTML;
    html = html.replace('{{saison}}', details.Season);
    html = html.replace('{{numero}}', details.Episode);
    html = html.replace('{{titre}}', details.Title);
    html = html.replace('{{image}}', details.Poster);
    html = html.replace('{{langue}}', details.Language);
    html = html.replace('{{pays}}', details.Country);
    html = html.replace('{{date}}', details.Released);
    html = html.replace('{{note}}', details.imdbRating);
    html = html.replace('{{genre}}', details.Genre);
    html = html.replace('{{duree}}', details.Runtime);
    html = html.replace('{{description}}', details.Plot);
    html = html.replace('{{realisateur}}', details.Director);
    html = html.replace('{{scenaristes}}', details.Writer);
    html = html.replace('{{acteurs}}', details.Actors);
    return html;
}

V.renderDetails = function(data)
{
    let allDetails = "";
    for(i=0; i<data.length; i++) allDetails += this.formatDetails(data[i]);  
    this.div_details.innerHTML = allDetails;
}

V.formatSeasons = function(details)
{
    let html = this.template_saisons.innerHTML;
    html = html.replace('{{saison}}', details.Season);
    return html;
}

V.renderSeasons = function(data)
{
    let allSeasons = "";
    for(i=0; i<data.length; i++) allSeasons += this.formatSeasons(data[i]);
    this.contenu_saisons.innerHTML = allSeasons;
}

C.init();