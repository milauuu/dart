import { ref, reactive,computed } from "vue";

// declaring Player interface
interface Player {
    name: string,
    score: number,  //score left to shoot
    dartsThisLeg: number,
    totalPointsScored: number,  //not displayed, needed for average
    legsWon: number,  //score-tracker for multiple legs
}

// declare the current state of the game -> source of truth
const state = reactive({
    phase: 'setup' as 'setup' | 'game' | 'winner',
    players: [] as Player[],
    currentPlayerIndex: 0,
    totalLegs: 1,
    currentLeg: 1,
    startingPlayerIndex: 0,
});

// Derived state , takes raw data and devies it into only readable values --> only gets the results
export function useGame() {
    return {
        state,
        currentPlayer,
        matchWinner,
        startGame,
        submitScore,
        resetGame,
  }
}

export function startGame(names: string[], legs: number) {
    state.phase = 'game'
    state.totalLegs = legs
    state.currentLeg = 1
    state.currentPlayerIndex = 0
    state.startingPlayerIndex = 0

    //generates the whole player interface for every Name of the Name-Array
    state.players = names.map(name => ({
        name,
        score: 501,
        dartsThisLeg: 0,
        totalPointsScored: 0,
        legsWon: 0,
    }))
    }


export function submitScore(currentPlayer: Player, points: number) {
  const newScore = currentPlayer.score - points

  if (isBust(newScore)) {
    player.dartsThisLeg += 3
    nextPlayer()
    return
  }

  player.score = newScore
  player.totalPointsScored += points
  player.dartsThrown += 3
  player.dartsThisLeg += 3

  if (newScore === 0) {
    legWon()
    return
  }

  nextPlayer()
}