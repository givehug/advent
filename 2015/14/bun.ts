type Deer = {
  name: string;
  speed: number;
  flyTime: number;
  restTime: number;
};

type DeerController = {
  runTime: () => void;
  result: () => { deer: Deer; distance: number; points: number };
  addPoints: (p: number) => void;
};

const parseLine = (line: string): Deer => {
  const words = line.split(" ");
  return {
    name: words[0],
    speed: Number(words[3]),
    flyTime: Number(words[6]),
    restTime: Number(words[13]),
  };
};

const deerController = (deer: Deer): DeerController => {
  let distance = 0;
  let flyingSec = 0;
  let restingSec = 0;
  let points = 0;

  const processTime = () => {
    if (flyingSec < deer.flyTime) {
      flyingSec++;
      distance += deer.speed;
      if (flyingSec === deer.flyTime) {
        restingSec = 0;
      }
    } else {
      restingSec++;
      if (restingSec === deer.restTime) {
        flyingSec = 0;
      }
    }
  };

  return {
    runTime: () => {
      processTime();
    },
    result: () => {
      return { deer, distance, points };
    },
    addPoints: (p: number) => {
      points += p;
    },
  };
};

const deerLauncher = (dcs: DeerController[], time: number) => {
  let sec = 0;
  let leadDistance = 0;
  let leaders: DeerController[] = [];

  while (sec < time) {
    dcs.forEach((dc) => {
      dc.runTime();
      const { distance } = dc.result();
      if (distance > leadDistance) {
        leadDistance = distance;
        leaders = [];
        leaders.push(dc);
      } else if (distance === leadDistance) {
        leaders.push(dc);
      }
    });
    leaders.forEach((dc) => {
      dc.addPoints(1);
    });
    leaders = [];
    leadDistance = 0;
    sec++;
  }

  return dcs;
};

async function main() {
  const file = Bun.file("input.txt");
  const input = await file.text();
  const lines = input.split("\n");
  const deers = lines.map(parseLine);
  const dcs = deers.map(deerController);

  const results = deerLauncher(dcs, 2503);

  const scores = results
    .map((r) => {
      const _r = r.result();
      return { name: _r.deer.name, distance: _r.distance, points: _r.points };
    })
    .sort((a, b) => b.points - a.points);

  console.log(scores);
}

main();
