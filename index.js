const eventTable = document.getElementById("eventTable");
const correlationTable=document.getElementById("correlationTable");

const url="https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

async function getInfo()
{
    try 
    {
        let info= await fetch(url);
        info = await info.json();
        return info;    
    }
    catch (error) 
    {
        throw error;
    }
}

async function loadEvents(data)
{
    try 
    {
        let count=1;
        data.forEach((e)=> {
            let row = document.createElement("tr");
            //ID
            let id =document.createElement("td");
            let idContent=document.createTextNode(count);
            id.appendChild(idContent);
            row.appendChild(id);
            //events
            let events =document.createElement("td");
            let eventsContent=document.createTextNode(e.events.join(","));
            events.appendChild(eventsContent);
            row.appendChild(events);
            //was he a squirrell
            let squirrel =document.createElement("td");
            let squirrelContent=document.createTextNode(e.squirrel);
            squirrel.appendChild(squirrelContent);
            row.appendChild(squirrel);
            if(e.squirrel)
            {
                row.style.backgroundColor="#FC4B51";
            }
            eventTable.appendChild(row);
            count++;
        });    
        return data;
    } 
    catch (error) 
    {
        throw error;    
    }
}

async function getMatrix(data)
{
    try 
    {
        let basicMatrix={};
        data.forEach((day)=>{
            day.events.forEach((e)=>{
                if(basicMatrix[e]==null)
                {
                    basicMatrix[e]={TP:0,TN:0,FP:0,FN:0};
                }
            });
        });
        return{matrix:basicMatrix,data:data};
    }  
    catch (error) 
    {
        throw error;    
    }
}

async function calculateMatrixValues(matrix,data)
{
    try 
    {
        let events = [];
        for(e in matrix)
        {
            events.push(e);
        }
        data.forEach((day)=>{
            let notToday=events.filter((e)=>day.events.indexOf(e)==-1);
            let today =day.events;
            if(Boolean(day.squirrel))
            {
                today.forEach((e)=>{
                    matrix[e].TP+=1;
                });
                notToday.forEach((e)=>{
                    matrix[e].FP+=1;
                });
            }
            else
            {
                today.forEach((e)=>{
                    matrix[e].FN+=1;
                });
                notToday.forEach((e)=>{
                    matrix[e].TN+=1;
                });
            }
        });
        return matrix;
    }
    catch (error) 
    {
        throw error;    
    }
}

async function MCC(matrix)
{
    try 
    {
        let eventCorr=[];
        let events=[];
        for(x in matrix)
        {
            events.push(x);
        }
        events.forEach((e)=>{
            let numerador=(Number(matrix[e].TP)*Number(matrix[e].TN))-(Number(matrix[e].FP)*Number(matrix[e].FN));        
            let denominador=Math.sqrt((matrix[e].TP+matrix[e].FP)*(matrix[e].TP+matrix[e].FN)*(matrix[e].TN+matrix[e].FP)*(matrix[e].TN*matrix[e].FN));
            let corr=numerador/denominador;
            eventCorr.push({event:e,correlation:corr});
        });
        return eventCorr;    
    } 
    catch (error) 
    {
        throw error;    
    }
}

async function sort(data)
{
    try 
    {
        data=data.sort((a,b)=>{return a.correlation-b.correlation;}).reverse();
        return data;
    } 
    catch (error) 
    {
        throw error;    
    }
}

async function loadCorrelations(data)
{
    try 
    {
        let count=1;
        data.forEach((e)=> {
            let row = document.createElement("tr");
            //ID
            let id =document.createElement("td");
            let idContent=document.createTextNode(count);
            id.appendChild(idContent);
            row.appendChild(id);
            //event
            let events =document.createElement("td");
            let eventsContent=document.createTextNode(e.event);
            events.appendChild(eventsContent);
            row.appendChild(events);
            //correlation
            let correlation =document.createElement("td");
            let correlationContent=document.createTextNode(e.correlation);
            correlation.appendChild(correlationContent);
            row.appendChild(correlation);

            correlationTable.appendChild(row);
            count++;
        });    
    } 
    catch (error) 
    {
        throw error;    
    }
}

getInfo().then((info)=>loadEvents(info)).then((data)=>getMatrix(data)).then((info)=>calculateMatrixValues(info["matrix"],info["data"])).then((data)=>MCC(data)).then((data)=>sort(data)).then((data)=>loadCorrelations(data)).catch((error)=>{throw error;});