const video = document.getElementById("Camera");
const canvas = document.getElementById("photo");
const ctx = canvas.getContext("2d");
const snapBtn = document.getElementById("snapBtn");
const powerBtn = document.getElementById("powerBtn");
const pwrLight = document.getElementById("pwrLight");
const countdownEl = document.getElementById("countdown");

let stream = null;

powerBtn.onclick = async () => {
    if (!stream) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            pwrLight.classList.add("on");
            console.log("Camera System Initialized");
        } catch (err) {
            alert("Please allow camera access.");
        }
    } else {
        stream.getTracks().forEach(t => t.stop());
        video.srcObject = null;
        stream = null;
        pwrLight.classList.remove("on");
    }
};

snapBtn.onclick = async () => {
    if (!stream) {
        alert("System Offline. Please press PWR first.");
        return;
    }
    
    document.getElementById("placeholderText").style.display = "none";
    canvas.style.display = "none"; 

    const imgW = 600; 
    const imgH = 450;
    const margin = 50; 
    const gap = 35;
    canvas.width = imgW + (margin * 2);
    canvas.height = (imgH * 3) + (gap * 2) + (margin * 2) + 150;

    ctx.fillStyle = "beige";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 3; i++) {
        await runTimer(3); 
        
        flashEffect();
        
        const yPos = margin + (imgH + gap) * i;
        ctx.filter = "sepia(0.25) contrast(1.2) brightness(1.1) saturate(1.3) blur(0.3px)";
        ctx.drawImage(video, margin, yPos, imgW, imgH);
    }

    addStamps();
    canvas.style.display = "block"; 
};

function runTimer(seconds) {
    return new Promise(resolve => {
        let count = seconds;
        countdownEl.innerText = count;
        
        let timer = setInterval(() => {
            count--;
            if (count <= 0) {
                clearInterval(timer);
                countdownEl.innerText = ""; 
                resolve();
            } else {
                countdownEl.innerText = count;
            }
        }, 1000);
    });
}

function flashEffect() {
    const f = document.createElement("div");
    f.className = "flash-overlay"; 
    f.style = "position: absolute; top:0; left:0; width:100%; height:100%; background:white; z-index:100;";
    document.getElementById("flashArea").appendChild(f);
    setTimeout(() => f.remove(), 100);
}

function addStamps() {
    const cap = document.getElementById("captionInput").value || "SOFT SNAP";
    const now = new Date();
    const dateStr = `'${now.getFullYear().toString().slice(-2)} ${now.getMonth()+1} ${now.getDate()}`;

    ctx.filter = "none"; 
    ctx.textAlign = "center";
    ctx.fillStyle = "#333"; 
    ctx.font = "bold 32px Courier New";
    ctx.fillText(cap.toUpperCase(), canvas.width/2, canvas.height-90);
    ctx.fillStyle = "#ff8c00"; 
    ctx.font = "24px Courier New";
    ctx.fillText(dateStr, canvas.width/2, canvas.height-40);
}

document.getElementById("saveBtn").onclick = () => {
    const link = document.createElement("a");
    link.download = "softsnap.png";
    link.href = canvas.toDataURL();
    link.click();
};