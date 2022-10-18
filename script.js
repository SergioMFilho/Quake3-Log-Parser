const fs = require("fs");
const readline = require("readline");
async function readFileByLine(file) {
  const fileStream = fs.createReadStream(file);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentGame = 0;
  let games = [];

  for await (const line of rl) {
    if (line.includes("InitGame:")) {
      currentGame++;
      games.push({
        game: currentGame,
        status: {
          total_kills: 0,
          players: [],
        },
      });
    }
    if (line.includes("ClientConnect:")) {
      //Verifica que o jogador entrou e adiciona no array de players
      const id = Number(line.split("ClientConnect: ")[1]);
      // console.log(id);
      const playerFound = games[currentGame - 1].status.players.find(
        (player) => player.id === id
      );
      // console.log({ playerFound });
      if (!playerFound) {
        games[currentGame - 1].status.players.push({
          id: id,
          nome: "",
          kills: 0,
          old_names: [],
          deaths: 0,
        });
      }
    }

    if (line.includes("ClientUserinfoChanged:")) {
      //Verifica o novo nome que o jogador escolheu
      const idFound = Number(
        line.split("ClientUserinfoChanged: ")[1].split(" n")[0]
      );
      const name = line.split(" n")[1].split("t")[0].replace(/\\/g, "");
      const newInfo = games[currentGame - 1].status.players.map((player) => {
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
      games[currentGame - 1].status.players = newInfo;
    }

    if (line.includes("killed")) {
      const kill_ids = line.split("Kill: ")[1].split(":")[0];
      const killer_id = Number(kill_ids.split(" ")[0]);
      const killed_id = Number(kill_ids.split(" ")[1]);

      games[currentGame - 1].status.total_kills = ++games[currentGame - 1]
        .status.total_kills;

      if (killer_id === 1022) {
        const newInfo2 = games[currentGame - 1].status.players.map((player) => {
          if (player.id === killed_id) {
            return {
              ...player,
              kills: player.kills - 1,
              deaths: player.deaths + 1,
            };
          } else {
            return player;
          }
        });
        games[currentGame - 1].status.players = newInfo2;
      } else {
        if (killer_id !== killed_id) {
          //verificando se o player se matou ou matou outro player
          const newInfo3 = games[currentGame - 1].status.players.map(
            (player) => {
              if (player.id === killer_id) {
                return {
                  ...player,
                  kills: player.kills + 1,
                };
              } else {
                return player;
              }
            }
          );
          games[currentGame - 1].status.players = newInfo3;
          const newInfo4 = games[currentGame - 1].status.players.map(
            (player) => {
              if (player.id === killed_id) {
                return {
                  ...player,
                  deaths: player.deaths + 1,
                };
              } else {
                return player;
              }
            }
          );
          games[currentGame - 1].status.players = newInfo4;
        }
      }
    }
  }
  return games;
}
// readFileByLine("Quake.txt").then((res) => console.log(res));
// Testando o resultado final
