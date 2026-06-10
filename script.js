// =====================
// STORAGE
// =====================

let tasks =
JSON.parse(
localStorage.getItem("tasks")
) || [];

let xp =
parseInt(
localStorage.getItem("xp")
) || 0;

let progress =
JSON.parse(
localStorage.getItem("progress")
) || {};

// =====================
// ELEMENTS
// =====================

const taskInput =
document.getElementById(
"taskInput"
);

const addTaskBtn =
document.getElementById(
"addTaskBtn"
);

const taskList =
document.getElementById(
"taskList"
);

const xpValue =
document.getElementById(
"xpValue"
);

const streakValue =
document.getElementById(
"streakValue"
);

const levelValue =
document.getElementById(
"levelValue"
);

const badgeContainer =
document.getElementById(
"badgeContainer"
);

// =====================
// SAVE
// =====================

function saveData(){

localStorage.setItem(
"tasks",
JSON.stringify(tasks)
);

localStorage.setItem(
"xp",
xp
);

localStorage.setItem(
"progress",
JSON.stringify(progress)
);

}

// =====================
// ADD TASK
// =====================

function addTask(){

const text =
taskInput.value.trim();

if(text === "")
return;

tasks.push({

id:Date.now(),

text:text,

completed:false

});

taskInput.value="";

saveData();

renderTasks();

}

// =====================
// COMPLETE TASK
// =====================

function completeTask(id){

const task =
tasks.find(
t => t.id === id
);

if(!task)
return;

if(task.completed)
return;

task.completed = true;

xp += 10;

recordProgress();

saveData();

updateStats();

renderTasks();

}

// =====================
// DELETE TASK
// =====================

function deleteTask(id){

tasks =
tasks.filter(
t => t.id !== id
);

saveData();

renderTasks();

}

// =====================
// EDIT TASK
// =====================

function editTask(id){

const task =
tasks.find(
t => t.id === id
);

const newText =
prompt(
"Edit Task",
task.text
);

if(
newText &&
newText.trim() !== ""
){

task.text =
newText.trim();

saveData();

renderTasks();

}

}

// =====================
// RENDER TASKS
// =====================

function renderTasks(){

taskList.innerHTML="";

tasks.forEach(task=>{

const li =
document.createElement(
"li"
);

li.className =
"task-item";

li.innerHTML = `

<span class="${
task.completed
? "completed"
: ""
}">
${task.text}
</span>

<div class="task-actions">

<button
class="complete-btn"
onclick="completeTask(${task.id})">

✓

</button>

<button
class="edit-btn"
onclick="editTask(${task.id})">

✏️

</button>

<button
class="delete-btn"
onclick="deleteTask(${task.id})">

🗑️

</button>

</div>

`;

taskList.appendChild(li);

});

}

// =====================
// STREAK
// =====================

function calculateStreak(){

const dates =
Object.keys(progress)
.sort()
.reverse();

if(dates.length===0)
return 0;

let streak = 1;

let current =
new Date(dates[0]);

for(
let i=1;
i<dates.length;
i++
){

let previous =
new Date(dates[i]);

let diff =
(current-previous)
/ 86400000;

if(diff===1){

streak++;

current=
previous;

}else{

break;

}

}

return streak;

}

// =====================
// DAILY TRACKING
// =====================

function recordProgress(){

const today =
new Date()
.toISOString()
.split("T")[0];

progress[today] =
(progress[today]||0)+1;

}

// =====================
// LEVEL
// =====================

function calculateLevel(){

return Math.floor(
xp / 100
)+1;

}

// =====================
// STATS
// =====================

function updateStats(){

xpValue.textContent =
xp;

levelValue.textContent =
calculateLevel();

streakValue.textContent =
calculateStreak()
+ " Days";

updateBadges();

}
// =====================
// ACHIEVEMENTS
// =====================

function updateBadges(){

let badges = [];

if(xp >= 10)
badges.push("🏆 First Win");

if(xp >= 100)
badges.push("💯 100 XP");

if(xp >= 500)
badges.push("🚀 500 XP");

if(xp >= 1000)
badges.push("👑 1000 XP");

if(calculateStreak() >= 7)
badges.push("🔥 7 Day Streak");

if(calculateStreak() >= 30)
badges.push("⚡ 30 Day Streak");

badgeContainer.innerHTML = "";

badges.forEach(badge=>{

const div =
document.createElement("div");

div.className =
"badge";

div.textContent =
badge;

badgeContainer.appendChild(div);

});

}

// =====================
// CHART
// =====================

let progressChart;

function renderChart(){

const ctx =
document.getElementById(
"progressChart"
);

if(!ctx)
return;

const labels =
Object.keys(progress)
.slice(-30);

const values =
labels.map(
day => progress[day]
);

if(progressChart){

progressChart.destroy();

}

progressChart =
new Chart(ctx,{

type:"line",

data:{

labels:labels,

datasets:[{

label:
"Completed Tasks",

data:values,

tension:0.4,

fill:true

}]

},

options:{

responsive:true,

plugins:{

legend:{

labels:{

color:"white"

}

}

},

scales:{

x:{

ticks:{

color:"white"

}

},

y:{

ticks:{

color:"white"

}

}

}

}

});

}

// =====================
// HEATMAP
// =====================

function renderHeatmap(){

const heatmap =
document.getElementById(
"heatmap"
);

if(!heatmap)
return;

heatmap.innerHTML = "";

for(
let i=0;
i<35;
i++
){

const cell =
document.createElement(
"div"
);

cell.classList.add(
"heat-cell"
);

const value =
Math.floor(
Math.random()*4
);

if(value===1){

cell.classList.add(
"heat-low"
);

}

if(value===2){

cell.classList.add(
"heat-medium"
);

}

if(value===3){

cell.classList.add(
"heat-high"
);

}

heatmap.appendChild(
cell
);

}

}

// =====================
// XP RING
// =====================

function updateXpRing(){

const ring =
document.querySelector(
".xp-ring"
);

if(!ring)
return;

const progressPercent =
xp % 100;

ring.style.background =

`conic-gradient(
#3b82f6
${progressPercent}%,
rgba(255,255,255,.08)
0
)`;

}

// =====================
// NOTIFICATIONS
// =====================

function requestNotifications(){

if(
"Notification"
in window
){

Notification
.requestPermission();

}

}

// =====================
// INIT
// =====================

function initializeDashboard(){

renderTasks();

updateStats();

renderChart();

renderHeatmap();

updateXpRing();

requestNotifications();

}

// =====================
// EVENTS
// =====================

addTaskBtn.addEventListener(

"click",

addTask

);

taskInput.addEventListener(

"keypress",

function(e){

if(
e.key==="Enter"
){

addTask();

}

}

);

// =====================
// OVERRIDE UPDATE STATS
// =====================

const oldUpdateStats =
updateStats;

updateStats = function(){

oldUpdateStats();

updateXpRing();

renderChart();

renderHeatmap();

};

// =====================
// START APP
// =====================

initializeDashboard();