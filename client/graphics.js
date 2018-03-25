const bossImageStruct = {
	"dragon": document.querySelector("#dragonBoss")
};

let characterImageStruct = {};

const lerp = (pos1, pos2, ratio) => {
  const component1 = (1 - ratio) * pos1;
  const component2 = ratio * pos2;
  return component1 + component2;
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw code
  const playerKeys = Object.keys(players);
  frameCounter++;

  for (let i = 0; i < playerKeys.length; i++) {
    const player = players[playerKeys[i]];

    if (player.ratio < 1) {
      player.ratio += 0.05;
    }

    ctx.save();

    player.x = lerp(player.prevX, player.destX, player.ratio);
    player.y = lerp(player.prevY, player.destY, player.ratio);

    if (frameCounter % player.anim.speed === 0) {
      if (player.anim.loop === true) {
        player.frame = (player.frame + 1) % player.anim.frameCount;
      } else if (player.frame < player.anim.frameCount - 1) {
        player.frame++;
      } else if (player.attacking) {
        player.attacking = false;
        switchAnimation(player, "meditate");
      }
    }

    if (characterImageStruct[player.name]) {
      if (player.attacking) {
        ctx.drawImage(
          characterImageStruct[player.name],
          player.attWidth * player.frame,
          (player.anim.row * player.height) + (player.direction * player.attHeight),
          player.attWidth,
          player.attHeight,
          player.x - (player.attWidth / 2),
          player.y - (player.attHeight / 2),
          player.attWidth,
          player.attHeight,
        );
      } else {
        ctx.drawImage(
          characterImageStruct[player.name],
          player.width * player.frame,
          player.height * (player.anim.row + player.direction),
          player.width,
          player.height,
          player.x - (player.width / 2),
          player.y - (player.height / 2),
          player.width,
          player.height
        );
      }
    }

    ctx.restore();
  }
  
  //Draw boss
  if(boss){
    
    boss.x = lerp(boss.prevX, boss.destX, boss.ratio);
    boss.y = lerp(boss.prevY, boss.destY, boss.ratio);
    
    if(frameCounter % boss.anim.speed === 0){
      if(boss.anim.loop === true){
        boss.frame = (boss.frame + 1) % boss.anim.frameCount;
      } else if (boss.frame < boss.anim.frameCount - 2){
        boss.frame++;
      }
    }
    
    ctx.drawImage(
      bossImageStruct[boss.sprite],
      boss.width * boss.frame,
      boss.height * (boss.anim.row + boss.direction),
      boss.width,
      boss.height,
      boss.x - (boss.width / 2),
      boss.y - (boss.height / 2),
      boss.width,
      boss.height
    );
    
    drawHealthBar(boss.x, boss.y, boss.currentHealth, boss.maxHealth);
  }
  
};

const switchAnimation = (player, animation) => {
  if (player.anim.row != player.ANIMS[animation].row) {
    player.frame = 0;
    player.anim = player.ANIMS[animation];
  }
};

const drawHealthBar = (x, y, health, maxHealth) => {
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.drawImage(
    healthContainer,
    x - healthContainer.width / 2,
    y + healthContainer.height,
  );
  ctx.drawImage(
    healthBar,
    0,
    0,
    healthBar.width * (health / maxHealth),
    healthBar.height,
    x - (healthBar.width / 2),
    y + healthContainer.height + 8,
    healthBar.width * (health / maxHealth),
    healthBar.height
  );
  ctx.restore();
};
