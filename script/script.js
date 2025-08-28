    const list = document.getElementById('songList');
    let dragged;
    const audio = document.getElementById("audioPlayer");
    const mini = document.getElementById("miniPlayer");
    const miniTitle = document.getElementById("miniTitle");
    const miniArtist = document.getElementById("miniArtist");
    const miniBtn = document.getElementById("miniBtn");

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
          }
        }
      });
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
