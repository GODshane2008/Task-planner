let tasks = JSON.parse(
    localStorage.getItem("tasks")
) || [];

let xp = Number(
    localStorage.getItem("xp")
) || 0;

let chart;

render();

function addTask(){

    const input =
        document.getElementById("taskInput");

    const text =
        input.value.trim();

    if(text === "") return;

    tasks.push({
        text:text,
        completed:false
    });

    input.value = "";

    saveData();
}

function toggleTask(index){

    if(!tasks[index].completed){

        xp += 10;

        recordProgress();
    }

    tasks[index].completed =
        !tasks[index].completed;

    saveData();
}

function renameTask(index){

    const newName = prompt(
        "Rename task",
        tasks[index].text
    );

    if(newName &&
       newName.trim() !== ""){

        tasks[index].text =
            newName.trim();

        saveData();
    }
}

function deleteTask(index){

    if(confirm(
        "Delete this task?"
    )){
        tasks.splice(index,1);

        saveData();
    }
}

function saveData(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "xp",
        xp
    );

    render();
}

function render(){

    const taskList =
        document.getElementById(
            "taskList"
        );

    taskList.innerHTML = "";

    tasks.forEach(
        (task,index)=>{

        const li =
            document.createElement(
                "li"
            );

        li.className =
            task.completed
            ? "task completed"
            : "task";

        li.innerHTML = `
        <span>${task.text}</span>

        <div class="task-buttons">

            <button
            class="complete-btn"
            onclick="toggleTask(${index})">
            ✓
            </button>

            <button
            class="edit-btn"
            onclick="renameTask(${index})">
            ✏️
            </button>

            <button
            class="delete-btn"
            onclick="deleteTask(${index})">
            🗑️
            </button>

        </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();

    updateBadges();

    drawChart();
}

function updateStats(){

    document.getElementById(
        "xp"
    ).textContent = xp;

    document.getElementById(
        "level"
    ).textContent =
        Math.floor(xp / 100) + 1;

    document.getElementById(
        "streak"
    ).textContent =
        calculateStreak();
}

function recordProgress(){

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    const progress =
        JSON.parse(
            localStorage.getItem(
                "progress"
            )
        ) || {};

    progress[today] =
        (progress[today] || 0) + 1;

    localStorage.setItem(
        "progress",
        JSON.stringify(progress)
    );
}

function calculateStreak(){

    const progress =
        JSON.parse(
            localStorage.getItem(
                "progress"
            )
        ) || {};

    const dates =
        Object.keys(progress)
        .sort()
        .reverse();

    if(dates.length === 0)
        return 0;

    let streak = 1;

    let current =
        new Date(dates[0]);

    for(
        let i=1;
        i<dates.length;
        i++
    ){

        const previous =
            new Date(dates[i]);

        const diff =
            (current - previous)
            / 86400000;

        if(diff === 1){

            streak++;

            current = previous;
        }
        else{
            break;
        }
    }

    return streak;
}

function updateBadges(){

    const badgesDiv =
        document.getElementById(
            "badges"
        );

    let badges = [];

    if(xp >= 100)
        badges.push(
            "💯 100 XP"
        );

    if(xp >= 500)
        badges.push(
            "🏆 500 XP"
        );

    if(xp >= 1000)
        badges.push(
            "👑 1000 XP"
        );

    if(calculateStreak() >= 7)
        badges.push(
            "🔥 7 Day Streak"
        );

    if(calculateStreak() >= 30)
        badges.push(
            "🚀 30 Day Streak"
        );

    if(badges.length === 0){

        badgesDiv.innerHTML =
            "<p>No badges yet.</p>";

        return;
    }

    badgesDiv.innerHTML =
        badges
        .map(
            badge =>
            `<span class="badge">
                ${badge}
            </span>`
        )
        .join("");
}

function drawChart(){

    const progress =
        JSON.parse(
            localStorage.getItem(
                "progress"
            )
        ) || {};

    const labels =
        Object.keys(progress)
        .slice(-30);

    const values =
        labels.map(
            date =>
            progress[date]
        );

    const ctx =
        document.getElementById(
            "progressChart"
        );

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{
        type:"line",

        data:{
            labels:labels,

            datasets:[
            {
                label:
                "Completed Tasks",

                data:values,

                tension:0.4,

                fill:false
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