import { ballColorDef } from "./Utils";

import _ from "lodash";

interface Colors {
  [key: string]: number;
}

//export const gameSolver = (grid: Array<string[]>): number => {
export const gameSolver = (
  grid: Array<ballColorDef[]>,
  logInfo: boolean = false
): number => {
  const prepareGrid = (grid: Array<ballColorDef[]>): Array<string[]> => {
    const newArray: Array<string[]> = _.map(grid, (item) => {
      item.reverse();
      return _.map(item, (ball) => ball.name);
    });
    newArray.push([]);
    newArray.push([]);
    return newArray;
  };

  const getTubeHeight = (grid: Array<string[]>): number => {
    const max = _.max(
      _.map(grid, (item) => {
        return item.length;
      })
    );

    return max || 0;
  };

  const isValidGrid = (grid: Array<string[]>): boolean => {
    const numTubes = grid.length;
    const tubeHeight = getTubeHeight(grid);
    const numBallsRequired = (numTubes - 2) * tubeHeight;
    const numBalls = grid.reduce((total, item) => total + item.length, 0);

    if (numBalls !== numBallsRequired) {
      console.log("Grid has incorrect number of balls");
      return false;
    }

    let freqs: Colors = {};
    grid.forEach((tube) => {
      tube.forEach((ball) => {
        if (!freqs.hasOwnProperty(ball)) {
          freqs[ball] = 1;
        } else {
          freqs[ball] += 1;
        }
      });
    });

    return _.every(freqs, (count, key) => {
      const result = count === tubeHeight;
      if (!result)
        console.log(
          "Expected " + tubeHeight + " " + key + " balls, found " + count
        );

      return result;
    });
  };

  const onlyUnique = (value: any, index: number, self: any): boolean => {
    return self.indexOf(value) === index;
  };

  const isSolved = (grid: Array<string[]>, tubeHeight: number = 0): boolean => {
    if (tubeHeight === 0) tubeHeight = getTubeHeight(grid);

    // tiene que haber 2 tubos vacios
    const emptyTubes = grid.filter((value) => {
      return value.length === 0;
    }).length;

    if (emptyTubes !== 2) return false;

    const finishedTubes = grid.filter((tubeValue) => {
      if (!tubeValue.length || tubeValue.length < tubeHeight) return false;

      const uniques = tubeValue.filter(onlyUnique);
      return uniques.length === 1;
    });

    return finishedTubes.length === grid.length - 2;
  };

  const printGridToString = (grid: Array<string[]>): string => {
    const lines: Array<string> = [];
    _.each(grid, (tube) => lines.push(tube.join()));
    return lines.join("\n");
  };

  const isMoveValid = (
    tubeHeight: number,
    fromTube: Array<string>,
    candidateTube: Array<string>
  ): boolean => {
    // # move is valid if the source tube isn't empty,
    // # the destination isn't full,
    // # and the ball at the end of the source tube is the same as the
    // # ball at the end of the destination.
    // # But there are also some optimisations to avoid pointless moves.

    if (fromTube.length === 0 || candidateTube.length === tubeHeight)
      return false;

    const numFirstColour = fromTube.filter(
      (ball: string) => ball === fromTube[0]
    );

    if (numFirstColour.length === tubeHeight) return false; // # tube is full of same colour, don't touch it

    if (candidateTube.length === 0) {
      if (numFirstColour.length === fromTube.length) return false; // # source tube all the same colour, so pointless moving to empty tube
      return true;
    }
    return (
      fromTube[fromTube.length - 1] === candidateTube[candidateTube.length - 1]
    );
  };

  const gridToCanonicalString = (grid: Array<string[]>): string => {
    const tubeStrings: Array<string> = [];

    _.each(grid, (tube) => tubeStrings.push(tube.join(",")));

    const sortedTubeStrings = tubeStrings.sort();

    return sortedTubeStrings.join(";");
  };

  const solveGrid = (
    grid: Array<string[]>,
    visitedPositions = new Set<string>(),
    answer: string[] = [],
    tubeHeight: number = 0
  ): boolean => {
    if (tubeHeight === 0) tubeHeight = getTubeHeight(grid);

    visitedPositions.add(gridToCanonicalString(grid));

    for (let i = 0; i < grid.length; i++) {
      const tube = grid[i];
      for (let j = 0; j < grid.length; j++) {
        if (i === j) continue;
        const candidateTube = grid[j];
        if (isMoveValid(tubeHeight, tube, candidateTube)) {
          const grid2: Array<string[]> = _.cloneDeep(grid);
          grid2[j].push(grid2[i].pop()!);
          if (isSolved(grid2, tubeHeight)) {
            answer.push(printGridToString(grid2));
            return true;
          }

          if (!visitedPositions.has(gridToCanonicalString(grid2))) {
            const solved = solveGrid(
              grid2,
              visitedPositions,
              answer,
              tubeHeight
            );
            if (solved) {
              answer.push(printGridToString(grid2));
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const modArray = prepareGrid(grid);

  if (!isValidGrid(modArray)) {
    console.log("Invalid grid");
    return 0;
  }

  if (isSolved(modArray)) {
    console.log("Grid is already solved");
    return 0;
  }

  const answer: string[] = [];
  const visitedPositions = new Set<string>();
  const solved = solveGrid(modArray, visitedPositions, answer);

  if (!solved) return 0;
  else {
    const totalMoves = answer.length < 10 ? answer.length : Math.floor(answer.length * 0.7);
    //console.log("Solved in " + totalMoves + " moves");
    if (logInfo) {
      answer.reverse();
      _.each(answer, (item) => {
        console.log(item);
        console.log("--");
      });
    }
    return totalMoves;
  }

  return 0;

};
