const fs = require("fs");
const readline = require("readline");
async function readFileByLine(file) {
  const fileStream = fs.createReadStream(file);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let games = [];

  let players = [];

  for await (const line of rl) {
    if (line.includes("ClientConnect:")) {
      //Verifica o mlk que entrou e adiciona no array de players
      const id = Number(line.split("ClientConnect: ")[1]);
      // console.log(id);
      const playerFound = players.find((player) => player.id === id);
      // console.log({ playerFound });
      if (!playerFound) {
        players.push({
          id: id,
          nome: "",
          kills: 0,
          old_names: [],
          deaths: 0,
        });
      }
    }

    if (line.includes("ClientUserinfoChanged:")) {
      //Verifica o novo nome que o mlk escolheu
      const idFound = Number(
        line.split("ClientUserinfoChanged: ")[1].split(" n")[0]
      );
      const name = line.split(" n")[1].split("t")[0].replace(/\\/g, "");
      players = players.map((player) => {
        if (player.id === idFound) {
          if (player.nome && player.nome !== name) {
            return {
              ...player,
              nome: name,
              old_names: [player.nome, ...player.old_names],
            };
          } else {
            return {
              ...player,
              nome: name,
            };
          }
        } else return player;
      });
    }

    // 20:54 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT
    // 22:06 Kill: 2 3 7: Isgalamido killed Mocinha by MOD_ROCKET_SPLASH
    if (line.includes("killed")) {
      const kill_ids = line.split("Kill: ")[1].split(":")[0];
      const killer_id = Number(kill_ids.split(" ")[0]);
      const killed_id = Number(kill_ids.split(" ")[1]);
      const weapon = Number(kill_ids.split(" ")[2]); 


      if (killer_id === 1022) {
        players = players.map((player) => {
          if (player.id === killed_id) {
            return {
              ...player,
              kills: player.kills - 1,
              deaths: player.deaths + 1
            };
          } else {
            return player;
          }
        });
      } else {
        if (killer_id !== killed_id) {
          //verificando se se matou ou matou outro mlk
          players = players.map((player) => {
            if (player.id === killer_id) {
              return {
                ...player,
                kills: player.kills + 1,
              };
            } else {
              return player;
            }
          });
          players = players.map((player) => {
            if (player.id === killed_id) {
              return {
                ...player,
                deaths: player.deaths + 1
              };
            } else {
              return player;
            }
          });
        }
      }
    }

    if (line.includes("ShutdownGame")) {
      //fim da partida
      console.log(players);
      return;
    }
  }
}

readFileByLine("Quake.txt");
