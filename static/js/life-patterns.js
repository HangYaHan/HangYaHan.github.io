(function () {
  function parse(rows) {
    var cells = [];
    for (var y = 0; y < rows.length; y++) {
      for (var x = 0; x < rows[y].length; x++) {
        if (rows[y][x] === 'O') cells.push([x, y]);
      }
    }
    return cells;
  }

  window.LIFE_PATTERNS = [
    {
      key: 'glider', name: '滑翔机', en: 'Glider',
      w: 3, h: 3, grid: [14, 14], cycle: 40,
      cells: parse(['.O.', '..O', 'OOO'])
    },
    {
      key: 'lwss', name: '轻型飞船', en: 'LWSS',
      w: 5, h: 4, grid: [18, 12], cycle: 60,
      cells: parse(['.O..O', 'O....', 'O...O', 'OOOO.'])
    },
    {
      key: 'pulsar', name: '脉冲星', en: 'Pulsar',
      w: 13, h: 13, grid: [19, 19], cycle: 12,
      cells: parse([
        '..OOO...OOO..',
        '.............',
        'O....O.O....O',
        'O....O.O....O',
        'O....O.O....O',
        '..OOO...OOO..',
        '.............',
        '..OOO...OOO..',
        'O....O.O....O',
        'O....O.O....O',
        'O....O.O....O',
        '.............',
        '..OOO...OOO..'
      ])
    },
    {
      key: 'rpent', name: 'R 五连', en: 'R-pentomino',
      w: 3, h: 3, grid: [24, 24], cycle: 160,
      cells: parse(['.OO', 'OO.', '.O.'])
    },
    {
      key: 'gun', name: '高斯帕滑翔机枪', en: 'Gosper Glider Gun',
      w: 36, h: 9, grid: [46, 26], cycle: 120,
      cells: parse([
        '........................O...........',
        '......................O.O...........',
        '............OO......OO............OO',
        '...........O...O....OO............OO',
        'OO........O.....O...OO..............',
        'OO........O...O.OO....O.O...........',
        '..........O.....O.......O...........',
        '...........O...O....................',
        '............OO......................'
      ])
    },
    {
      key: 'blinker', name: '闪烁灯', en: 'Blinker',
      w: 3, h: 1, grid: [10, 10], cycle: 6,
      cells: parse(['OOO'])
    }
  ];
})();
