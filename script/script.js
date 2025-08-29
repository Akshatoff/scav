    const list = document.getElementById('songList');
    let dragged;
    const audio = document.getElementById("audioPlayer");
    const mini = document.getElementById("miniPlayer");
    const miniTitle = document.getElementById("miniTitle");
    const miniArtist = document.getElementById("miniArtist");
    const miniBtn = document.getElementById("miniBtn");
    const ant = document.getElementById("antoniny");

    const buttons = document.querySelectorAll(".btn-play");

    // drag reorder
    list.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('tr')) {
        dragged = e.target;
        e.dataTransfer.effectAllowed = 'move';

      }
    });
    list.addEventListener('dragend', () => { if (dragged) dragged.style.opacity = ''; });
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      const target = e.target.closest('.tr');
      if (target && target !== dragged) {
        const rect = target.getBoundingClientRect();
        const next = (e.clientY - rect.top) / rect.height > 0.5;
        list.insertBefore(dragged, next ? target.nextSibling : target);
      }
    });

    list.addEventListener('drop', (e) => {
  dragged = null;

  let allCorrect = true; // Assume all are correct initially

  [...list.querySelectorAll('.tr')].forEach((row, i) => {
    row.querySelector('.muted').textContent = i + 1;

    // Extract Op. number from the title
    const title = row.querySelector(".title-song").textContent;
    const match = title.match(/Op\.\s*(\d+)/);

    if (match) {
      const opus = parseInt(match[1], 10);

      if (opus === i + 1) {
        row.classList.add("correct");
      } else {
        row.classList.remove("correct");
        allCorrect = false; // Found a wrong position
      }
    } else {
      allCorrect = false; // Missing Op. info means incorrect
    }
  });

  // Apply or remove the "brid" class based on overall correctness
  const lower = document.getElementById("sec");

  if (allCorrect) {
    lower.classList.add("brid");
    ant.classList.add("dfh")
  } else {
    lower.classList.remove("brid");
    ant.classList.remove("dfh")
  }
});

ant.addEventListener("click", () => {
  if (!ant.classList.contains("dfh")) return; // Only allow if brid condition is met

  // Create overlay if it doesn't exist
  let overlay = document.getElementById("imgPopup");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "imgPopup";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.8)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "1000";
    overlay.style.cursor = "zoom-out";

    // Full image
    const fullImg = document.createElement("img");
    fullImg.src = "../image.png";
    console.log(ant.src);

    fullImg.style.maxWidth = "90%";
    fullImg.style.maxHeight = "90%";
    fullImg.style.borderRadius = "8px";
    fullImg.style.boxShadow = "0 0 20px rgba(0,0,0,0.7)";

    overlay.appendChild(fullImg);
    document.body.appendChild(overlay);

    // Close on click
    overlay.addEventListener("click", () => {
      overlay.remove();
    });
  }
});




    // play/pause logic
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest(".tr");
        const src = row.getAttribute("data-src");
        const title = row.querySelector(".title-song").textContent;
        const artist = row.querySelector(".sub").textContent;

        if (audio.src.includes(src) && !audio.paused) {
          audio.pause();
          btn.textContent = "▶";
          miniBtn.textContent = "▶";
        } else {
          audio.src = src;
          audio.play();
          buttons.forEach(b => b.textContent = "▶");
          btn.textContent = "⏸";
          miniBtn.textContent = "⏸";
          mini.style.display = "flex";
          miniTitle.textContent = title;
          miniArtist.textContent = artist;
        }
      });
    });

    // mini-player controls
    miniBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        miniBtn.textContent = "⏸";
      } else {
        audio.pause();
        miniBtn.textContent = "▶";
      }
    });
